import express from 'express';
import morgan from 'morgan';
import routes from './api/routes.js';
import { env } from './config/env.js';
import { corsMiddleware, internalApiKeyMiddleware, rateLimiter } from './middleware/security.js';

const app = express();

app.use(morgan('dev'));
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(express.json({ limit: '1mb' }));
app.use('/api', internalApiKeyMiddleware, routes);

app.use((err, _req, res, _next) => {
  res.status(500).json({ ok: false, error: err.message || 'Unexpected error' });
});

app.listen(env.port, () => {
  console.log(`CESAG Cockpit Internal API listening on port ${env.port}`);
});
