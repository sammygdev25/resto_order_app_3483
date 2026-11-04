import { useCart } from '../contexts/CartContext';
import CartHeader from '../components/CartHeader';
import CartItems from '../components/CartItems';
import CartSummary from '../components/CartSummary';
import { WithSidebar } from '../components/ui';
import { DELIVERY_FEE } from '../lib/fees';

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();

  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;

  return (
    <div className="ds-stack-lg">
      <CartHeader itemCount={itemCount} />
      <WithSidebar
        sidebar={
          <CartSummary items={items} total={total} deliveryFee={deliveryFee} />
        }
      >
        <CartItems
          items={items}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
        />
      </WithSidebar>
    </div>
  );
}