import { Section, Stack, EmptyState, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order, Reservation } from '../types';

interface AdminDashboardRecentProps {
  orders: Order[];
  reservations: Reservation[];
}

function orderStatusTone(status: string) {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'danger';
  if (status === 'pending') return 'neutral';
  return 'primary';
}

function reservationStatusTone(status: string) {
  if (status === 'confirmed') return 'success';
  if (status === 'cancelled') return 'danger';
  return 'neutral';
}

export default function AdminDashboardRecent({ orders, reservations }: AdminDashboardRecentProps) {
  return (
    <Section
      eyebrow="Activity"
      title="Recent activity"
      subtitle="The latest orders and table reservations across the restaurant."
    >
      <Stack gap="lg">
        <div>
          <h3 className="ds-card-title">
            <Icon name="package" size={18} /> Recent orders
          </h3>
          {orders.length === 0 ? (
            <EmptyState
              icon="package"
              title="No orders yet"
              text="Orders placed by guests will show up here as they come in."
            />
          ) : (
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</td>
                      <td>
                        <Badge tone={orderStatusTone(order.status) as any}>{order.status.replace(/_/g, ' ')}</Badge>
                      </td>
                      <td>
                        <Badge tone={order.paymentStatus === 'paid' ? 'success' : 'neutral'}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td>${Number(order.totalAmount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 className="ds-card-title">
            <Icon name="calendar" size={18} /> Recent reservations
          </h3>
          {reservations.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No reservations yet"
              text="Table bookings made by guests will appear here."
            />
          ) : (
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Reservation</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Party</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>#{reservation.id}</td>
                      <td>{reservation.reservationDate}</td>
                      <td>{reservation.reservationTime}</td>
                      <td>{reservation.partySize}</td>
                      <td>
                        <Badge tone={reservationStatusTone(reservation.status) as any}>
                          {reservation.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Stack>
    </Section>
  );
}