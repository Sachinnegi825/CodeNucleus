import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: String,
  subdomain: { type: String, unique: true },
  logoUrl: String,
  settings: {
    primaryColor: { type: String, default: '#2563eb' },
    accuracyThreshold: { type: Number, default: 0.85 },
  }
}, { timestamps: true });

export default mongoose.model('Organization', organizationSchema);