import { Router, Request, Response } from 'express';
import { db } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

// GET /api/settings - Public get settings
router.get('/', (_req: Request, res: Response) => {
  const settings = db.settings.get();
  res.json(settings);
});

// PUT /api/settings - Admin update settings
router.put('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.settings.update(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update settings' });
  }
});

export default router;
