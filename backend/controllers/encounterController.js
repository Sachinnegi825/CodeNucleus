import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import Encounter from '../models/Encounter.js';
import { bucket, generateSignedUrl } from '../config/gcsConfig.js';
import { decrypt, scrubText } from '../utils/dlpScrubber.js';
import { analyzeMedicalText } from '../utils/aiService.js';
import PayerRule from '../models/PayerRule.js';
import { buildFHIRBundle } from '../utils/fhirMapper.js';
import mongoose from 'mongoose';

// v3.11.174 has the legacy path and works perfectly in Node.js
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

export const uploadRecord = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const { orgId, userId } = req.user;
    const fileKey = `records/${orgId}/${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;
    const blob = bucket.file(fileKey);
    const blobStream = blob.createWriteStream({ resumable: false, contentType: req.file.mimetype });
    blobStream.on('error', (err) => { console.error("GCS Upload Error:", err); res.status(500).json({ error: "Failed to upload to Google Cloud" }); });
    blobStream.on('finish', async () => {
      const encounter = await Encounter.create({ organizationId: orgId, uploadedBy: userId, fileName: req.file.originalname, pdfS3Key: fileKey, status: 'pending' });
      res.status(201).json({ message: "Record uploaded securely to GCP", encounter });
    });
    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: "Server error during upload" });
  }
};

export const getEncounters = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // 1. Convert to integers for math
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // 2. Base Query (Multi-tenant lock)
    let query = { organizationId: req.user.orgId };

    // 🛡️ SECURITY: Coders only see their own uploads
    if (req.user.role === 'coder') {
      query.uploadedBy = req.user.userId;
    }
    
    // 3. Status Filtering Logic
    if (status === 'active') {
      // Coder sees new files or files sent back by the Admin
      query.status = { $in: ['pending', 'scrubbed', 'coded', 'returned'] }; 
    } else if (status === 'pending_qa') {
      // Admin sees files waiting for approval
      query.status = 'pending_qa';
    } else if (status === 'completed') {
      // History / Archive
      query.status = 'completed';
    }

    // 4. Execute Parallel Queries (Count + Find)
    const [totalEncounters, encounters] = await Promise.all([
      Encounter.countDocuments(query),
      Encounter.find(query)
        .sort({ createdAt: -1 })
        .populate('uploadedBy', 'email')
        .skip(skip)
        .limit(limitNum)
    ]);

    res.json({
      encounters,
      totalEncounters,
      totalPages: Math.ceil(totalEncounters / limitNum),
      currentPage: pageNum
    });

  } catch (error) {
    console.error("Fetch Encounters Error:", error);
    res.status(500).json({ error: "Failed to fetch encounters" });
  }
};

// 2. NEW: Get Coder Performance Stats
export const getCoderStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orgId = req.user.orgId;

    const allRecords = await Encounter.find({ organizationId: orgId, uploadedBy: userId });

    const stats = {
      totalUploaded: allRecords.length,
      completed: allRecords.filter(e => e.status === 'reviewed').length,
      pending: allRecords.filter(e => e.status !== 'reviewed').length,
      avgConfidence: 0
    };

    // Calculate average AI confidence from results
    let totalConf = 0;
    let count = 0;
    allRecords.forEach(enc => {
      enc.aiResults.forEach(res => {
        totalConf += res.confidence || 0;
        count++;
      });
    });
    stats.avgConfidence = count > 0 ? (totalConf / count).toFixed(2) : 0;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

export const viewRecord = async (req, res) => {
  try {
    const encounter = await Encounter.findOne({ _id: req.params.id, organizationId: req.user.orgId });
    if (!encounter) return res.status(404).json({ message: "Record not found" });
    const secureUrl = await generateSignedUrl(encounter.pdfS3Key);
    res.json({ secureUrl, fileName: encounter.fileName });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate secure link" });
  }
};

export const scrubRecord = async (req, res) => {
  try {
    const encounter = await Encounter.findOne({ _id: req.params.id, organizationId: req.user.orgId });
    if (!encounter) return res.status(404).json({ message: "Record not found" });
    if (encounter.status !== 'pending') return res.status(400).json({ message: "Record already scrubbed" });

    // 1. Download PDF from GCS
    const file = bucket.file(encounter.pdfS3Key);
    const [buffer] = await file.download();

    // 2. Extract Text (v3 legacy build — no DOMMatrix, no browser deps)
const loadingTask = pdfjsLib.getDocument({ 
  data: new Uint8Array(buffer),
  useSystemFonts: true,
  useWorkerFetch: false,
  isEvalSupported: false,
  disableFontFace: true   // ← skips all font/canvas loading entirely
}); 
   const pdf = await loadingTask.promise;
    let rawText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      rawText += content.items.map(item => item.str).join(' ') + '\n';
    }

    if (!rawText || rawText.trim() === '') {
      return res.status(400).json({ message: "Could not extract text from PDF (Might be a scanned image)" });
    }

    // 3. Run Google Cloud DLP

    console.log("raw", rawText.substring(0, 200)); // Log first 200 chars of raw text for debugging
    const { scrubbedText, phiMap } = await scrubText(rawText);

    // 4. Update Database
    encounter.rawText = rawText;
    encounter.scrubbedText = scrubbedText;
    encounter.phiMap = phiMap;
    encounter.status = 'scrubbed';
    await encounter.save();

    res.json({ message: "PHI Successfully Scrubbed", status: encounter.status, scrubbedText: encounter.scrubbedText, phiMapCount: Object.keys(encounter.phiMap || {}).length });

  } catch (error) {
    console.error("Scrubbing Error:", error);
    res.status(500).json({ error: "Failed to scrub PHI from document" });
  }
};


export const analyzeEncounter = async (req, res) => {
  try {
    const encounter = await Encounter.findOne({ _id: req.params.id, organizationId: req.user.orgId });
    if (!encounter) return res.status(404).json({ message: "Record not found" });

    // 1. Call Groq AI (You already have this part working)
    const aiData = await analyzeMedicalText(encounter.scrubbedText); 
    let extractedCodes = aiData.codes;

    // 2. 🛡️ Denial Intelligence: Check codes against Payer Rules
    const analyzedCodes = await Promise.all(extractedCodes.map(async (item) => {
      const rule = await PayerRule.findOne({ ruleCode: item.code });
      
      if (rule) {
        return {
          ...item,
          denialRisk: {
            score: rule.severity === 'error' ? 0.9 : 0.5,
            reason: `${rule.payerName} Rule: ${rule.requirement}`
          }
        };
      }
      return item;
    }));

    // 3. Save to DB
    encounter.aiResults = analyzedCodes;
    encounter.status = 'coded';
    await encounter.save();

    res.json({ results: encounter.aiResults, status: encounter.status });
  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
};

// 🔴 NEW: Update Encounter (For Human Edits)
export const updateEncounter = async (req, res) => {
  try {
    const { aiResults, status } = req.body;
    const encounter = await Encounter.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.orgId },
      { aiResults, status },
      { new: true }
    );
    res.json(encounter);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const exportFHIR = async (req, res) => {
  try {
    const encounter = await Encounter.findOne({ 
      _id: req.params.id, 
      organizationId: req.user.orgId 
    });

    if (!encounter) return res.status(404).json({ message: "Encounter not found" });

    // 1. RE-HYDRATION: Decrypt the name for the FHIR file
    let realName = "De-identified Patient";
    if (encounter.phiMap) {
      const nameKey = Object.keys(encounter.phiMap).find(key => key.includes('PERSON_NAME'));
      if (nameKey) {
        realName = decrypt(encounter.phiMap[nameKey]); 
      }
    }

    // 2. GENERATE the FHIR Bundle (This uses the PHI one last time)
    const fhirBundle = buildFHIRBundle(encounter, realName);

    // 3. 🛡️ THE SECURITY PURGE (Data Minimization)
    
    // A. Delete the PDF from Google Cloud Storage
    try {
      const file = bucket.file(encounter.pdfS3Key);
      await file.delete();
      console.log(`Cloud Storage: Deleted file ${encounter.pdfS3Key}`);
    } catch (gcsError) {
      console.error("GCS Deletion Error (File might already be gone):", gcsError.message);
    }

    // B. Wipe Sensitive Fields from MongoDB
    encounter.phiMap = undefined;    // Remove the encrypted name map
    encounter.rawText = undefined;   // Remove the original clinical notes
    encounter.scrubbedText = undefined; // Remove the de-identified notes
    encounter.status = 'completed';  // Mark as finished
    
    await encounter.save();

    // 4. Return the FHIR Bundle to the Admin for download
    res.json(fhirBundle);

  } catch (error) {
    console.error("FHIR Export & Purge Error:", error);
    res.status(500).json({ error: "Export failed during security wipe." });
  }
};


export const getAdminStats = async (req, res) => {
  try {
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Basic Counts
    const totalVolume = await Encounter.countDocuments({ organizationId: orgId });
    const completed = await Encounter.countDocuments({ organizationId: orgId, status: 'reviewed' });
    
    // 2. Productivity Chart (Last 7 days)
    const chartData = await Encounter.aggregate([
      { $match: { organizationId: orgId, createdAt: { $gte: sevenDaysAgo } } },
      { $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
          count: { $sum: 1 } 
      } },
      { $sort: { "_id": 1 } }
    ]).then(res => res.map(item => ({ date: item._id, records: item.count })));

    // 3. 🏆 REAL Top Coding Staff (The Fix)
    const topCoders = await Encounter.aggregate([
      { 
        $match: { organizationId: orgId } // Look for all files in this Agency
      },
      { 
        $group: { 
          _id: "$uploadedBy", 
          count: { $sum: 1 } 
        } 
      },
      { 
        $lookup: { 
          from: "users",           // Must match your MongoDB collection name (usually lowercase plural)
          localField: "_id", 
          foreignField: "_id", 
          as: "userDetails" 
        } 
      },
      { $unwind: "$userDetails" }, 
      { 
        $project: { 
          email: "$userDetails.email", 
          count: 1 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

 

    res.json({
      summary: {
        totalVolume,
        completed,
        pending: totalVolume - completed,
        accuracy: "94.2%" 
      },
      chartData,
      topCoders
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    res.status(500).json({ error: "Stats error" });
  }
};