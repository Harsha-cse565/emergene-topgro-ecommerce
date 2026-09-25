import { Router, Request, Response } from 'express';
import { db } from '../services/db.ts';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/orders - Admin get all orders
router.get('/', requireAdmin, (_req: Request, res: Response) => {
  const orders = db.orders.getAll();
  res.json(orders);
});

// GET /api/orders/my-orders - Customer get own orders
router.get('/my-orders', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const orders = db.orders.getAll();
  const userOrders = orders.filter(
    o => (o.customer && o.customer.userId === req.user!.id) || 
         (o.customer && o.customer.email.toLowerCase() === req.user!.email.toLowerCase())
  );
  res.json(userOrders);
});

// GET /api/orders/lookup/:identifier - Track order by Order Number or ID
router.get('/lookup/:identifier', (req: Request, res: Response) => {
  const order = db.orders.getById(req.params.identifier);
  if (!order) {
    return res.status(404).json({ error: 'Order not found with provided reference' });
  }
  res.json(order);
});

// POST /api/orders - Create new order (guest or authenticated)
router.post('/', (req: Request, res: Response) => {
  try {
    const { items, customer, shippingAddress, subtotal, deliveryCharge, tax, total, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ error: 'Customer name and phone are required' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pinCode) {
      return res.status(400).json({ error: 'Complete shipping address is required' });
    }

    // Deduct stock if necessary
    for (const item of items) {
      const prod = db.products.getById(item.productId) || db.products.getBySlug(item.slug);
      if (prod && prod.stock >= item.quantity) {
        db.products.update(prod._id, { stock: Math.max(0, prod.stock - item.quantity) });
      }
    }

    const newOrder = db.orders.create({
      customer,
      items,
      shippingAddress,
      subtotal: Number(subtotal) || 0,
      deliveryCharge: Number(deliveryCharge) || 0,
      tax: Number(tax) || 0,
      total: Number(total) || 0,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Order Placed'
    });

    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

// PUT /api/orders/:id/status - Admin update order status
router.put('/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status, notes } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Order status is required' });
  }

  const validStatuses = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const updated = db.orders.updateStatus(req.params.id, status, notes);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(updated);
});

export default router;
