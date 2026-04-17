import mongoose from 'mongoose';

const payerRuleSchema = new mongoose.Schema({
  // Tied to the specific Agency
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  
  payerName: { type: String, required: true }, // e.g., "Medicare", "Cigna"
  ruleCode: { type: String, required: true },  // The ICD-10 or CPT code (e.g., "I10" or "99214")
  requirement: { type: String, required: true }, // The message shown to coders
  severity: { type: String, enum: ['warning', 'error'], default: 'warning' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('PayerRule', payerRuleSchema);