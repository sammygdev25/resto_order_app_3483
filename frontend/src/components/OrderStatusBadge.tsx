import { Badge } from './ui';

type BadgeTone = 'neutral' | 'primary' | 'soft' | 'success' | 'danger';

interface OrderStatusBadgeProps {
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending', tone: 'neutral' },
  confirmed: { label: 'Confirmed', tone: 'primary' },
  preparing: { label: 'Preparing', tone: 'soft' },
  out_for_delivery: { label: 'Out for Delivery', tone: 'primary' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, tone: 'neutral' as BadgeTone };

  return <Badge tone={config.tone}>{config.label}</Badge>;
}

export default OrderStatusBadge;
export { OrderStatusBadge };