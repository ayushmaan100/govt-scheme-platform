// src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eligibilityRouter from './routes/eligibility';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── MIDDLEWARE ──────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-frontend-domain.com'
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10kb' })); // Prevent oversized payloads

// ── HEALTH CHECK ────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'scheme-eligibility-api',
    timestamp: new Date().toISOString() 
  });
});

// ── ROUTES ──────────────────────────────────────────────
app.use('/api/v1/eligibility', eligibilityRouter);

// ── 404 HANDLER ─────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── START SERVER ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API:    http://localhost:${PORT}/api/v1/eligibility/check`);
});