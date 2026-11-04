import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, getReservationList } from '../api';
import type { Reservation, User as TypesUser } from '../types';
import type { ReservationFormData } from '../components/ReservationForm';
import ReservationsHeader from '../components/ReservationsHeader';
import ReservationsContent from '../components/ReservationsContent';
import ReservationsDetails from '../components/ReservationsDetails';
import ReservationForm from '../components/ReservationForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Section, Alert } from '../components/ui';

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState('');

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReservationList();
      setReservations(data);
    } catch (err) {
      setError('Unable to load your reservations right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleCreate = async (data: ReservationFormData) => {
    setCreating(true);
    setCreateError('');
    setCreateSuccess(false);
    try {
      const created = await api.post('/reservations/', data);
      setReservations((prev) => [created.data, ...prev]);
      setCreateSuccess(true);
      setTimeout(() => setCreateSuccess(false), 2000);
    } catch (err) {
      setCreateError('Could not book your table. Please check the details and try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    setCancelError('');
    try {
      const updated = await api.patch(`/reservations/${id}/`, { status: 'cancelled' });
      setReservations((prev) => prev.map((r) => (r.id === id ? updated.data : r)));
    } catch (err) {
      setCancelError('Could not cancel that reservation. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const detailsUser: TypesUser | null = user
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
      <ReservationsHeader userName={user?.name || user?.email} />

      <Section
        eyebrow="Book a table"
        title="Reserve your spot"
        subtitle="Pick a date, time and party size and we'll hold your table."
        narrow
      >
        {createError && <Alert tone="danger">{createError}</Alert>}
        {createSuccess && <Alert tone="success">Reservation booked</Alert>}
        <ReservationForm onSubmit={handleCreate} loading={creating} />
      </Section>

      {loading ? (
        <LoadingSpinner label="Loading your reservations..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          {cancelError && <Alert tone="danger">{cancelError}</Alert>}
          <ReservationsContent
            reservations={reservations}
            onCancel={handleCancel}
            cancellingId={cancellingId}
          />
        </>
      )}

      <ReservationsDetails user={detailsUser} reservations={reservations} />
    </div>
  );
}
