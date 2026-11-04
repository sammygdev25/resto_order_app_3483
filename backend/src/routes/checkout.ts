import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { DELIVERY_FEE, checkoutColumns, readCheckout } from '../lib/checkout';

const router = Router();

const checkoutItemSchema = z.object({
  dishId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const checkoutSchema = z.object({
  orderType: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.string().min(1).optional(),
  items: z.array(checkoutItemSchema).min(1),
});


// POST /api/checkout/ (authenticated) - creates an Order from the cart contents.
// Payment is handled entirely by the scaffold's /api/payments/* routes and webhook;
// this route only builds the order and its items with status/paymentStatus pending.
router.post('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const orderCheckout = readCheckout(req.body);
  if (orderCheckout.ok === false) { res.status(400).json({ error: 'Invalid checkout details', code: 'validation_error', issues: orderCheckout.issues }); return; }
  const orderDetails = orderCheckout.details;
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }

  const { orderType, deliveryAddress, items } = parsed.data;

  if (orderType === 'delivery' && !deliveryAddress) {
    return res.status(400).json({
      error: 'deliveryAddress is required for delivery orders',
      code: 'validation_error',
    });
  }

  try {
    const dishIds = items.map((i) => i.dishId);
    const dishes = await prisma.dish.findMany({ where: { id: { in: dishIds } } });

    if (dishes.length !== dishIds.length) {
      return res.status(400).json({ error: 'One or more dishes were not found', code: 'validation_error' });
    }

    const unavailable = dishes.find((d) => !d.isAvailable);
    if (unavailable) {
      return res.status(400).json({
        error: `Dish "${unavailable.name}" is currently unavailable`,
        code: 'validation_error',
      });
    }

    const dishById = new Map(dishes.map((d) => [d.id, d]));

    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const dish = dishById.get(item.dishId)!;
      const price = Number(dish.price);
      subtotal += price * item.quantity;
      return {
        dishId: item.dishId,
        quantity: item.quantity,
        price,
      };
    });

    const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
    const totalAmount = subtotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        ...checkoutColumns(orderDetails),
        userId: req.userId!,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
        status: 'pending',
        paymentStatus: 'pending',
        totalAmount,
        deliveryFee,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: { include: { dish: true } },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

export default router;