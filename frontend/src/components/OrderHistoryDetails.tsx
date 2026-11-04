import { Section, Card, CardBody, Stack, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

interface OrderHistoryDetailsProps {
  orderCount?: number;
}

export default function OrderHistoryDetails({ orderCount }: OrderHistoryDetailsProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Section eyebrow="Account" title="Your details" narrow tight>
      <Card>
        <CardBody>
          <div className="ds-form">
            <Stack gap="sm">
              <div className="ds-field">
                <span className="ds-label">Name</span>
                <p>{user.name}</p>
              </div>
              <div className="ds-field">
                <span className="ds-label">Email</span>
                <p>{user.email}</p>
              </div>
              {user.phone && (
                <div className="ds-field">
                  <span className="ds-label">Phone</span>
                  <p>{user.phone}</p>
                </div>
              )}
              <div className="ds-field">
                <span className="ds-label">Account type</span>
                <Badge tone={user.role === 'admin' ? 'primary' : 'neutral'}>
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
                </Badge>
              </div>
              {typeof orderCount === 'number' && (
                <div className="ds-field">
                  <span className="ds-label">Total orders placed</span>
                  <p className="ds-cluster">
                    <Icon name="package" size={16} />
                    {orderCount}
                  </p>
                </div>
              )}
            </Stack>
          </div>
        </CardBody>
      </Card>
    </Section>
  );
}