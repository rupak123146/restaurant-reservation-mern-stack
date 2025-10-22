import { Router } from 'express';
import Booking from '../models/Booking.js';

const router = Router();

// Create booking
router.post('/', async (req, res, next) => {
  try {
    const { userEmail, name, phone, partySize, date, notes } = req.body;
    if (!userEmail || !name || !partySize || !date) {
      return res.status(400).json({ error: 'userEmail, name, partySize, date are required' });
    }
    const booking = await Booking.create({ userEmail, name, phone, partySize, date, notes });
    console.log('[BOOKINGS] Created', { id: booking._id.toString(), userEmail: booking.userEmail, date: booking.date });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// List bookings
router.get('/', async (req, res, next) => {
  try {
    const { email } = req.query;
    const filter = email ? { userEmail: email } : {};
    const items = await Booking.find(filter).sort({ createdAt: -1 });
    console.log('[BOOKINGS] List', { count: items.length, filter });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// Seed a sample booking for quick testing
router.get('/seed', async (_req, res, next) => {
  try {
    const sample = await Booking.create({
      userEmail: 'seed@example.com',
      name: 'Seed User',
      phone: '0000000000',
      partySize: 2,
      date: new Date(Date.now() + 24*60*60*1000),
      notes: 'Inserted by /api/bookings/seed'
    });
    console.log('[BOOKINGS] Seed created', { id: sample._id.toString() });
    res.status(201).json(sample);
  } catch (err) {
    next(err);
  }
});

export default router;
