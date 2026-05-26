import { Router } from 'express';
import { env, hasGraphConfig, hasMoodleConfig } from '../config/env.js';
import { listCourses } from '../services/courseService.js';
import { listStudents } from '../services/studentService.js';
import { buildReport } from '../services/reportService.js';

const router = Router();

router.get('/status', (_req, res) => {
  res.json({
    ok: true,
    service: 'cesag-cockpit-api',
    date: new Date().toISOString(),
    environment: env.nodeEnv,
    connectors: {
      moodleConfigured: hasMoodleConfig(),
      graphConfigured: hasGraphConfig()
    }
  });
});

router.get('/courses', async (_req, res, next) => {
  try {
    res.json(await listCourses());
  } catch (error) {
    next(error);
  }
});

router.get('/students', async (_req, res, next) => {
  try {
    res.json(await listStudents());
  } catch (error) {
    next(error);
  }
});

router.get('/reports', async (_req, res, next) => {
  try {
    res.json(await buildReport());
  } catch (error) {
    next(error);
  }
});

export default router;
