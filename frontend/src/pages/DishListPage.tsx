import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDishList, getCategoryList } from '../api';
import { useCart } from '../contexts/CartContext';
import type { Dish, Category } from '../types';
import DishListHeader from '../components/DishListHeader';
import DishListFilters from '../components/DishListFilters';
import DishListGrid from '../components/DishListGrid';
import DishListPagination from '../components/DishListPagination';

const PAGE_SIZE = 9;

export default function DishListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);

  const { addItem } = useCart();

  useEffect(() => {
    const catParam = searchParams.get('category') || '';
    setSelectedCategory(catParam);
  }, [searchParams]);

  const loadDishes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDishList();
      setDishes(data);
    } catch (err) {
      console.error(err);
      setError('Could not load the menu. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategoryList();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadDishes();
    loadCategories();
  }, [loadDishes, loadCategories]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  const filteredDishes = useMemo(() => {
    let result = dishes.filter((d) => d.isAvailable !== false);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (d) => d.name.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((d) => {
        const slug = d.category?.name || String(d.categoryId);
        return slug === selectedCategory || String(d.categoryId) === selectedCategory;
      });
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [dishes, search, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / PAGE_SIZE));
  const pagedDishes = filteredDishes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSortBy('name');
    setPage(1);
    setSearchParams({});
  };

  const handleAddToCart = (dish: Dish) => {
    addItem(dish, 1);
  };

  return (
    <div className="ds-stack-lg">
      <DishListHeader resultCount={filteredDishes.length} loading={loading} />
      <DishListFilters
        categories={categories}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={(v) => {
          setSortBy(v);
          setPage(1);
        }}
      />
      <DishListGrid
        dishes={pagedDishes}
        loading={loading}
        error={error}
        onAddToCart={handleAddToCart}
        onClearFilters={handleClearFilters}
      />
      <DishListPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}