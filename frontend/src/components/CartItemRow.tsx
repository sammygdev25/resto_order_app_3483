import type { CartItem } from '../contexts/CartContext';
import { Media } from '../components/ui';
import { Icon } from '../components/icons';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (dishId: number, quantity: number) => void;
  onRemove: (dishId: number) => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const { dish, quantity } = item;
  const lineTotal = Number(dish.price) * quantity;

  return (
    <div className="ds-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
      <div style={{ width: '88px', flexShrink: 0 }}>
        <Media src={dish.imageUrl} alt={dish.name} ratio="square" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className="ds-card-title" style={{ margin: 0 }}>{dish.name}</h3>
        <p className="ds-muted ds-small" style={{ margin: '0.25rem 0 0' }}>
          var(--color-primary) {Number(dish.price).toFixed(2)} each
        </p>
      </div>
      <div className="ds-cluster" style={{ gap: '0.5rem', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary"
          aria-label={`Decrease quantity of ${dish.name}`}
          onClick={() => onUpdateQuantity(dish.id, quantity - 1)}
        >
          <Icon name="minus" size={16} />
        </button>
        <span style={{ minWidth: '1.5rem', textAlign: 'center' }}>{quantity}</span>
        <button
          type="button"
          className="btn btn-secondary"
          aria-label={`Increase quantity of ${dish.name}`}
          onClick={() => onUpdateQuantity(dish.id, quantity + 1)}
        >
          <Icon name="plus" size={16} />
        </button>
      </div>
      <div style={{ width: '90px', textAlign: 'right', fontWeight: 600, color: 'var(--color-text)' }}>
        ${Number(lineTotal || 0).toFixed(2)}
      </div>
      <button
        type="button"
        className="ds-btn-ghost"
        aria-label={`Remove ${dish.name} from cart`}
        onClick={() => onRemove(dish.id)}
      >
        <Icon name="trash" size={18} />
      </button>
    </div>
  );
}

export { CartItemRow };
export default CartItemRow;