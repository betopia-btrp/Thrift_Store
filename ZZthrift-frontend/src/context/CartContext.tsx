"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/lib/data";

export interface CartItem {
  product: Product;
  addedAt: string;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  totalValue: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("thrifthub_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("thrifthub_cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.find((i) => i.product.id === product.id)) return prev;
      return [...prev, { product, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.product.id === productId),
    [items]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const count = items.length;
  const totalValue = items.reduce((sum, i) => sum + i.product.price, 0);

  return (
    <CartContext.Provider value={{ items, count, totalValue, addToCart, removeFromCart, isInCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
