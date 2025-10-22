import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import LoginLog from '../models/LoginLog.js';

const router = Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    console.log('[AUTH] Registered user', { id: user._id.toString(), email: user.email });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findOne({ email });
    const success = !!user && (await bcrypt.compare(password, user.passwordHash));

    await LoginLog.create({
      email,
      success,
      reason: success ? 'ok' : (!user ? 'user_not_found' : 'bad_password'),
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    });
    console.log('[AUTH] Login attempt', { email, success });

    if (!success) return res.status(401).json({ error: 'Invalid credentials' });

    // For simplicity, we return basic profile (no JWT in this minimal setup)
    res.json({ ok: true, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
});

// Developer helpers: list users and login logs (limit fields)
router.get('/users', async (_req, res, next) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(50);
    res.json(users);
  } catch (err) { next(err); }
});

router.get('/loginlogs', async (_req, res, next) => {
  try {
    const logs = await LoginLog.find({}, { email: 1, success: 1, reason: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) { next(err); }
});

// Dev seeds: create a sample user and a sample login log
router.get('/seed-user', async (_req, res, next) => {
  try {
    const email = 'seeduser@example.com';
    let user = await User.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash('secret123', 10);
      user = await User.create({ name: 'Seed User', email, passwordHash });
      console.log('[AUTH] Seed user created', { id: user._id.toString(), email });
    }
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) { next(err); }
});

router.get('/seed-login', async (_req, res, next) => {
  try {
    const email = 'seeduser@example.com';
    await LoginLog.create({ email, success: true, reason: 'seed_ok' });
    console.log('[AUTH] Seed login log created', { email });
    res.status(201).json({ ok: true, email });
  } catch (err) { next(err); }
});

export default router;
