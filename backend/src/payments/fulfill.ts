import { Prisma, Order } from '@prisma/client';

/**
 * Called once per order by the Stripe webhook, inside the transaction that
 * marks the order as paid. Implements the app's effect of a paid order:
 * confirm the order so kitchen/staff can start preparing it.
 */
export async function onOrderPaid(order: Order, tx: Prisma.TransactionClient): Promise<void> {
  console.log(`[fulfill] processing paid order id=${order.id}`);

  await tx.order.update({
    where: { id: order.id },
    data: {
      status: order.status === 'pending' ? 'confirmed' : order.status,
    },
  });

  console.log(`[fulfill] order id=${order.id} confirmed`);
}