import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const corsMiddleware = cors({
  origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',').map((x) => x.trim())
});

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
});

export function internalApiKeyMiddleware(req, res, next) {
  if (!env.internalApiKey) return next();
  const provided = req.header('x-api-key');
  if (provided !== env.internalApiKey) {
    return res.status(401).json({ ok: false, error: 'Invalid API key' });
  }
  return next();
export function futureAuthMiddleware(req, _res, next) {
  // Placeholder for future auth (JWT / API key / SSO)
  req.auth = { mode: 'none', note: 'Auth middleware placeholder for future implementation.' };
  next();
}
