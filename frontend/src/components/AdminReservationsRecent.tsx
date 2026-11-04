import { Section, Badge, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Reservation } from '../types';

interface AdminReservationsRecentProps {
  reservations: Reservation[];
}

function statusTone(status: string): 'success' | 'danger' | 'soft' | 'neutral' {
  if (status === 'confirmed') return 'success';
  if (status === 'cancelled') return 'danger';
  if (status === 'pending') return 'soft';
  return 'neutral';
}

function formatDateTime(date: string, time: string): string {
  try {
    const d = new Date(`${date}T${time}`);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return `${date} ${time}`;
  }
}

export default function AdminReservationsRecent({ reservations }: AdminReservationsRecentProps) {
  const recent = [...reservations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <Section eyebrow="Front desk" title="Recent activity" subtitle="The latest table bookings as they come in">
      {recent.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No reservations yet"
          text="New table bookings from guests will show up here as soon as they arrive."
        />
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Party</th>
                <th>When</th>
                <th>Status</th>
                <th>Requests</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <span className="ds-cluster" style={{ gap: '0.4rem' }}>
                      <Icon name="user" size={16} />
                      {reservation.user?.name || `Guest #${reservation.userId}`}
                    </span>
                  </td>
                  <td>{reservation.partySize}</td>
                  <td>{formatDateTime(reservation.reservationDate, reservation.reservationTime)}</td>
                  <td>
                    <Badge tone={statusTone(reservation.status)}>{reservation.status}</Badge>
                  </td>
                  <td className="ds-muted ds-small">
                    {reservation.specialRequests ? reservation.specialRequests : '—'}
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