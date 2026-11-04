import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { getDishList, getCategoryList } from '../api';
import type { Dish, Category } from '../types';
import HomeHero from '../components/HomeHero';
import HomeFeatured from '../components/HomeFeatured';
import HomeCategories from '../components/HomeCategories';
import HomeAbout from '../components/HomeAbout';
import HomeCta from '../components/HomeCta';
import { Alert } from '../components/ui';

export default function HomePage() {
  const { addItem } = useCart();

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [dishesLoading, setDishesLoading] = useState(true);
  const [dishesError, setDishesError] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState('');

  useEffect(() => {
    let active = true;
    setDishesLoading(true);
    getDishList()
      .then((data) => {
        if (!active) return;
        const available = data.filter((d) => d.isAvailable);
        setDishes((available.length ? available : data).slice(0, 8));
      })
      .catch(() => {
        if (active) setDishesError('Could not load the featured dishes right now.');
      })
      .finally(() => {
        if (active) setDishesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getCategoryList()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {
        if (active) setCategoriesError('Could not load the menu categories right now.');
      });
    return () => {
      active = false;
    };
  }, []);

  const handleAddToCart = (dish: Dish) => {
    addItem(dish);
  };

  return (
    <div className="ds-stack-lg">
      <HomeHero imageUrl="/img/brand/hero.jpg" />

      {dishesError ? (
        <Alert tone="danger">{dishesError}</Alert>
      ) : (
        <HomeFeatured dishes={dishes} loading={dishesLoading} onAddToCart={handleAddToCart} />
      )}

      {categoriesError ? (
        <Alert tone="danger">{categoriesError}</Alert>
      ) : (
        <HomeCategories categories={categories} />
      )}

      <HomeAbout />

      <HomeCta />
    </div>
  );
}