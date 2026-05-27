"use client";

import { X, Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/data";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col transform transition-transform translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[#E5E5E5]">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center mt-8">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity - 1)
                          }
                          className="w-6 h-6 flex items-center justify-center border rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity + 1)
                          }
                          className="w-6 h-6 flex items-center justify-center border rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <span className="text-sm font-medium">
                        USD ${(product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E5E5] p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-lg font-bold">USD ${totalPrice.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout/"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-black text-white py-3 rounded-lg text-center font-medium hover:bg-gray-800 transition"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
