"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Lang } from "../i18n/config";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  stock: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
  lang: Lang;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Lang;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    if (!Number.isInteger(item.qty) || item.qty <= 0 || item.stock <= 0) return;
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                stock: item.stock,
                qty: Math.min(p.qty + item.qty, item.stock),
              }
            : p,
        );
      }
      return [...prev, { ...item, qty: Math.min(item.qty, item.stock) }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clear, total, lang }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
