import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../api';
import { DELIVERY_FEE } from '../lib/fees';
import type { OrderItem } from '../types';
import CheckoutHeader from '../components/CheckoutHeader';
import CheckoutForm from '../components/CheckoutForm';
import CheckoutSummary from '../components/CheckoutSummary';
import { EmptyState } from '../components/ui';
import { Alert } from '../components/ui';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;

  const handleSubmit = async () => {
    setError(null);

    if (orderType === 'delivery' && !address.trim()) {
      setError('A delivery address is required for delivery orders.');
      return;
    }
    if (!phone.trim()) {
      setError('A contact phone number is required.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder({
        contactName: user?.name ?? '',
        contactPhone: phone.trim(),
        orderType,
        deliveryAddress: orderType === 'delivery' ? address.trim() : undefined,
        notes: '',
        items: items.map((item): OrderItem => ({
          id: 0,
          orderId: 0,
          dishId: item.dish.id,
          quantity: item.quantity,
          price: Number(item.dish.price),
          createdAt: new Date().toISOString(),
        })),
      });
      clearCart();
      navigate(`/order-pay?order=${order.id}`);
    } catch (err: any) {
      setError(err?.message || 'Could not place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="ds-container ds-section">
        <CheckoutHeader step="details" />
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          text="Add a few dishes from our menu before checking out."
          action={<Link to="/dishes">Browse the menu</Link>}
        />
      </div>
    );
  }

  return (
    <div className="ds-stack-lg">
      <CheckoutHeader step="details" />
      {error && (
        <div className="ds-container">
          <Alert tone="danger">{error}</Alert>
        </div>
      )}
      <div className="ds-container ds-grid-sidebar">
        <CheckoutForm
          orderType={orderType}
          onOrderTypeChange={setOrderType}
          address={address}
          onAddressChange={setAddress}
          phone={phone}
          onPhoneChange={setPhone}
          error={error}
        />
        <CheckoutSummary
          items={items}
          total={total}
          deliveryFee={deliveryFee}
          orderType={orderType}
          onSubmit={handleSubmit}
          loading={loading}
          disabled={loading}
        />
      </div>
    </div>
  );
}
