import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../services/db.ts';
import { authenticate, AuthRequest } from '../middleware/auth.ts';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'emergene_topgro_super_secret_jwt_key_2026';

function generateToken(user: { _id: string; email: string; role: 'customer' | 'admin'; name: string }) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = db.users.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.users.create({
      name,
      email,
      passwordHash,
      phone: phone || '',
      role: 'customer',
      addresses: []
    });

    const token = generateToken(user);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      },
      token
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// POST /api/auth/login - Customer Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      },
      token
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// POST /api/auth/admin-login - Admin Login (verifies role === 'admin')
router.post('/admin-login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Admin email and password are required' });
    }

    const user = db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Account is not an administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = generateToken(user);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Admin login failed' });
  }
});

// GET /api/auth/me - Current user profile
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = db.users.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    addresses: user.addresses || []
  });
});

// PUT /api/auth/addresses - Save customer addresses
router.put('/addresses', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { addresses } = req.body;
  const updated = db.users.updateAddresses(req.user.id, addresses || []);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ addresses: updated.addresses });
});

export default router;
