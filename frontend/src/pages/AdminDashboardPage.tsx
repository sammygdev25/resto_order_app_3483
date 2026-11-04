import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboardHeader from '../components/AdminDashboardHeader';
import AdminDashboardStats from '../components/AdminDashboardStats';
import AdminDashboardRecent from '../components/AdminDashboardRecent';
import AdminDashboardActions from '../components/AdminDashboardActions';
import { Alert } from '../components/ui';
import { getOrderList, getReservationList, getAdminStats } from '../api';
import type { Order, Reservation } from '../types';
import type { AdminDashboardStatsData } from '../components/AdminDashboardStats';

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function toStatsData(data: Record<string, unknown>): AdminDashboardStatsData {
  return {
    totalOrders: toNumber(data.totalOrders),
    totalRevenue: toNumber(data.totalRevenue),
    pendingOrders: toNumber(data.pendingOrders),
    totalReservations: toNumber(data.totalReservations),
  };
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStatsData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [ordersError, setOrdersError] = useState('');
  const [reservationsError, setReservationsError] = useState('');

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError('');
    try {
      const data = await getAdminStats();
      setStats(toStatsData(data));
    } catch (err) {
      console.error(err);
      setStatsError('Unable to load dashboard stats.');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setOrdersError('');
    try {
      const data = await getOrderList();
      setOrders(data.slice(0, 5));
    } catch (err) {
      console.error(err);
      setOrdersError('Unable to load recent orders.');
    }
  }, []);

  const loadReservations = useCallback(async () => {
    setReservationsError('');
    try {
      const data = await getReservationList();
      setReservations(data.slice(0, 5));
    } catch (err) {
      console.error(err);
      setReservationsError('Unable to load recent reservations.');
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadOrders();
    loadReservations();
  }, [loadStats, loadOrders, loadReservations]);

  const handleRefresh = () => {
    loadStats();
    loadOrders();
    loadReservations();
  };

  return (
    <div className="ds-stack-lg">
      <AdminDashboardHeader userName={user?.name ?? undefined} onRefresh={handleRefresh} />

      {statsError && <Alert tone="danger">{statsError}</Alert>}
      <AdminDashboardStats stats={stats} loading={statsLoading} />

      {(ordersError || reservationsError) && (
        <Alert tone="danger">{ordersError || reservationsError}</Alert>
      )}
      <AdminDashboardRecent orders={orders} reservations={reservations} />

      <AdminDashboardActions />
    </div>
  );
}
