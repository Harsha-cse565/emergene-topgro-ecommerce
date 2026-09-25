import { Router, Request, Response } from 'express';
import { db } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

// GET /api/enquiries - Admin view enquiries
router.get('/', requireAdmin, (_req: Request, res: Response) => {
  const enquiries = db.enquiries.getAll();
  res.json(enquiries);
});

// POST /api/enquiries - Public submit enquiry
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone and message are required' });
    }

    const newEnquiry = db.enquiries.create({
      name,
      phone,
      email: email || '',
      subject: subject || 'General Agricultural Enquiry',
      message
    });

    res.status(201).json(newEnquiry);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit enquiry' });
  }
});

// PUT /api/enquiries/:id/status - Admin update enquiry status
router.put('/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['new', 'responded'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const updated = db.enquiries.updateStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }
  res.json(updated);
});

export default router;
