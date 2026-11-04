import { PageHeader } from '../components/ui';

interface CartHeaderProps {
  itemCount: number;
}

export default function CartHeader({ itemCount }: CartHeaderProps) {
  const subtitle =
    itemCount === 0
      ? 'Your cart is empty — add a dish from our menu to get started.'
      : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready for checkout.`;

  return (
    <PageHeader
      eyebrow="Your order"
      title="Cart"
      subtitle={subtitle}
    />
  );
}