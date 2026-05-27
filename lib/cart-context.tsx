"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "@/types";
import { products } from "./data";

interface CartContextType {
  items: CartItem[];
  addItem: (pid: number, size: string, qty: number) => void;
  removeItem: (pid: number, size: string) => void;
  updateQuantity: (pid: number, size: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem("cart");
      if (s) setItems(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, mounted]);

  const addItem = (pid: number, size: string, qty: number) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.productId === pid && i.size === size);
      if (ex)
        return prev.map((i) =>
          i.productId === pid && i.size === size
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      return [...prev, { productId: pid, size, quantity: qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (pid: number, size: string) =>
    setItems((prev) => prev.filter((i) => !(i.productId === pid && i.size === size)));

  const updateQuantity = (pid: number, size: string, qty: number) =>
    qty <= 0
      ? removeItem(pid, size)
      : setItems((prev) =>
          prev.map((i) =>
            i.productId === pid && i.size === size ? { ...i, quantity: qty } : i
          )
        );

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => {
    const p = products.find((x) => x.id === i.productId);
    return s + (p?.price || 0) * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
