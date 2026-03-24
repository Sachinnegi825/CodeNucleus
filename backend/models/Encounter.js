import mongoose from 'mongoose';

const encounterSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Status of the pipeline
  status: { 
    type: String, 
    enum:['pending', 'scrubbed', 'coded', 'reviewed', 'completed'], 
    default: 'pending' 
  },
  
  // File Storage
  fileName: String, // Original name (e.g., "patient_smith.pdf")
  pdfS3Key: { type: String, required: true }, // The secret path in S3
  
  // Placeholders for Weeks 3 & 4
  phiMap: { type: Map, of: String }, // For the AI De-identification moat
  aiResults: [{
    code: String,
    description: String,
    type: { type: String, enum:['ICD-10-CM', 'CPT', 'HCPCS'] },
    confidence: Number,
    denialRisk: { score: Number, reason: String }
  }]
}, { timestamps: true });

export default mongoose.model('Encounter', encounterSchema);