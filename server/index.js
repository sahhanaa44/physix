import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User, Experiment, Progress } from './models.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'development-only-change-this-secret';
const allowedOrigins = (process.env.CLIENT_ORIGIN || '').split(',').map(x => x.trim()).filter(Boolean);
app.use(cors({ origin(origin, callback) { if (!origin || (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) || (process.env.NODE_ENV !== 'production' && allowedOrigins.length === 0)) return callback(null, true); return callback(new Error('Origin not allowed by CORS')); }, credentials: false }));
app.use(express.json({ limit: '1mb' }));
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const safeUser = u => ({ id: u._id, name: u.name, email: u.email, xp: u.xp, level: u.level, streak: u.streak, longestStreak: u.longestStreak, completedLessons: u.completedLessons, experimentsCompleted: u.experimentsCompleted });
const auth = async (req, res, next) => { try { const token = (req.headers.authorization || '').replace(/^Bearer\s+/, ''); if (!token) return res.status(401).json({ message: 'Authentication required' }); const data = jwt.verify(token, SECRET); req.user = await User.findById(data.id); if (!req.user) return res.status(401).json({ message: 'User not found' }); next(); } catch { return res.status(401).json({ message: 'Invalid or expired session' }); } };
let databaseConnection;
app.use('/api', async (_req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) return res.status(503).json({ message: 'Database is not configured. Set MONGODB_URI in the hosting environment.' });
    if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_ORIGIN) return res.status(503).json({ message: 'Server security is not configured. Set CLIENT_ORIGIN to your deployed frontend URL.' });
    if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
      return res.status(503).json({ message: 'Server security is not configured. Set a JWT_SECRET of at least 32 characters.' });
    }
    if (mongoose.connection.readyState !== 1) {
      if (!databaseConnection) databaseConnection = mongoose.connect(process.env.MONGODB_URI).catch(error => { databaseConnection = undefined; throw error; });
      await databaseConnection;
    }
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    res.status(503).json({ message: 'Database connection unavailable. Check the server MONGODB_URI and Atlas network access.' });
  }
});
app.get('/api/health', (_req, res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ ok: mongoose.connection.readyState === 1, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.post('/api/auth/register', async (req, res) => { try { const { name, email, password } = req.body || {}; if (typeof name !== 'string' || name.trim().length < 2 || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== 'string' || password.length < 8) return res.status(400).json({ message: 'Enter a name, valid email and password of at least 8 characters.' }); const normalized = email.trim().toLowerCase(); if (await User.findOne({ email: normalized })) return res.status(409).json({ message: 'An account with this email already exists.' }); const passwordHash = await bcrypt.hash(password, 12); const user = await User.create({ name: name.trim(), email: normalized, passwordHash }); const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '7d' }); res.status(201).json({ token, user: safeUser(user) }); } catch { res.status(500).json({ message: 'Could not create account. Check the server and database connection.' }); } });
app.post('/api/auth/login', async (req, res) => { try { const { email, password } = req.body || {}; const user = await User.findOne({ email: String(email || '').trim().toLowerCase() }); if (!user || !user.passwordHash || !await bcrypt.compare(password || '', user.passwordHash)) return res.status(401).json({ message: 'Incorrect email or password.' }); const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '7d' }); res.json({ token, user: safeUser(user) }); } catch { res.status(500).json({ message: 'Login failed. Check the server connection.' }); } });
app.post('/api/auth/google', async (req, res) => { try { if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ message: 'Google sign-in is not configured.' }); const ticket = await googleClient.verifyIdToken({ idToken: req.body.credential, audience: process.env.GOOGLE_CLIENT_ID }); const payload = ticket.getPayload(); if (!payload?.email || !payload.email_verified) return res.status(401).json({ message: 'Google account email is not verified.' }); let user = await User.findOne({ email: payload.email.toLowerCase() }); if (!user) user = await User.create({ name: payload.name || payload.email.split('@')[0], email: payload.email.toLowerCase(), passwordHash: null }); const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '7d' }); res.json({ token, user: safeUser(user) }); } catch { res.status(401).json({ message: 'Google sign-in could not be verified.' }); } });
app.get('/api/me', auth, async (req, res) => res.json({ user: safeUser(req.user) }));
app.post('/api/progress', auth, async (req, res) => { try { const { lessonId, lessonTitle, score } = req.body || {}; if (typeof lessonId !== 'string' || !lessonId || typeof lessonTitle !== 'string' || !lessonTitle) return res.status(400).json({ message: 'A lesson ID and title are required.' }); const existing = await Progress.findOne({ userId: req.user._id, lessonId }); if (existing) return res.status(200).json({ progress: existing, user: safeUser(req.user), alreadyCompleted: true }); const numericScore = Math.max(0, Math.min(100, Number(score) || 0)); const row = await Progress.create({ userId: req.user._id, lessonId, lessonTitle: lessonTitle.slice(0, 180), score: numericScore }); req.user.completedLessons += 1; req.user.xp += numericScore >= 80 ? 30 : 20; req.user.level = Math.floor(req.user.xp / 250) + 1; const today = new Date(); const todayKey = today.toISOString().slice(0, 10); const lastKey = req.user.lastActiveDate ? new Date(req.user.lastActiveDate).toISOString().slice(0, 10) : ''; if (lastKey !== todayKey) { const yesterday = new Date(today); yesterday.setUTCDate(yesterday.getUTCDate() - 1); req.user.streak = lastKey === yesterday.toISOString().slice(0, 10) ? req.user.streak + 1 : 1; req.user.longestStreak = Math.max(req.user.longestStreak || 0, req.user.streak); req.user.lastActiveDate = today; } await req.user.save(); res.status(201).json({ progress: row, user: safeUser(req.user) }); } catch { res.status(500).json({ message: 'Could not save progress.' }); } });
app.get('/api/progress', auth, async (req, res) => res.json({ items: await Progress.find({ userId: req.user._id }).sort({ completedAt: -1 }).limit(100) }));
app.get('/api/experiments', auth, async (req, res) => res.json({ items: await Experiment.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100) }));
app.post('/api/experiments', auth, async (req, res) => { try { const title = String(req.body.title || 'Untitled experiment').slice(0, 180); const mode = ['2D', '3D'].includes(req.body.mode) ? req.body.mode : '2D'; const config = req.body.config && typeof req.body.config === 'object' ? req.body.config : {}; const item = await Experiment.create({ userId: req.user._id, title, mode, config }); req.user.experimentsCompleted += 1; await req.user.save(); res.status(201).json({ item, user: safeUser(req.user) }); } catch { res.status(500).json({ message: 'Could not save experiment.' }); } });
app.delete('/api/experiments/:id', auth, async (req, res) => { await Experiment.deleteOne({ _id: req.params.id, userId: req.user._id }); res.json({ ok: true }); });
// Export the Express app for Vercel's serverless Node runtime.
export default app;

// Local development uses a persistent HTTP listener; Vercel imports the app.
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`PHYSIX API running on port ${PORT}`));
}
