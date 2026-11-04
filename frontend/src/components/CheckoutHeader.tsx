import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface CheckoutHeaderProps {
  step?: 'details' | 'payment';
}

export default function CheckoutHeader({ step = 'details' }: CheckoutHeaderProps) {
  return (
    <PageHeader
      eyebrow="Checkout"
      title="Finish your order"
      subtitle="Choose pickup or delivery, confirm your details and pay securely to send your order to the kitchen."
      actions={
        <div className="ds-cluster">
          <span className={`ds-badge ${step === 'details' ? '' : 'ds-muted'}`}>
            <Icon name="list" size={16} /> 1. Details
          </span>
          <Icon name="chevron-right" size={16} />
          <span className={`ds-badge ${step === 'payment' ? '' : 'ds-muted'}`}>
            <Icon name="credit-card" size={16} /> 2. Payment
          </span>
        </div>
      }
    />
  );
}