import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminDashboardActionsProps {
  section?: string;
  page?: string;
}

export default function AdminDashboardActions(_props: AdminDashboardActionsProps) {
  return (
    <Section title="Quick actions" tight>
      <Cluster gap="sm">
        <Button to="/staff/menu" variant="primary">
          <Icon name="book" size={18} />
          Manage menu
        </Button>
        <Button to="/staff/orders" variant="secondary">
          <Icon name="package" size={18} />
          View orders
        </Button>
        <Button to="/staff/reservations" variant="secondary">
          <Icon name="calendar" size={18} />
          View reservations
        </Button>
        <Button to="/dishes" variant="ghost">
          <Icon name="grid" size={18} />
          Browse dishes
        </Button>
      </Cluster>
    </Section>
  );
}