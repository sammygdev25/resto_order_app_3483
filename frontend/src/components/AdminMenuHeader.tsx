import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminMenuHeaderProps {
  userName?: string;
  onAddDish: () => void;
}

export default function AdminMenuHeader({ userName, onAddDish }: AdminMenuHeaderProps) {
  return (
    <PageHeader
      eyebrow="Kitchen Management"
      title="Menu Management"
      subtitle={
        userName
          ? `Welcome back, ${userName}. Keep the menu fresh, priced right and ready to serve.`
          : 'Keep the menu fresh, priced right and ready to serve.'
      }
      actions={
        <Button variant="primary" size="lg" onClick={onAddDish}>
          <Icon name="plus" size={18} />
          Add Dish
        </Button>
      }
    />
  );
}