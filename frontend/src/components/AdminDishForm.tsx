import { useState, useEffect, FormEvent } from 'react';
import type { Dish, Category } from '../types';

interface AdminDishFormProps {
  dish?: Dish | null;
  categories: Category[];
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    imageUrl: string;
    isAvailable: boolean;
  }) => void;
  onCancel: () => void;
}

function AdminDishForm({ dish, categories, onSubmit, onCancel }: AdminDishFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (dish) {
      setName(dish.name);
      setDescription(dish.description || '');
      setPrice(String(dish.price));
      setCategoryId(String(dish.categoryId ?? ''));
      setImageUrl(dish.imageUrl || '');
      setIsAvailable(dish.isAvailable);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId(categories[0] ? String(categories[0].id) : '');
      setImageUrl('');
      setIsAvailable(true);
    }
  }, [dish, categories]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('The dish needs a name.');
      return;
    }
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setError('Enter a valid price.');
      return;
    }
    const catId = Number(categoryId);
    if (!catId) {
      setError('Choose a category for this dish.');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      categoryId: catId,
      imageUrl: imageUrl.trim(),
      isAvailable,
    });
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="ds-field">
        <label className="ds-label" htmlFor="dish-name">Name</label>
        <input
          id="dish-name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Grilled Saffron Chicken"
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="dish-description">Description</label>
        <textarea
          id="dish-description"
          className="input"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the dish, its ingredients and preparation"
        />
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-price">Price</label>
          <input
            id="dish-price"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-category">Category</label>
          <select
            id="dish-category"
            className="input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="dish-image">Image URL</label>
        <input
          id="dish-image"
          className="input"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="/img/brand/hero.jpg"
        />
        <span className="ds-help">Path to an image under /img/</span>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="dish-available">
          <input
            id="dish-available"
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          Available on the menu
        </label>
      </div>

      <div className="ds-form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {dish ? 'Update dish' : 'Create dish'}
        </button>
      </div>
    </form>
  );
}

export default AdminDishForm;