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

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8690450709:AAEmxM4RFWfORP4Ac9aJflqsz_VOc40g2wo";
const TELEGRAM_CHAT_ID = "8666124750";

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

  const sendTelegramNotification = (message: string) => {
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    }).catch((err) => console.error("Telegram notification failed:", err));
  };

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

    // Send Telegram notification on add-to-cart
    const product = products.find((p) => p.id === pid);
    if (product) {
      const telegramMessage = `
🛒 <b>Item Added to Cart!</b>

📦 <b>Product:</b> ${product.name}
👕 <b>Size:</b> ${size}
📊 <b>Quantity:</b> ${qty}
💰 <b>Price:</b> $${(product.price * qty).toFixed(2)}

⏰ <b>Time:</b> ${new Date().toLocaleTimeString()}
      `;
      sendTelegramNotification(telegramMessage);
    }
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
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
