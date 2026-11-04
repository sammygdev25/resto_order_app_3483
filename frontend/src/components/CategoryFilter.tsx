import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="ds-cluster" role="group" aria-label="Filter dishes by category">
      <button
        type="button"
        className={`badge ${selectedCategory === '' ? 'badge-active' : ''}`}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-md, 8px)',
          border: `1px solid ${selectedCategory === '' ? 'var(--color-primary)' : 'var(--color-border)'}`,
          background: selectedCategory === '' ? 'var(--color-primary)' : 'var(--color-surface)',
          color: selectedCategory === '' ? '#fff' : 'var(--color-text)',
          cursor: 'pointer',
          fontFamily: 'var(--font-body, Inter)',
          fontSize: '0.9rem',
        }}
        onClick={() => onSelect('')}
      >
        All dishes
      </button>
      {categories.map((category) => {
        const isActive = selectedCategory === category.name;
        return (
          <button
            key={category.id}
            type="button"
            className={`badge ${isActive ? 'badge-active' : ''}`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md, 8px)',
              border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
              color: isActive ? '#fff' : 'var(--color-text)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body, Inter)',
              fontSize: '0.9rem',
            }}
            onClick={() => onSelect(category.name)}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
export { CategoryFilter };
