import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = 'ct_cart';

function readStoredCart(): CartItem[] {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart) as CartItem[];
    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter((item) => item.product?.id && item.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    const safeQuantity = Math.max(1, Math.floor(quantity));

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { product, quantity: item.quantity + safeQuantity }
            : item
        );
      }

      return [...currentItems, { product, quantity: safeQuantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const nextQuantity = Math.floor(quantity);
    if (nextQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const getItemQuantity = (productId: number) => {
    return items.find((item) => item.product.id === productId)?.quantity || 0;
  };

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return {
      items,
      itemCount,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}
