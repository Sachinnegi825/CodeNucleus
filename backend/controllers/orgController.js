import { s3Client } from '../config/s3Config.js';
import Organization from '../models/Organization.js';
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const updateBranding = async (req, res) => {
  try {
    const { orgId } = req.user; // From Auth Middleware
    const { primaryColor, name } = req.body;
    let logoUrl = req.body.logoUrl;

    // 1. If a new file was uploaded via Multer
    if (req.file) {
      const fileName = `logos/${orgId}-${Date.now()}-${req.file.originalname}`;
      
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      logoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    // 2. Update Database
    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { 
        name, 
        'settings.primaryColor': primaryColor,
        logoUrl: logoUrl 
      },
      { new: true }
    );

    res.json({ message: "Branding updated successfully", updatedOrg });
  } catch (error) {
    console.error(error);
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