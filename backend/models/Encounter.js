import mongoose from 'mongoose';

const encounterSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  status: { 
    type: String, 
    enum:['pending', 'scrubbed', 'coded', 'reviewed', 'completed'], 
    default: 'pending' 
  },
  
  fileName: String, 
  pdfS3Key: { type: String, required: true }, 
  
  // NEW: Text Storage for the AI Pipeline
  rawText: { type: String },
  scrubbedText: { type: String },
  phiMap: { type: Map, of: String }, // Stores {"[PERSON_NAME_1]": "John Doe"}
  status: { 
  type: String, 
  enum:['pending', 'scrubbed', 'coded', 'pending_qa', 'returned', 'completed'], 
  default: 'pending' 
},
  aiResults:[{
    code: String,
    description: String,
    type: { type: String, enum:['ICD-10-CM', 'CPT', 'HCPCS'] },
    confidence: Number,
    denialRisk: { score: Number, reason: String }
  }]
}, { timestamps: true });

export default mongoose.model('Encounter', encounterSchema);