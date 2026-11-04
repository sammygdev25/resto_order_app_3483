import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminDashboardHeaderProps {
  userName?: string;
  onRefresh?: () => void;
}

export default function AdminDashboardHeader({ userName, onRefresh }: AdminDashboardHeaderProps) {
  return (
    <PageHeader
      eyebrow="Staff dashboard"
      title="Restaurant overview"
      subtitle={
        userName
          ? `Welcome back, ${userName}. Here's how the dining room, kitchen and orders are doing today.`
          : "Here's how the dining room, kitchen and orders are doing today."
      }
      actions={
        <Button variant="primary" onClick={onRefresh}>
          <Icon name="refresh" size={18} />
          Refresh data
        </Button>
      }
    />
  );
}