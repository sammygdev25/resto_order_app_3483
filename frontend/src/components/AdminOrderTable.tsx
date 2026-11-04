import { useState } from 'react';
import type { Order } from '../types';
import OrderStatusBadge from './OrderStatusBadge';
import { Icon } from './icons';

interface AdminOrderTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, status: string) => void | Promise<void>;
}

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'completed',
  'cancelled',
];

function formatStatusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function AdminOrderTable({ orders, onUpdateStatus }: AdminOrderTableProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleChange = async (orderId: number, status: string) => {
    setUpdatingId(orderId);
    try {
      await onUpdateStatus(orderId, status);
    } finally {
      setUpdatingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="ds-empty">
        <Icon name="package" size={32} />
        <p>No orders to show yet.</p>
      </div>
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Placed</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.user?.name ?? `User ${order.userId}`}</td>
              <td>
                {order.orderType === 'delivery' ? (
                  <span className="ds-cluster" style={{ gap: '0.35rem' }}>
                    <Icon name="truck" size={16} /> Delivery
                  </span>
                ) : (
                  <span className="ds-cluster" style={{ gap: '0.35rem' }}>
                    <Icon name="package" size={16} /> Pickup
                  </span>
                )}
              </td>
              <td>${Number(order.totalAmount).toFixed(2)}</td>
              <td>
                <span
                  className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : ''}`}
                >
                  {formatStatusLabel(order.paymentStatus)}
                </span>
              </td>
              <td>
                <OrderStatusBadge status={order.status} />
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <select
                  className="input"
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleChange(order.id, e.target.value)}
                  style={{ minWidth: '9rem' }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {formatStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}