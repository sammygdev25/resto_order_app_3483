import { Grid, Stat } from '../components/ui';
import type { Reservation } from '../types';

interface AdminReservationsStatsProps {
  reservations: Reservation[];
}

export default function AdminReservationsStats({ reservations }: AdminReservationsStatsProps) {
  const total = reservations.length;
  const pending = reservations.filter((r) => r.status === 'pending').length;
  const confirmed = reservations.filter((r) => r.status === 'confirmed').length;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = reservations.filter((r) => r.reservationDate === today).length;

  return (
    <Grid size="sm" cols={4}>
      <Stat value={total} label="Total reservations" icon="calendar" />
      <Stat value={pending} label="Awaiting confirmation" icon="clock" />
      <Stat value={confirmed} label="Confirmed tables" icon="check" />
      <Stat value={todayCount} label="Booked for today" icon="users" />
    </Grid>
  );
}