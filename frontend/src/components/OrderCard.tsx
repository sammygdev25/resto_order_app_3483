import { Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Icon } from './ui';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function OrderCard({ order }: OrderCardProps) {
  const items = order.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardBody>
        <div className="ds-between">
          <CardTitle>Order #{order.id}</CardTitle>
          <OrderStatusBadge status={order.status} />
        </div>
        <CardMeta>
          {formatDate(order.createdAt)} &middot;{' '}
          {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
        </CardMeta>
        {order.orderType === 'delivery' && order.deliveryAddress && (
          <CardMeta>
            <Icon name="map-pin" size={14} /> {order.deliveryAddress}
          </CardMeta>
        )}
        <ul className="ds-stack" style={{ marginTop: '0.75rem' }}>
          {items.map((item) => (
            <li key={item.id} className="ds-between ds-small">
              <span>
                {item.quantity}&times; {item.dish?.name ?? `Dish #${item.dishId}`}
              </span>
              <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </CardBody>
      <CardFooter>
        <span className="ds-muted ds-small">
          {itemCount} item{itemCount === 1 ? '' : 's'}
        </span>
        <Price value={Number(order.totalAmount)} />
      </CardFooter>
    </Card>
  );
}

export default OrderCard;
export { OrderCard };