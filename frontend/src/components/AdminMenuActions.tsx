import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminMenuActionsProps {
  onAddDish: () => void;
}

export default function AdminMenuActions({ onAddDish }: AdminMenuActionsProps) {
  return (
    <Section tight title="Quick actions">
      <Cluster gap="sm" >
        <Button variant="primary" onClick={onAddDish}>
          <Icon name="plus" size={16} />
          Add new dish
        </Button>
        <Button variant="secondary" to="/staff/orders">
          <Icon name="package" size={16} />
          View orders
        </Button>
        <Button variant="secondary" to="/staff/reservations">
          <Icon name="calendar" size={16} />
          View reservations
        </Button>
        <Button variant="ghost" to="/dishes">
          <Icon name="book" size={16} />
          View public menu
        </Button>
      </Cluster>
    </Section>
  );
}