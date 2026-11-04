import { Section, EmptyState, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order } from '../types';

interface AdminOrdersRecentProps {
  orders: Order[];
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'pending':
      return 'neutral';
    default:
      return 'primary';
  }
}

export default function AdminOrdersRecent({ orders }: AdminOrdersRecentProps) {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <Section eyebrow="Recent activity" title="Latest orders" tight>
      {recent.length === 0 ? (
        <EmptyState
          icon="package"
          title="No orders yet"
          text="Orders placed by diners for pickup or delivery will show up here as soon as they come in."
        />
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Type</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <span className="ds-cluster">
                      <Icon name={order.orderType === 'delivery' ? 'truck' : 'package'} size={16} />
                      {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </span>
                  </td>
                  <td>${Number(order.totalAmount).toFixed(2)}</td>
                  <td>
                    <Badge tone={statusTone(order.status)}>{order.status.replace(/_/g, ' ')}</Badge>
                  </td>
                  <td>
                    <Badge tone={order.paymentStatus === 'paid' ? 'success' : 'neutral'}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="ds-muted ds-small">
                    {new Date(order.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}