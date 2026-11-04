import { Card, CardBody, Price, Button, Stack } from '../components/ui';
import { Icon } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../contexts/CartContext';

interface CartSummaryProps {
  items: CartItem[];
  total: number;
  deliveryFee: number;
}

export default function CartSummary({ items, total, deliveryFee }: CartSummaryProps) {
  const navigate = useNavigate();
  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const grandTotal = total + deliveryFee;

  return (
    <Card>
      <CardBody>
        <Stack gap="sm">
          <h3 className="ds-card-title">Order Summary</h3>
          <div className="ds-between">
            <span className="ds-muted">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
            <Price value={total} />
          </div>
          <div className="ds-between">
            <span className="ds-muted">Delivery fee</span>
            {deliveryFee > 0 ? (
              <Price value={deliveryFee} />
            ) : (
              <span className="ds-small">Free</span>
            )}
          </div>
          <div className="ds-between">
            <span className="ds-card-title">Total</span>
            <Price value={grandTotal} />
          </div>
          <Button
            variant="primary"
            size="lg"
            disabled={items.length === 0}
            onClick={() => navigate('/checkout')}
          >
            <Icon name="credit-card" /> Proceed to Checkout
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
}