import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      // options can be added here if needed
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}
