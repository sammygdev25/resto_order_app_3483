import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { User } from '../types';

interface AdminReservationsHeaderProps {
  user: User | null;
  onRefresh?: () => void;
}

export default function AdminReservationsHeader({ user, onRefresh }: AdminReservationsHeaderProps) {
  const greetingName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <PageHeader
      eyebrow="Staff / Reservations"
      title="Table Reservations"
      subtitle={`Welcome back, ${greetingName}. Review incoming bookings and keep the dining room running smoothly.`}
      actions={
        <Button variant="primary" onClick={onRefresh}>
          <Icon name="refresh" size={18} />
          Refresh list
        </Button>
      }
    />
  );
}