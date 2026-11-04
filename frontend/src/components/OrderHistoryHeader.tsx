import { PageHeader } from '../components/ui';

interface OrderHistoryHeaderProps {
  userName?: string;
  userEmail?: string;
}

export default function OrderHistoryHeader({ userName, userEmail }: OrderHistoryHeaderProps) {
  const who = userName || userEmail || 'there';

  return (
    <PageHeader
      eyebrow="Your orders"
      title="Order History"
      subtitle={`Every pickup and delivery you've placed with us, ${who} — track status and revisit past favorites.`}
    />
  );
}