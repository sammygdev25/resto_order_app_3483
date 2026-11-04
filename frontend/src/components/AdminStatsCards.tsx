import { Stat } from './ui';

interface AdminStats {
  total_orders?: number;
  pending_orders?: number;
  total_revenue?: number;
  total_reservations?: number;
  pending_reservations?: number;
  total_dishes?: number;
  [key: string]: number | undefined;
}

interface AdminStatsCardsProps {
  stats: AdminStats;
}

function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return '$0.00';
  return `$${Number(value).toFixed(2)}`;
}

function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="ds-grid ds-grid-sm">
      <Stat
        value={stats.total_orders ?? 0}
        label="Total Orders"
        icon="package"
      />
      <Stat
        value={stats.pending_orders ?? 0}
        label="Pending Orders"
        icon="clock"
      />
      <Stat
        value={formatCurrency(stats.total_revenue)}
        label="Total Revenue"
        icon="dollar"
      />
      <Stat
        value={stats.total_reservations ?? 0}
        label="Total Reservations"
        icon="calendar"
      />
      <Stat
        value={stats.pending_reservations ?? 0}
        label="Pending Reservations"
        icon="clock"
      />
      <Stat
        value={stats.total_dishes ?? 0}
        label="Menu Dishes"
        icon="book"
      />
    </div>
  );
}

export { AdminStatsCards };
export default AdminStatsCards;