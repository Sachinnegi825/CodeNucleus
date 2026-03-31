import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import Encounter from '../models/Encounter.js';
import { bucket, generateSignedUrl } from '../config/gcsConfig.js';
import { scrubText } from '../utils/dlpScrubber.js';

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
    const encounters = await Encounter.find({ organizationId: req.user.orgId }).sort({ createdAt: -1 }).populate('uploadedBy', 'email');
    res.json(encounters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch encounters" });
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