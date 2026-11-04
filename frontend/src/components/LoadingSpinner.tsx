import { Spinner } from './ui';

interface LoadingSpinnerProps {
  label?: string;
}

function LoadingSpinner({ label = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <div className="ds-loading" role="status" aria-live="polite">
      <Spinner />
      {label && <span className="ds-muted">{label}</span>}
    </div>
  );
}

export { LoadingSpinner };
export default LoadingSpinner;