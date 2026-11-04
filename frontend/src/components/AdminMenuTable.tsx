import type { Dish } from '../types';
import { Button } from './ui';
import { Icon } from './icons';
import { Price } from './ui';
import { EmptyState } from './ui';

interface AdminMenuTableProps {
  dishes: Dish[];
  onEdit: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
  onToggleAvailability: (dish: Dish) => void;
}

function AdminMenuTable({ dishes, onEdit, onDelete, onToggleAvailability }: AdminMenuTableProps) {
  if (dishes.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No dishes yet"
        text="Add your first dish to start building the menu."
      />
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Dish</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish) => (
            <tr key={dish.id}>
              <td>
                <div className="ds-cluster" style={{ alignItems: 'center' }}>
                  <strong>{dish.name}</strong>
                </div>
                {dish.description && (
                  <div className="ds-small ds-muted">{dish.description}</div>
                )}
              </td>
              <td>{dish.category?.name ?? '—'}</td>
              <td>
                <Price value={dish.price} />
              </td>
              <td>
                <button
                  type="button"
                  className="badge"
                  onClick={() => onToggleAvailability(dish)}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    color: dish.isAvailable ? 'var(--color-success)' : 'var(--color-danger)',
                    background: 'transparent',
                  }}
                >
                  <Icon name={dish.isAvailable ? 'check' : 'close'} size={14} />{' '}
                  {dish.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </td>
              <td>
                <div className="ds-cluster">
                  <Button variant="ghost" size="md" onClick={() => onEdit(dish)}>
                    <Icon name="edit" size={16} /> Edit
                  </Button>
                  <Button variant="danger" size="md" onClick={() => onDelete(dish)}>
                    <Icon name="trash" size={16} /> Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminMenuTable;
export { AdminMenuTable };