import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
role: { type: String, enum:['superadmin', 'admin', 'coder'], default: 'coder' },
 status: { 
    type: String, 
    enum: ['active', 'suspended'], 
    default: 'active' 
  },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  refreshToken: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);