import { Icon } from '../components/icons';

interface CheckoutDeliveryFormProps {
  orderType: string;
  onOrderTypeChange: (type: string) => void;
  address: string;
  onAddressChange: (address: string) => void;
}

function CheckoutDeliveryForm({ orderType, onOrderTypeChange, address, onAddressChange }: CheckoutDeliveryFormProps) {
  return (
    <div className="ds-form">
      <div className="ds-field">
        <span className="ds-label">Order type</span>
        <div className="ds-cluster">
          <button
            type="button"
            className="btn"
            style={{
              borderColor: orderType === 'pickup' ? 'var(--color-primary)' : 'var(--color-border)',
              background: orderType === 'pickup' ? 'var(--color-primary)' : 'transparent',
              color: orderType === 'pickup' ? '#fff' : 'var(--color-text)',
            }}
            onClick={() => onOrderTypeChange('pickup')}
          >
            <Icon name="package" size={16} /> Pickup
          </button>
          <button
            type="button"
            className="btn"
            style={{
              borderColor: orderType === 'delivery' ? 'var(--color-primary)' : 'var(--color-border)',
              background: orderType === 'delivery' ? 'var(--color-primary)' : 'transparent',
              color: orderType === 'delivery' ? '#fff' : 'var(--color-text)',
            }}
            onClick={() => onOrderTypeChange('delivery')}
          >
            <Icon name="truck" size={16} /> Delivery
          </button>
        </div>
        <p className="ds-help">
          {orderType === 'delivery'
            ? 'A delivery fee applies and a courier will bring your order to the address below.'
            : 'Pick your order up at the restaurant counter, no delivery fee.'}
        </p>
      </div>

      {orderType === 'delivery' && (
        <div className="ds-field">
          <label className="ds-label" htmlFor="delivery-address">
            Delivery address
          </label>
          <input
            id="delivery-address"
            className="input"
            type="text"
            placeholder="Street, number, city, postcode"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            required
          />
          <p className="ds-help">We'll text you when the courier is on the way.</p>
        </div>
      )}
    </div>
  );
}

export default CheckoutDeliveryForm;
export { CheckoutDeliveryForm };