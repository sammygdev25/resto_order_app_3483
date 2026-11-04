import type { Reservation } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button } from './ui';
import { Icon } from './icons';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: number) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(timeStr: string): string {
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hour = parseInt(parts[0], 10);
  const minute = parts[1];
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${period}`;
}

function statusTone(status: string): 'neutral' | 'success' | 'danger' | 'soft' {
  if (status === 'confirmed') return 'success';
  if (status === 'cancelled') return 'danger';
  return 'soft';
}

function ReservationCard({ reservation, onCancel }: ReservationCardProps) {
  const canCancel = reservation.status !== 'cancelled';

  return (
    <Card>
      <CardBody>
        <div className="ds-between">
          <CardTitle>Table for {reservation.partySize}</CardTitle>
          <Badge tone={statusTone(reservation.status)}>{reservation.status}</Badge>
        </div>
        <CardMeta>
          <span className="ds-cluster">
            <Icon name="calendar" size={16} /> {formatDate(reservation.reservationDate)}
          </span>
        </CardMeta>
        <CardMeta>
          <span className="ds-cluster">
            <Icon name="clock" size={16} /> {formatTime(reservation.reservationTime)}
          </span>
        </CardMeta>
        {reservation.specialRequests && (
          <p className="ds-small ds-muted">
            <Icon name="message" size={14} /> {reservation.specialRequests}
          </p>
        )}
      </CardBody>
      {canCancel && (
        <CardFooter>
          <Button variant="danger" size="md" onClick={() => onCancel(reservation.id)}>
            <Icon name="close" size={16} /> Cancel reservation
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export { ReservationCard };
export default ReservationCard;