import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
// Change the role line to this:
role: { type: String, enum:['superadmin', 'admin', 'coder', 'auditor'], default: 'coder' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  refreshToken: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);