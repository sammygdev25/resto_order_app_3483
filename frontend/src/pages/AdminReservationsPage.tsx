import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getReservationList } from '../api';
import { api } from '../api';
import type { Reservation, User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdminReservationsHeader from '../components/AdminReservationsHeader';
import AdminReservationsStats from '../components/AdminReservationsStats';
import AdminReservationsRecent from '../components/AdminReservationsRecent';
import AdminReservationsActions from '../components/AdminReservationsActions';
import { AdminReservationTable } from '../components/AdminReservationTable';
import { Section, Alert } from '../components/ui';

export default function AdminReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReservationList();
      setReservations(data);
    } catch (err) {
      console.error(err);
      setError('Could not load reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleUpdateStatus = async (id: number, status: string) => {
    setActionError('');
    const previous = reservations;
    setReservations((current) =>
      current.map((r) => (r.id === id ? { ...r, status } : r))
    );
    try {
      await api.patch(`/reservations/${id}/`, { status });
    } catch (err) {
      console.error(err);
      setActionError('Could not update the reservation status. Please try again.');
      setReservations(previous);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading reservations..." />;
  }

  const headerUser: User | null = user
    ? {
        id: user.id,
        email: user.email,
        password: '',
        name: user.name ?? `${user.first_name} ${user.last_name}`.trim(),
        phone: user.phone ?? '',
        role: user.role,
        createdAt: '',
        updatedAt: '',
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
      }
    : null;

  return (
    <div className="ds-stack-lg">
      <AdminReservationsHeader user={headerUser} onRefresh={fetchReservations} />

      {error && <ErrorMessage message={error} />}
      {actionError && <Alert tone="danger">{actionError}</Alert>}

      <AdminReservationsStats reservations={reservations} />

      <AdminReservationsRecent reservations={reservations} />

      <Section
        eyebrow="Manage"
        title="All reservations"
        subtitle="Confirm, decline or review every booking for the dining room."
      >
        <AdminReservationTable
          reservations={reservations}
          onUpdateStatus={handleUpdateStatus}
        />
      </Section>

      <AdminReservationsActions onRefresh={fetchReservations} />
    </div>
  );
}
