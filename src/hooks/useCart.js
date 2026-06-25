import { useState, useCallback, useMemo } from 'react';

export function useCart() {
  const [items, setItems] = useState([]);

  const addItem = useCallback(({ itemId, name, variant, price }) => {
    setItems(prev => {
      const existing = prev.find(i => i.cartId === itemId);
      if (existing) {
        return prev.map(i => i.cartId === itemId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { cartId: itemId, name, variant, price, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((cartId) => {
    setItems(prev => {
      const item = prev.find(i => i.cartId === cartId);
      if (!item) return prev;
      if (item.qty > 1) return prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty - 1 } : i);
      return prev.filter(i => i.cartId !== cartId);
    });
  }, []);

  const incrementItem = useCallback((cartId) => {
    setItems(prev => prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total   = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count   = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const isEmpty = items.length === 0;

  return { items, addItem, removeItem, incrementItem, clearCart, total, count, isEmpty };
}
