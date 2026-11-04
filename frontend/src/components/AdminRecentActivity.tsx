import type { Order, Reservation } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Badge, EmptyState, Stack } from './ui';
import { Icon } from './icons';

interface AdminRecentActivityProps {
  orders: Order[];
  reservations: Reservation[];
}

function orderStatusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
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

function reservationStatusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'neutral';
  }
}

function formatOrderType(type: string): string {
  return type === 'delivery' ? 'Delivery' : 'Pickup';
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function AdminRecentActivity({ orders, reservations }: AdminRecentActivityProps) {
  return (
    <div className="ds-grid-2" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
      <Card>
        <CardBody>
          <CardTitle>Recent Orders</CardTitle>
          {orders.length === 0 ? (
            <EmptyState
              icon="package"
              title="No orders yet"
              text="New orders from the dining room will show up here as soon as guests check out."
            />
          ) : (
            <Stack gap="sm">
              {orders.map((order) => (
                <div key={order.id} className="ds-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Order #{order.id}</div>
                    <CardMeta>
                      {formatOrderType(order.orderType)} · ${Number(order.totalAmount).toFixed(2)}
                    </CardMeta>
                  </div>
                  <Badge tone={orderStatusTone(order.status)}>{formatStatus(order.status)}</Badge>
                </div>
              ))}
            </Stack>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <CardTitle>Recent Reservations</CardTitle>
          {reservations.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No reservations yet"
              text="Table bookings from guests will appear here once they come in."
            />
          ) : (
            <Stack gap="sm">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="ds-between"
                  style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      <Icon name="users" size={14} /> {reservation.partySize} guests
                    </div>
                    <CardMeta>
                      {reservation.reservationDate} at {reservation.reservationTime}
                    </CardMeta>
                  </div>
                  <Badge tone={reservationStatusTone(reservation.status)}>{formatStatus(reservation.status)}</Badge>
                </div>
              ))}
            </Stack>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default AdminRecentActivity;