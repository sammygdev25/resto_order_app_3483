import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminOrdersActionsProps {
  onRefresh?: () => void;
}

export default function AdminOrdersActions({ onRefresh }: AdminOrdersActionsProps) {
  return (
    <Section title="Quick actions" tight>
      <Cluster gap="sm">
        <Button variant="primary" to="/staff/menu">
          <Icon name="book" size={16} />
          Manage menu
        </Button>
        <Button variant="secondary" to="/staff/reservations">
          <Icon name="calendar" size={16} />
          View reservations
        </Button>
        <Button variant="secondary" to="/staff/dashboard">
          <Icon name="grid" size={16} />
          Dashboard
        </Button>
        <Button variant="ghost" to="/dishes">
          <Icon name="search" size={16} />
          Browse dishes
        </Button>
        {onRefresh && (
          <Button variant="ghost" onClick={onRefresh}>
            <Icon name="refresh" size={16} />
            Refresh orders
          </Button>
        )}
      </Cluster>
    </Section>
  );
}