import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrderList, updateOrder } from '../api';
import type { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdminOrdersHeader from '../components/AdminOrdersHeader';
import AdminOrdersStats from '../components/AdminOrdersStats';
import AdminOrdersRecent from '../components/AdminOrdersRecent';
import AdminOrdersActions from '../components/AdminOrdersActions';
import AdminOrderTable from '../components/AdminOrderTable';
import { Section } from '../components/ui';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrderList();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Could not load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      const updated = await updateOrder(orderId, { status });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error(err);
      setError('Could not update the order status. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading orders..." />;
  }

  return (
    <div className="ds-stack-lg">
      <AdminOrdersHeader userName={user?.name ?? undefined} onRefresh={fetchOrders} />
      {error && <ErrorMessage message={error} />}
      <AdminOrdersStats orders={orders} />
      <AdminOrdersRecent orders={orders} />
      <AdminOrdersActions onRefresh={fetchOrders} />
      <Section eyebrow="Manage" title="All orders" subtitle="Update status and track fulfillment across pickup and delivery orders.">
        <AdminOrderTable orders={orders} onUpdateStatus={handleUpdateStatus} />
      </Section>
    </div>
  );
}
