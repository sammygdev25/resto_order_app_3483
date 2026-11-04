import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireStaff } from '../middleware/auth';

const router = Router();

const createReservationSchema = z.object({
  partySize: z.number().int().positive().max(50),
  reservationDate: z.string().min(1),
  reservationTime: z.string().min(1),
  specialRequests: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /api/reservations/ (authenticated: staff see all, customers see their own)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const requester = await prisma.user.findUnique({ where: { id: req.userId } });
    const isStaff = requester?.role === 'admin';

    const reservations = await prisma.reservation.findMany({
      where: isStaff ? {} : { userId: req.userId },
      orderBy: [{ reservationDate: 'desc' }, { reservationTime: 'desc' }],
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

// GET /api/reservations/:id (owner or staff)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parsedParams.data.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const requester = await prisma.user.findUnique({ where: { id: req.userId } });
    const isStaff = requester?.role === 'admin';
    const isOwner = reservation.userId === req.userId;

    if (!isStaff && !isOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// POST /api/reservations/ (authenticated)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createReservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const reservation = await prisma.reservation.create({
      data: {
        userId: req.userId!,
        partySize: parsed.data.partySize,
        reservationDate: new Date(parsed.data.reservationDate),
        reservationTime: parsed.data.reservationTime,
        specialRequests: parsed.data.specialRequests ?? '',
        status: 'pending',
      },
    });
    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/reservations/:id (owner can cancel their own; staff can set any status)
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsedBody = updateStatusSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsedBody.error.issues });
  }

  try {
    const existing = await prisma.reservation.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const requester = await prisma.user.findUnique({ where: { id: req.userId } });
    const isStaff = requester?.role === 'admin';
    const isOwner = existing.userId === req.userId;

    if (!isStaff && !isOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!isStaff && parsedBody.data.status !== 'cancelled') {
      return res.status(403).json({ error: 'Customers may only cancel a reservation' });
    }

    const updated = await prisma.reservation.update({
      where: { id: parsedParams.data.id },
      data: { status: parsedBody.data.status },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reservations/:id (staff only)
router.delete('/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const existing = await prisma.reservation.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    await prisma.reservation.delete({ where: { id: parsedParams.data.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
