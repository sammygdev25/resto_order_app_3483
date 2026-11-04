import { Link } from 'react-router-dom';
import { Section, WithSidebar, Media, Button, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { CartItem } from '../contexts/CartContext';

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (dishId: number, quantity: number) => void;
  onRemove: (dishId: number) => void;
}

export default function CartItems({ items, onUpdateQuantity, onRemove }: CartItemsProps) {
  if (items.length === 0) {
    return (
      <Section tight>
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          text="Browse our menu and add a few dishes to get your order started."
          action={
            <Button to="/dishes" variant="primary">
              Browse the menu
            </Button>
          }
        />
      </Section>
    );
  }

  return (
    <Section tight>
      <WithSidebar>
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th aria-label="Remove" />
              </tr>
            </thead>
            <tbody>
              {items.map(({ dish, quantity }) => (
                <tr key={dish.id}>
                  <td>
                    <div className="ds-cluster">
                      <Media
                        src={dish.imageUrl}
                        alt={dish.name}
                        ratio="square"
                      />
                      <div>
                        <Link to={`/dishes?category=${dish.category}`} className="ds-card-title">
                          {dish.name}
                        </Link>
                        <p className="ds-muted ds-small">{dish.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>${Number(dish.price).toFixed(2)}</td>
                  <td>
                    <div className="ds-cluster">
                      <Button
                        variant="ghost"
                        size="md"
                        aria-label={`Decrease quantity of ${dish.name}`}
                        onClick={() => onUpdateQuantity(dish.id, quantity - 1)}
                      >
                        <Icon name="minus" size={16} />
                      </Button>
                      <span>{quantity}</span>
                      <Button
                        variant="ghost"
                        size="md"
                        aria-label={`Increase quantity of ${dish.name}`}
                        onClick={() => onUpdateQuantity(dish.id, quantity + 1)}
                      >
                        <Icon name="plus" size={16} />
                      </Button>
                    </div>
                  </td>
                  <td>${(Number(dish.price) * quantity).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="ghost"
                      size="md"
                      aria-label={`Remove ${dish.name} from cart`}
                      onClick={() => onRemove(dish.id)}
                    >
                      <Icon name="trash" size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WithSidebar>
    </Section>
  );
}