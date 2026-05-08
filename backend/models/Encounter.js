import mongoose from 'mongoose';

const encounterSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  status: { 
    type: String, 
    enum:['pending', 'scrubbed', 'coded', 'pending_qa', 'returned', 'completed'], 
    default: 'pending' 
  },
  
  fileName: String, 
  pdfS3Key: { type: String, required: true }, 
  
  // Text Storage for the AI Pipeline
  rawText: { type: String },
  scrubbedText: { type: String },
  phiMap: { type: Map, of: String }, // Stores {"[PERSON_NAME_1]": "John Doe"}

  aiResults:[{
    code: String,
    description: String,
    type: { type: String, enum:['ICD-10-CM', 'CPT', 'HCPCS'] },
    confidence: Number,
    denialRisk: { score: Number, reason: String }
  }]
}, { timestamps: true });

// Performance Indexes for Senior-Level Scaling
encounterSchema.index({ organizationId: 1, status: 1 });
encounterSchema.index({ organizationId: 1, uploadedBy: 1, status: 1 });
encounterSchema.index({ createdAt: -1 }); // For recent history queries

export default mongoose.model('Encounter', encounterSchema);