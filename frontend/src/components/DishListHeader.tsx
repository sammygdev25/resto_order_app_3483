import { PageHeader } from '../components/ui';

interface DishListHeaderProps {
  resultCount?: number;
  loading?: boolean;
}

export default function DishListHeader({ resultCount, loading }: DishListHeaderProps) {
  const subtitle = loading
    ? 'Loading our menu...'
    : typeof resultCount === 'number'
    ? `${resultCount} ${resultCount === 1 ? 'dish' : 'dishes'} ready to order, from the grill to the pastry case`
    : 'Fresh, seasonal plates made to order — browse starters, mains, and desserts';

  return (
    <PageHeader
      eyebrow="Our Menu"
      title="Every dish, made to order"
      subtitle={subtitle}
    />
  );
}