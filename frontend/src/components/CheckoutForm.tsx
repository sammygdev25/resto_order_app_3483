import { Section, Alert } from '../components/ui';
import { Icon } from '../components/icons';

interface CheckoutFormProps {
  orderType: 'pickup' | 'delivery';
  onOrderTypeChange: (type: 'pickup' | 'delivery') => void;
  address: string;
  onAddressChange: (address: string) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  error?: string | null;
}

export default function CheckoutForm({
  orderType,
  onOrderTypeChange,
  address,
  onAddressChange,
  phone,
  onPhoneChange,
  error,
}: CheckoutFormProps) {
  return (
    <Section eyebrow="Checkout" title="Delivery details" tight>
      {error && <Alert tone="danger">{error}</Alert>}
      <form className="ds-form" onSubmit={(e) => e.preventDefault()}>
        <div className="ds-field">
          <label className="ds-label">How would you like your order?</label>
          <div className="ds-cluster">
            <button
              type="button"
              className={`btn ${orderType === 'pickup' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onOrderTypeChange('pickup')}
            >
              <Icon name="package" size={16} /> Pickup
            </button>
            <button
              type="button"
              className={`btn ${orderType === 'delivery' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onOrderTypeChange('delivery')}
            >
              <Icon name="truck" size={16} /> Delivery
            </button>
          </div>
          <p className="ds-help">
            Pickup orders are ready at the counter; delivery adds a flat fee and arrives at your door.
          </p>
        </div>

        {orderType === 'delivery' && (
          <div className="ds-field">
            <label className="ds-label" htmlFor="address">
              Delivery address
            </label>
            <input
              id="address"
              className="input"
              type="text"
              placeholder="123 Maple Street, Apt 4B"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              required
            />
          </div>
        )}

        <div className="ds-field">
          <label className="ds-label" htmlFor="phone">
            Contact phone
          </label>
          <input
            id="phone"
            className="input"
            type="tel"
            placeholder="(555) 012-3456"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            required
          />
          <p className="ds-help">
            <Icon name="phone" size={14} /> We'll text you if anything about your order changes.
          </p>
        </div>
      </form>
    </Section>
  );
}