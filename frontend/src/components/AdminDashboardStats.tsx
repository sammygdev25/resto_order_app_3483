import { Grid, Stat } from '../components/ui';

export interface AdminDashboardStatsData {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalReservations: number;
}

interface AdminDashboardStatsProps {
  stats: AdminDashboardStatsData | null;
  loading?: boolean;
}

export default function AdminDashboardStats({ stats, loading }: AdminDashboardStatsProps) {
  const safeStats: AdminDashboardStatsData = stats ?? {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalReservations: 0,
  };

  return (
    <Grid size="sm" cols={4}>
      <Stat
        value={loading ? '—' : String(safeStats.totalOrders)}
        label="Total Orders"
        icon="package"
      />
      <Stat
        value={loading ? '—' : `$${Number(safeStats.totalRevenue || 0).toFixed(2)}`}
        label="Revenue"
        icon="dollar"
      />
      <Stat
        value={loading ? '—' : String(safeStats.pendingOrders)}
        label="Pending Orders"
        icon="clock"
      />
      <Stat
        value={loading ? '—' : String(safeStats.totalReservations)}
        label="Reservations"
        icon="calendar"
      />
    </Grid>
  );
}