import type { CartItem } from '../contexts/CartContext.tsx';
import { Card, CardBody, CardTitle, Price, Stack, Icon } from './ui';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  total: number;
  orderType: string;
}

function CheckoutOrderSummary({ items, total, orderType }: CheckoutOrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.dish?.price ?? 0) * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? total - subtotal : 0;

  return (
    <Card>
      <CardBody>
        <CardTitle>Order Summary</CardTitle>
        <Stack gap="sm">
          {items.length === 0 ? (
            <p className="ds-muted">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div className="ds-between" key={item.dish?.id}>
                <span>
                  {item.quantity} &times; {item.dish?.name}
                </span>
                <Price value={Number(item.dish?.price ?? 0) * item.quantity} />
              </div>
            ))
          )}
        </Stack>

        <div className="ds-between" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <span className="ds-muted">Subtotal</span>
          <Price value={subtotal} />
        </div>

        {orderType === 'delivery' && (
          <div className="ds-between">
            <span className="ds-muted">
              <Icon name="truck" size={16} /> Delivery Fee
            </span>
            <Price value={deliveryFee > 0 ? deliveryFee : 3.99} />
          </div>
        )}

        <div className="ds-between" style={{ marginTop: '0.5rem', fontWeight: 600 }}>
          <span>Total</span>
          <Price value={total} />
        </div>
      </CardBody>
    </Card>
  );
}

export default CheckoutOrderSummary;
export { CheckoutOrderSummary };