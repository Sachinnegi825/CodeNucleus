import Encounter from '../models/Encounter.js';
import { bucket, generateSignedUrl } from '../config/gcsConfig.js';

// 1. Upload Medical Record to Google Cloud
export const uploadRecord = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const { orgId, userId } = req.user;
    const fileKey = `records/${orgId}/${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;

    // Create a Google Cloud Stream
    const blob = bucket.file(fileKey);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on('error', (err) => {
      console.error("GCS Upload Error:", err);
      res.status(500).json({ error: "Failed to upload to Google Cloud" });
    });

    blobStream.on('finish', async () => {
      // Create DB Entry only AFTER cloud upload succeeds
      const encounter = await Encounter.create({
        organizationId: orgId,
        uploadedBy: userId,
        fileName: req.file.originalname,
        pdfS3Key: fileKey, // We'll keep the variable name for ease, or rename to pdfGcsKey
        status: 'pending'
      });

      res.status(201).json({ message: "Record uploaded securely to GCP", encounter });
    });

    // Pipe the buffer into the stream
    blobStream.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ error: "Server error during upload" });
  }
};


export const getEncounters = async (req, res) => {
  try {
    const encounters = await Encounter.find({ organizationId: req.user.orgId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'email'); // Get the coder's email

    res.json(encounters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch encounters" });
  }
};

// 3. Get the 10-Minute Secure Viewing Link
export const viewRecord = async (req, res) => {
  try {
    const encounter = await Encounter.findOne({ 
      _id: req.params.id, 
      organizationId: req.user.orgId 
    });

    if (!encounter) return res.status(404).json({ message: "Record not found" });

    // Generate the GCP expiring link
    const secureUrl = await generateSignedUrl(encounter.pdfS3Key);

    res.json({ secureUrl, fileName: encounter.fileName });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate secure link" });
  }
};