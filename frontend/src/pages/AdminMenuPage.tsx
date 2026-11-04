import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminMenuHeader from '../components/AdminMenuHeader';
import AdminMenuStats from '../components/AdminMenuStats';
import AdminMenuRecent from '../components/AdminMenuRecent';
import AdminMenuActions from '../components/AdminMenuActions';
import AdminMenuTable from '../components/AdminMenuTable';
import AdminDishForm from '../components/AdminDishForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Alert } from '../components/ui';
import {
  getDishList,
  getCategoryList,
  createDish,
  updateDish,
  deleteDish,
} from '../api';
import type { Dish, Category } from '../types';

export default function AdminMenuPage() {
  const { user } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [actionMessage, setActionMessage] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);

  const loadDishes = useCallback(async () => {
    try {
      const data = await getDishList();
      setDishes(data);
    } catch (err) {
      console.error(err);
      setError('Could not load the menu. Please try again.');
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
    setLoading(true);
    Promise.allSettled([loadDishes(), loadCategories()]).finally(() => setLoading(false));
  }, [loadDishes, loadCategories]);

  const flashMessage = (tone: 'success' | 'danger', text: string) => {
    setActionMessage({ tone, text });
    setTimeout(() => setActionMessage(null), 2000);
  };

  const handleAddDish = () => {
    setEditingDish(null);
    setFormOpen(true);
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setFormOpen(true);
  };

  const handleCancelForm = () => {
    setFormOpen(false);
    setEditingDish(null);
  };

  const handleSubmitForm = async (data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    imageUrl: string;
    isAvailable: boolean;
  }) => {
    try {
      if (editingDish) {
        await updateDish(editingDish.id, data);
        flashMessage('success', 'Dish updated');
      } else {
        await createDish(data);
        flashMessage('success', 'Dish added to the menu');
      }
      setFormOpen(false);
      setEditingDish(null);
      await loadDishes();
    } catch (err) {
      console.error(err);
      flashMessage('danger', 'Could not save the dish');
    }
  };

  const handleDelete = async (dish: Dish) => {
    if (!window.confirm(`Remove "${dish.name}" from the menu?`)) return;
    try {
      await deleteDish(dish.id);
      flashMessage('success', 'Dish removed');
      await loadDishes();
    } catch (err) {
      console.error(err);
      flashMessage('danger', 'Could not remove the dish');
    }
  };

  const handleToggleAvailability = async (dish: Dish) => {
    try {
      await updateDish(dish.id, {
        name: dish.name,
        description: dish.description,
        price: Number(dish.price),
        categoryId: dish.categoryId,
        imageUrl: dish.imageUrl,
        isAvailable: !dish.isAvailable,
      });
      flashMessage('success', dish.isAvailable ? 'Dish marked unavailable' : 'Dish marked available');
      await loadDishes();
    } catch (err) {
      console.error(err);
      flashMessage('danger', 'Could not update availability');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading the kitchen's menu..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const recentDishes = [...dishes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="ds-stack-lg">
      <AdminMenuHeader userName={user?.name ?? undefined} onAddDish={handleAddDish} />

      {actionMessage && <Alert tone={actionMessage.tone}>{actionMessage.text}</Alert>}

      <AdminMenuStats dishes={dishes} categories={categories} />

      <AdminMenuRecent dishes={recentDishes} onEdit={handleEditDish} />

      <AdminMenuActions onAddDish={handleAddDish} />

      {formOpen && (
        <AdminDishForm
          dish={editingDish}
          categories={categories}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
        />
      )}

      <AdminMenuTable
        dishes={dishes}
        onEdit={handleEditDish}
        onDelete={handleDelete}
        onToggleAvailability={handleToggleAvailability}
      />
    </div>
  );
}
