import { Card, CardBody, CardTitle, Price, Stack, Button, Media } from '../components/ui';
import { Icon } from '../components/icons';
import type { CartItem } from '../contexts/CartContext.tsx';

interface CheckoutSummaryProps {
  items: CartItem[];
  total: number;
  deliveryFee?: number;
  orderType: string;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function CheckoutSummary({
  items,
  total,
  deliveryFee = 0,
  orderType,
  onSubmit,
  loading = false,
  disabled = false,
}: CheckoutSummaryProps) {
  const fee = orderType === 'delivery' ? deliveryFee : 0;
  const grandTotal = total + fee;

  return (
    <Card>
      <CardBody>
        <CardTitle>Your order</CardTitle>
        <Stack gap="sm">
          {items.length === 0 ? (
            <p className="ds-muted">No dishes in your cart yet.</p>
          ) : (
            items.map((item) => (
              <div key={item.dish.id} className="ds-between">
                <Stack gap="xs" align="start">
                  <div className="ds-cluster">
                    <Media
                      src={item.dish.imageUrl}
                      alt={item.dish.name}
                      ratio="square"
                    />
                    <div>
                      <div>{item.dish.name}</div>
                      <span className="ds-small ds-muted">
                        Qty {item.quantity} &times; ${Number(item.dish.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Stack>
                <Price value={Number(item.dish.price) * item.quantity} />
              </div>
            ))
          )}
        </Stack>

        <div className="ds-between">
          <span className="ds-muted">Subtotal</span>
          <Price value={total} />
        </div>
        {orderType === 'delivery' && (
          <div className="ds-between">
            <span className="ds-muted">Delivery fee</span>
            <Price value={fee} />
          </div>
        )}
        <div className="ds-between">
          <strong>Total</strong>
          <Price value={grandTotal} />
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={disabled || loading || items.length === 0}
        >
          {loading ? 'Placing order...' : (
            <>
              <Icon name="credit-card" /> Place order
            </>
          )}
        </Button>
      </CardBody>
    </Card>
  );
}