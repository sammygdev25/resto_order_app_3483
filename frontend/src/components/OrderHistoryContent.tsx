import type { Order } from '../types';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, EmptyState, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface OrderHistoryContentProps {
  orders: Order[];
  selectedOrderId?: number;
  onSelectOrder: (id: number) => void;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'confirmed':
    case 'preparing':
    case 'out_for_delivery':
      return 'primary';
    default:
      return 'neutral';
  }
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function OrderHistoryContent({ orders, selectedOrderId, onSelectOrder }: OrderHistoryContentProps) {
  if (orders.length === 0) {
    return (
      <Section eyebrow="Your history" title="Past orders">
        <EmptyState
          icon="package"
          title="No orders yet"
          text="Once you place an order for pickup or delivery, it will show up here so you can track it and reorder your favorites."
          action={<Button to="/dishes" variant="primary">Browse the menu</Button>}
        />
      </Section>
    );
  }

  return (
    <Section eyebrow="Your history" title="Past orders" subtitle="Every order you've placed, with its status and total.">
      <Grid size="md" cols={3}>
        {orders.map((order) => (
          <Card
            key={order.id}
            onClick={() => onSelectOrder(order.id)}
            className={selectedOrderId === order.id ? 'ds-card-selected' : undefined}
          >
            <CardBody>
              <CardTitle>
                Order #{order.id}
              </CardTitle>
              <CardMeta>
                <Icon name={order.orderType === 'delivery' ? 'truck' : 'package'} size={16} />
                {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
              </CardMeta>
              <CardMeta>
                <Icon name="calendar" size={16} />
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </CardMeta>
              <CardFooter>
                <Badge tone={statusTone(order.status)}>{formatStatus(order.status)}</Badge>
                <span className="ds-price">${Number(order.totalAmount).toFixed(2)}</span>
              </CardFooter>
              <Button variant="ghost" size="md" onClick={() => onSelectOrder(order.id)}>
                View details
                <Icon name="chevron-right" size={16} />
              </Button>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}