import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    partySize: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
