import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireStaff } from '../middleware/auth';

const router = Router();

// GET /api/admin/stats/ (staff only)
router.get(
  '/stats',
  authMiddleware,
  requireStaff,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const [
        totalOrders,
        pendingOrders,
        completedOrders,
        paidOrdersAgg,
        totalReservations,
        pendingReservations,
        confirmedReservations,
        totalDishes,
        availableDishes,
        recentOrders,
        recentReservations,
      ] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'pending' } }),
        prisma.order.count({ where: { status: 'completed' } }),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: { paymentStatus: 'paid' },
        }),
        prisma.reservation.count(),
        prisma.reservation.count({ where: { status: 'pending' } }),
        prisma.reservation.count({ where: { status: 'confirmed' } }),
        prisma.dish.count(),
        prisma.dish.count({ where: { isAvailable: true } }),
        prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          take: 8,
          include: { user: { select: { id: true, username: true, email: true, firstName: true, lastName: true, role: true } }},
        }),
        prisma.reservation.findMany({
          orderBy: [{ reservationDate: 'desc' }, { reservationTime: 'desc' }],
          take: 8,
          include: { user: { select: { id: true, username: true, email: true, firstName: true, lastName: true, role: true } }},
        }),
      ]);

      const totalRevenue = Number(paidOrdersAgg._sum.totalAmount ?? 0);

      const formatCustomerName = (user: { firstName: string | null; lastName: string | null } | null | undefined) => {
        if (!user) return 'Guest';
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        return fullName || 'Guest';
      };

      const formattedOrders = recentOrders.map((order) => ({
        id: order.id,
        orderType: order.orderType,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: Number(order.totalAmount),
        deliveryFee: Number(order.deliveryFee),
        createdAt: order.createdAt,
        customerName: formatCustomerName(order.user),
      }));

      const formattedReservations = recentReservations.map((reservation) => ({
        id: reservation.id,
        partySize: reservation.partySize,
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime,
        status: reservation.status,
        customerName: formatCustomerName(reservation.user),
      }));

      res.json({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        totalReservations,
        pendingReservations,
        confirmedReservations,
        totalDishes,
        availableDishes,
        recentOrders: formattedOrders,
        recentReservations: formattedReservations,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
