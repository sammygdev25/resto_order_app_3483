import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminReservationsActionsProps {
  onRefresh?: () => void;
}

export default function AdminReservationsActions({ onRefresh }: AdminReservationsActionsProps) {
  return (
    <Section title="Quick actions" tight>
      <Cluster gap="sm">
        <Button variant="primary" to="/staff/reservations">
          <Icon name="calendar" size={16} />
          View all reservations
        </Button>
        <Button variant="secondary" to="/staff/menu">
          <Icon name="book" size={16} />
          Manage menu
        </Button>
        <Button variant="secondary" to="/staff/orders">
          <Icon name="package" size={16} />
          View orders
        </Button>
        <Button variant="ghost" to="/staff/dashboard">
          <Icon name="grid" size={16} />
          Dashboard
        </Button>
        {onRefresh && (
          <Button variant="ghost" onClick={onRefresh}>
            <Icon name="refresh" size={16} />
            Refresh
          </Button>
        )}
      </Cluster>
    </Section>
  );
}