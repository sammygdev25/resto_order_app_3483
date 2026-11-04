import { Section } from '../components/ui';
import { Icon } from '../components/icons';
import type { Category } from '../types';

export interface DishListFiltersProps {
  categories: Category[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function DishListFilters({
  categories,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: DishListFiltersProps) {
  return (
    <Section tight>
      <div className="ds-filters">
        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-search">
            Search the menu
          </label>
          <div className="ds-cluster">
            <Icon name="search" size={18} />
            <input
              id="dish-search"
              className="input"
              type="text"
              placeholder="Search for a dish, e.g. seared scallops..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-category">
            Category
          </label>
          <select
            id="dish-category"
            className="input"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-sort">
            Sort by
          </label>
          <select
            id="dish-sort"
            className="input"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-asc">Price (low to high)</option>
            <option value="price-desc">Price (high to low)</option>
          </select>
        </div>
      </div>
    </Section>
  );
}