import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface ReservationsHeaderProps {
  userName?: string;
}

export default function ReservationsHeader({ userName }: ReservationsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Table Reservations"
      title={userName ? `Welcome back, ${userName}` : 'Your Reservations'}
      subtitle="Book a table for your next visit, or review and manage the reservations you've already made with us."
      actions={
        <span className="ds-cluster">
          <Icon name="calendar" size={18} />
          <span className="ds-muted">Plan your table ahead of time</span>
        </span>
      }
    />
  );
}