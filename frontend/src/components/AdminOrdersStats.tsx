import { Grid, Stat } from '../components/ui';
import type { Order } from '../types';

interface AdminOrdersStatsProps {
  orders: Order[];
}

export default function AdminOrdersStats({ orders }: AdminOrdersStatsProps) {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing'
  ).length;
  const revenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const completedOrders = orders.filter((o) => o.status === 'completed').length;

  return (
    <Grid size="sm" cols={4}>
      <Stat value={String(totalOrders)} label="Total orders" icon="package" />
      <Stat value={String(pendingOrders)} label="In progress" icon="clock" />
      <Stat value={`$${Number(revenue || 0).toFixed(2)}`} label="Revenue collected" icon="dollar" />
      <Stat value={String(completedOrders)} label="Completed" icon="check" />
    </Grid>
  );
}