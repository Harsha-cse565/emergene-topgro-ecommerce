import { Router, Request, Response } from 'express';
import { db } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

// GET /api/categories
router.get('/', (_req: Request, res: Response) => {
  const categories = db.categories.getAll();
  const products = db.products.getAll();

  // Dynamic count of products in each category
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
  }));

  res.json(categoriesWithCount);
});

// POST /api/categories - Admin add
router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const created = db.categories.create(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create category' });
  }
});

// PUT /api/categories/:id - Admin edit
router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.categories.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(updated);
});

// DELETE /api/categories/:id - Admin delete
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.categories.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json({ message: 'Category deleted successfully' });
});

export default router;
