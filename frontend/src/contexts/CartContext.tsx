import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import type { Dish } from '../types';

export interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (dish: Dish, quantity?: number) => void;
  removeItem: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'cart_items';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error(err);
    }
  }, [items]);

  const addItem = useCallback((dish: Dish, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.dish.id === dish.id);
      if (existing) {
        return prev.map((it) =>
          it.dish.id === dish.id ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [...prev, { dish, quantity }];
    });
  }, []);

  const removeItem = useCallback((dishId: number) => {
    setItems((prev) => prev.filter((it) => it.dish.id !== dishId));
  }, []);

  const updateQuantity = useCallback((dishId: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((it) => it.dish.id !== dishId);
      }
      return prev.map((it) => (it.dish.id === dishId ? { ...it, quantity } : it));
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.dish.price) * it.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, total, itemCount, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be within CartProvider');
  return ctx;
};