import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Record', recordSchema);
