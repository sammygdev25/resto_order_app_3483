import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, EmptyState, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Reservation } from '../types';

interface ReservationsContentProps {
  reservations: Reservation[];
  onCancel: (id: number) => void;
  cancellingId?: number | null;
}

const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'soft' | 'success' | 'danger'> = {
  pending: 'soft',
  confirmed: 'success',
  cancelled: 'danger',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr: string) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = Number(h);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}

export default function ReservationsContent({ reservations, onCancel, cancellingId }: ReservationsContentProps) {
  if (reservations.length === 0) {
    return (
      <Section
        eyebrow="Your table"
        title="Upcoming reservations"
        subtitle="Every booking you make for a table at our dining room shows up here."
      >
        <EmptyState
          icon="calendar"
          title="No reservations yet"
          text="You haven't booked a table with us yet. Browse the menu to get a feel for what we serve, then reserve a table for your next visit."
          action={<Button to="/dishes">Browse the menu</Button>}
        />
      </Section>
    );
  }

  return (
    <Section
      eyebrow="Your table"
      title="Upcoming reservations"
      subtitle="Manage the tables you've booked with us."
    >
      <Grid size="md" cols={3}>
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardBody>
              <CardTitle>
                Party of {reservation.partySize}
              </CardTitle>
              <CardMeta>
                <Icon name="calendar" size={16} /> {formatDate(reservation.reservationDate)}
              </CardMeta>
              <CardMeta>
                <Icon name="clock" size={16} /> {formatTime(reservation.reservationTime)}
              </CardMeta>
              {reservation.specialRequests && (
                <CardMeta>
                  <Icon name="message" size={16} /> {reservation.specialRequests}
                </CardMeta>
              )}
              <Badge tone={STATUS_TONE[reservation.status] ?? 'neutral'}>
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </Badge>
            </CardBody>
            {reservation.status !== 'cancelled' && (
              <CardFooter>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => onCancel(reservation.id)}
                  disabled={cancellingId === reservation.id}
                >
                  {cancellingId === reservation.id ? 'Cancelling…' : 'Cancel reservation'}
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </Grid>
    </Section>
  );
}