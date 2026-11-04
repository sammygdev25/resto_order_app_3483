import { Section, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Dish } from '../types';

interface AdminMenuRecentProps {
  dishes: Dish[];
  onEdit?: (dish: Dish) => void;
}

export default function AdminMenuRecent({ dishes, onEdit }: AdminMenuRecentProps) {
  const recent = [...dishes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Section eyebrow="Kitchen log" title="Recent activity" tight>
      {recent.length === 0 ? (
        <EmptyState
          icon="clock"
          title="No dishes added yet"
          text="Dishes you add to the menu will show up here as soon as they're created."
        />
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((dish) => (
                <tr
                  key={dish.id}
                  onClick={() => onEdit?.(dish)}
                  style={onEdit ? { cursor: 'pointer' } : undefined}
                >
                  <td>
                    <span className="ds-cluster" style={{ gap: '0.5rem' }}>
                      <Icon name="book" size={16} />
                      {dish.name}
                    </span>
                  </td>
                  <td>{dish.category?.name ?? '—'}</td>
                  <td>${Number(dish.price).toFixed(2)}</td>
                  <td>
                    {dish.isAvailable ? (
                      <span className="ds-badge-soft">Available</span>
                    ) : (
                      <span className="ds-muted">86'd</span>
                    )}
                  </td>
                  <td className="ds-small ds-muted">
                    {new Date(dish.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}