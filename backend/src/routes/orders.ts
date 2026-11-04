import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireStaff } from '../middleware/auth';
import { DELIVERY_FEE, checkoutColumns, readCheckout } from '../lib/checkout';

const router = Router();

const orderItemSchema = z.object({
  dishId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  orderType: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.string().min(1).max(300).optional(),
  items: z.array(orderItemSchema).min(1),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});


// GET /api/orders/
router.get('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.userRole === 'admin';
    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: req.userId },
      include: {
        items: {
          include: {
            dish: {
              select: { id: true, name: true, price: true, imageUrl: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const serialized = orders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      deliveryFee: Number(order.deliveryFee),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        dish: item.dish
          ? { ...item.dish, price: Number(item.dish.price) }
          : undefined,
      })),
    }));

    res.json(serialized);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id/
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }

  try {
    const isAdmin = req.userRole === 'admin';
    const order = await prisma.order.findUnique({
      where: { id: parsedParams.data.id },
      include: {
        items: {
          include: {
            dish: {
              select: { id: true, name: true, price: true, imageUrl: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order || (!isAdmin && order.userId !== req.userId)) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      ...order,
      totalAmount: Number(order.totalAmount),
      deliveryFee: Number(order.deliveryFee),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        dish: item.dish
          ? { ...item.dish, price: Number(item.dish.price) }
          : undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders/
router.post('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const orderCheckout = readCheckout(req.body);
  if (orderCheckout.ok === false) { res.status(400).json({ error: 'Invalid checkout details', code: 'validation_error', issues: orderCheckout.issues }); return; }
  const orderDetails = orderCheckout.details;
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }

  if (parsed.data.orderType === 'delivery' && !parsed.data.deliveryAddress) {
    return res.status(400).json({
      error: 'Delivery address is required for delivery orders',
      code: 'validation_error',
    });
  }

  try {
    const dishIds = parsed.data.items.map((item) => item.dishId);
    const dishes = await prisma.dish.findMany({
      where: { id: { in: dishIds } },
    });

    const dishMap = new Map(dishes.map((dish) => [dish.id, dish]));

    for (const item of parsed.data.items) {
      const dish = dishMap.get(item.dishId);
      if (!dish) {
        return res.status(400).json({
          error: `Dish ${item.dishId} not found`,
          code: 'validation_error',
        });
      }
      if (!dish.isAvailable) {
        return res.status(400).json({
          error: `Dish "${dish.name}" is not currently available`,
          code: 'validation_error',
        });
      }
    }

    const deliveryFee = parsed.data.orderType === 'delivery' ? DELIVERY_FEE : 0;
    const itemsTotal = parsed.data.items.reduce((sum, item) => {
      const dish = dishMap.get(item.dishId)!;
      return sum + Number(dish.price) * item.quantity;
    }, 0);
    const totalAmount = itemsTotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        ...checkoutColumns(orderDetails),
        userId: req.userId!,
        orderType: parsed.data.orderType,
        deliveryAddress: parsed.data.orderType === 'delivery' ? parsed.data.deliveryAddress : null,
        status: 'pending',
        paymentStatus: 'pending',
        totalAmount,
        deliveryFee,
        items: {
          create: parsed.data.items.map((item) => {
            const dish = dishMap.get(item.dishId)!;
            return {
              dishId: dish.id,
              quantity: item.quantity,
              price: Number(dish.price),
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            dish: {
              select: { id: true, name: true, price: true, imageUrl: true },
            },
          },
        },
      },
    });

    res.status(201).json({
      ...order,
      totalAmount: Number(order.totalAmount),
      deliveryFee: Number(order.deliveryFee),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        dish: item.dish
          ? { ...item.dish, price: Number(item.dish.price) }
          : undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/orders/:id/ (staff only - update status / payment status)
router.patch('/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }

  const parsedBody = updateOrderStatusSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsedBody.error.issues });
  }

  if (!parsedBody.data.status && !parsedBody.data.paymentStatus) {
    return res.status(400).json({
      error: 'At least one of status or paymentStatus must be provided',
      code: 'validation_error',
    });
  }

  try {
    const existing = await prisma.order.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = await prisma.order.update({
      where: { id: parsedParams.data.id },
      data: {
        ...(parsedBody.data.status ? { status: parsedBody.data.status } : {}),
        ...(parsedBody.data.paymentStatus ? { paymentStatus: parsedBody.data.paymentStatus } : {}),
      },
      include: {
        items: {
          include: {
            dish: {
              select: { id: true, name: true, price: true, imageUrl: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    res.json({
      ...order,
      totalAmount: Number(order.totalAmount),
      deliveryFee: Number(order.deliveryFee),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        dish: item.dish
          ? { ...item.dish, price: Number(item.dish.price) }
          : undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
