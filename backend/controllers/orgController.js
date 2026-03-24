import Organization from '../models/Organization.js';
import { bucket } from '../config/gcsConfig.js'; 

export const updateBranding = async (req, res) => {
  try {
    const { orgId } = req.user;
    const { primaryColor } = req.body;
    let logoUrl = req.body.logoUrl;

    if (req.file) {
      const fileKey = `logos/${orgId}-${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;
      const blob = bucket.file(fileKey);
      
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
      });

      await new Promise((resolve, reject) => {
        blobStream.on('error', reject);
        blobStream.on('finish', async () => {
          // REMOVED blob.makePublic() to comply with GCP Uniform Access
          logoUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${fileKey}`;
          resolve();
        });
        blobStream.end(req.file.buffer);
      });
    }

    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId, 
      { 'settings.primaryColor': primaryColor, ...(logoUrl && { logoUrl }) }, 
      { new: true }
    );

    res.json({ message: "Branding updated successfully", updatedOrg });
  } catch (error) {
    console.error("updateBranding error:", error);
    res.status(500).json({ error: "Failed to update branding" });
  }
};

export const getBranding = async (req, res) => {
  try {
    const org = await Organization.findById(req.user.orgId);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    res.json({
      name: org.name,
      primaryColor: org.settings?.primaryColor || '#3b82f6',
      logoUrl: org.logoUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};