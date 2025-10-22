import { Router } from 'express';
import Record from '../models/Record.js';

const router = Router();

// Create a new record
router.post('/', async (req, res, next) => {
  try {
    const { title, notes } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const created = await Record.create({ title, notes });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// List all records
router.get('/', async (_req, res, next) => {
  try {
    const items = await Record.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// Seed a sample record for quick testing
router.get('/seed', async (_req, res, next) => {
  try {
    const sample = await Record.create({ title: 'Sample Record', notes: 'Inserted by /api/records/seed' });
    res.status(201).json(sample);
  } catch (err) {
    next(err);
  }
});

export default router;
