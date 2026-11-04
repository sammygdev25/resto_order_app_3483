import type { Reservation } from '../types';
import { Badge, Button } from './ui';
import { Icon } from './icons';

interface AdminReservationTableProps {
  reservations: Reservation[];
  onUpdateStatus: (id: number, status: string) => void;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'pending':
    default:
      return 'soft';
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(timeStr: string) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}

export function AdminReservationTable({ reservations, onUpdateStatus }: AdminReservationTableProps) {
  if (!reservations || reservations.length === 0) {
    return <p className="ds-muted">No reservations to show.</p>;
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Guest</th>
            <th>Party</th>
            <th>Date</th>
            <th>Time</th>
            <th>Special Requests</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>
                <div>{reservation.user?.name ?? `Guest #${reservation.userId}`}</div>
                {reservation.user?.email && (
                  <div className="ds-small ds-muted">{reservation.user?.email}</div>
                )}
              </td>
              <td>{reservation.partySize}</td>
              <td>{formatDate(reservation.reservationDate)}</td>
              <td>{formatTime(reservation.reservationTime)}</td>
              <td>
                {reservation.specialRequests ? (
                  <span className="ds-small">{reservation.specialRequests}</span>
                ) : (
                  <span className="ds-muted ds-small">None</span>
                )}
              </td>
              <td>
                <Badge tone={statusTone(reservation.status)}>{reservation.status}</Badge>
              </td>
              <td>
                <div className="ds-cluster">
                  {reservation.status !== 'confirmed' && (
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => onUpdateStatus(reservation.id, 'confirmed')}
                      title="Confirm reservation"
                    >
                      <Icon name="check" size={16} />
                    </Button>
                  )}
                  {reservation.status !== 'cancelled' && (
                    <Button
                      variant="danger"
                      size="md"
                      onClick={() => onUpdateStatus(reservation.id, 'cancelled')}
                      title="Cancel reservation"
                    >
                      <Icon name="close" size={16} />
                    </Button>
                  )}
                  {reservation.status !== 'pending' && (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => onUpdateStatus(reservation.id, 'pending')}
                      title="Mark as pending"
                    >
                      <Icon name="clock" size={16} />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReservationTable;