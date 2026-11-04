import { useState, FormEvent } from 'react';
import { Button, Alert } from './ui';
import { Icon } from './icons';

interface CheckoutPaymentFormProps {
  clientSecret: string;
  loading: boolean;
  onSubmit: () => void;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function CheckoutPaymentForm({ clientSecret, loading, onSubmit }: CheckoutPaymentFormProps) {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cardholderName.trim()) {
      setError('Enter the name on the card.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length < 5) {
      setError('Enter the card expiry date (MM/YY).');
      return;
    }
    if (cvc.length < 3) {
      setError('Enter the card security code.');
      return;
    }
    if (!clientSecret) {
      setError('Payment session is not ready yet. Please try again.');
      return;
    }

    setSubmitting(true);
    try {
      onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = loading || submitting;

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="ds-field">
        <label className="ds-label" htmlFor="cardholderName">Name on card</label>
        <input
          id="cardholderName"
          className="input"
          type="text"
          placeholder="Jamie Rivera"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          autoComplete="cc-name"
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="cardNumber">Card number</label>
        <input
          id="cardNumber"
          className="input"
          type="text"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          autoComplete="cc-number"
        />
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="expiry">Expiry</label>
          <input
            id="expiry"
            className="input"
            type="text"
            inputMode="numeric"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            autoComplete="cc-exp"
          />
        </div>
        <div className="ds-field">
          <label className="ds-label" htmlFor="cvc">CVC</label>
          <input
            id="cvc"
            className="input"
            type="text"
            inputMode="numeric"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
            autoComplete="cc-csc"
          />
        </div>
      </div>

      <p className="ds-help">
        <Icon name="shield" size={14} /> Payments are securely processed. Your card details are
        never stored on our servers.
      </p>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" size="lg" disabled={isBusy}>
          {isBusy ? 'Processing…' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}

export default CheckoutPaymentForm;
export { CheckoutPaymentForm };
