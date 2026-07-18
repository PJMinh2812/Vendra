import { createContext, useContext, useEffect, useState } from 'react';
import { getProductById } from '../mock/data';

const CartContext = createContext(null);
const STORAGE_KEY = 'vendra_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(productId, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { productId, quantity, selected: true }];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function toggleSelected(productId) {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, selected: !i.selected } : i))
    );
  }

  function clearSelected() {
    setItems((prev) => prev.filter((i) => !i.selected));
  }

  const enriched = items
    .map((i) => ({ ...i, product: getProductById(i.productId) }))
    .filter((i) => i.product);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const selectedItems = enriched.filter((i) => i.selected);
  const selectedTotal = selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Gom theo shop — mô phỏng đúng cách Order cha tách thành nhiều SubOrder theo shop.
  const groupedByShop = enriched.reduce((groups, item) => {
    const key = item.product.shopId;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});

  const value = {
    items: enriched,
    totalCount,
    selectedItems,
    selectedTotal,
    groupedByShop,
    addItem,
    updateQuantity,
    removeItem,
    toggleSelected,
    clearSelected,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
