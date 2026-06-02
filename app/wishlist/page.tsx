"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const { setIsOpen } = useCart();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-pink-300" />
        </div>
        <h1 className="text-xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 text-sm mb-6">
          Save items you love by tapping the heart icon on any product.
        </p>
        <Link
          href="/"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Browse Merch
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-8">
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="text-lg font-bold">
          Wishlist{" "}
          <span className="text-sm font-normal text-gray-500">
            ({wishlistProducts.length})
          </span>
        </h1>
        <button
          onClick={clearWishlist}
          className="text-sm text-red-500 hover:text-red-700 transition"
        >
          Clear all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:grid-cols-4">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
