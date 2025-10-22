import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import healthRouter from './routes/health.routes.js';
import errorHandler from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';
import recordsRouter from './routes/records.routes.js';
import authRouter from './routes/auth.routes.js';
import bookingsRouter from './routes/bookings.routes.js';

dotenv.config();

const app = express();

// Config
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/records', recordsRouter);
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'MERN backend is running',
    endpoints: ['/api/health', '/api/records', '/api/records/seed', '/api/auth/register', '/api/auth/login', '/api/bookings']
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(errorHandler);

// Start server after DB connection
async function start() {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
