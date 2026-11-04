import { Section, Stack, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { User, Reservation } from '../types';

interface ReservationsDetailsProps {
  user: User | null;
  reservations: Reservation[];
}

export default function ReservationsDetails({ user, reservations }: ReservationsDetailsProps) {
  const upcoming = reservations.filter((r) => r.status !== 'cancelled');
  const confirmed = reservations.filter((r) => r.status === 'confirmed').length;
  const pending = reservations.filter((r) => r.status === 'pending').length;

  return (
    <Section narrow eyebrow="Your account" title="Account details">
      <div className="ds-card">
        <div className="ds-card-body">
          <Stack gap="md">
            <div className="ds-field">
              <span className="ds-label">Name</span>
              <p>{user?.name || 'Guest diner'}</p>
            </div>
            <div className="ds-field">
              <span className="ds-label">Email</span>
              <p>{user?.email || '—'}</p>
            </div>
            <div className="ds-field">
              <span className="ds-label">Phone</span>
              <p>{user?.phone || 'Not provided'}</p>
            </div>
            <div className="ds-field">
              <span className="ds-label">Reservation summary</span>
              <div className="ds-cluster">
                <Badge tone="primary">{upcoming.length} active</Badge>
                <Badge tone="success">{confirmed} confirmed</Badge>
                <Badge tone="soft">{pending} pending</Badge>
              </div>
            </div>
            <p className="ds-help">
              <Icon name="info" size={14} /> Update your contact details from your profile page so our host stand can
              reach you about your table.
            </p>
          </Stack>
        </div>
      </div>
    </Section>
  );
}