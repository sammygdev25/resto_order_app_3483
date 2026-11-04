import { useState, FormEvent } from 'react';
import { Button } from './ui';

export interface ReservationFormData {
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  specialRequests: string;
}

interface ReservationFormProps {
  onSubmit: (data: ReservationFormData) => void;
  loading: boolean;
}

function ReservationForm({ onSubmit, loading }: ReservationFormProps) {
  const [partySize, setPartySize] = useState(2);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reservationDate || !reservationTime) {
      setError('Please choose a date and time for your table.');
      return;
    }
    if (partySize < 1) {
      setError('Party size must be at least 1 guest.');
      return;
    }

    onSubmit({
      partySize,
      reservationDate,
      reservationTime,
      specialRequests,
    });

    setPartySize(2);
    setReservationDate('');
    setReservationTime('');
    setSpecialRequests('');
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" role="alert" style={{ borderColor: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="partySize">
            Party size
          </label>
          <input
            id="partySize"
            className="input"
            type="number"
            min={1}
            max={20}
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            required
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="reservationDate">
            Date
          </label>
          <input
            id="reservationDate"
            className="input"
            type="date"
            min={today}
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            required
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="reservationTime">
            Time
          </label>
          <input
            id="reservationTime"
            className="input"
            type="time"
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="specialRequests">
          Special requests
        </label>
        <textarea
          id="specialRequests"
          className="input"
          rows={3}
          placeholder="Allergies, a window table, a birthday to celebrate..."
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
        />
        <span className="ds-help">Optional — let us know how to make your visit special.</span>
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" size="lg" disabled={loading}>
          {loading ? 'Booking your table...' : 'Reserve a table'}
        </Button>
      </div>
    </form>
  );
}

export default ReservationForm;
export { ReservationForm };