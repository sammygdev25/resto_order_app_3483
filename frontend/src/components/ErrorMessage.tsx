import { Alert } from './ui';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <Alert tone="danger">
      {message}
    </Alert>
  );
}

export default ErrorMessage;
export { ErrorMessage };