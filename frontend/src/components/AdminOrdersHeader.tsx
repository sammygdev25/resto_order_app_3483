import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminOrdersHeaderProps {
  userName?: string;
  onRefresh?: () => void;
}

export default function AdminOrdersHeader({ userName, onRefresh }: AdminOrdersHeaderProps) {
  return (
    <PageHeader
      eyebrow="Staff Dashboard"
      title="Order Management"
      subtitle={
        userName
          ? `Welcome back, ${userName}. Track and update every pickup and delivery order moving through the kitchen.`
          : 'Track and update every pickup and delivery order moving through the kitchen.'
      }
      actions={
        <Button variant="primary" size="md" onClick={onRefresh}>
          <Icon name="refresh" size={18} />
          Refresh orders
        </Button>
      }
    />
  );
}