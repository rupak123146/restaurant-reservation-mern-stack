import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema(
  {
    email: { type: String, lowercase: true, trim: true },
    success: { type: Boolean, required: true },
    reason: { type: String, default: '' },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('LoginLog', loginLogSchema);
