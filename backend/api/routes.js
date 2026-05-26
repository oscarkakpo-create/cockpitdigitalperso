import { Router } from 'express';
import { env } from '../config/env.js';
import { buildReport } from '../services/reportService.js';
import { appendSectionItem, getSection, setSection } from '../services/internalStoreService.js';
import { getGraphConnectorStatus } from '../connectors/graphConnector.js';
import { getMoodleConnectorStatus } from '../connectors/moodleConnector.js';

const router = Router();

router.get('/status', async (_req, res, next) => {
  try {
    const [moodle, graph] = await Promise.all([getMoodleConnectorStatus(), getGraphConnectorStatus()]);
    res.json({
      ok: true,
      service: 'cesag-cockpit-internal-api',
      date: new Date().toISOString(),
      environment: env.nodeEnv,
      mode: 'internal-only',
      note: 'This API is independent of CESAG Online Moodle and does not call formations.cesagonline.com.',
      connectors: { moodle, graph }
    });
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

router.get('/resources', async (_req, res, next) => { try { res.json(await getSection('resources')); } catch (e) { next(e); } });
router.post('/resources', async (req, res, next) => { try { res.status(201).json(await appendSectionItem('resources', req.body || {})); } catch (e) { next(e); } });

router.get('/plannings', async (_req, res, next) => { try { res.json(await getSection('plannings')); } catch (e) { next(e); } });
router.post('/plannings', async (req, res, next) => { try { res.status(201).json(await appendSectionItem('plannings', req.body || {})); } catch (e) { next(e); } });

router.get('/history', async (_req, res, next) => { try { res.json(await getSection('history')); } catch (e) { next(e); } });
router.post('/history', async (req, res, next) => { try { res.status(201).json(await appendSectionItem('history', req.body || {})); } catch (e) { next(e); } });

router.get('/settings', async (_req, res, next) => { try { res.json(await getSection('settings')); } catch (e) { next(e); } });
router.put('/settings', async (req, res, next) => { try { res.json(await setSection('settings', req.body || {})); } catch (e) { next(e); } });
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
