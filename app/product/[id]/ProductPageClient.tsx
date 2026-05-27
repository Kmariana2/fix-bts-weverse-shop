"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

interface ProductPageClientProps {
  id: number;
}

export default function ProductPageClient({ id }: ProductPageClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");

  if (!product) {
    return (
      <main className="px-4 py-8">
        <p className="text-center text-gray-500">Product not found.</p>
      </main>
    );
  }

  const currentMainImage = mainImage || product.image;
  const thumbnails = [
    product.image,
    product.images?.back,
    product.images?.detail,
  ].filter(Boolean) as string[];

  const isOutOfStock = product.stock === 0;
  const hasMemberVariants = product.memberVariants && product.memberVariants.length > 0;
  const canAddToCart = !isOutOfStock && (!product.sizes?.length || !!selectedSize) && (!hasMemberVariants || !!selectedMember);

  return (
    <main className="pb-8">
      {/* Back button */}
      <div className="px-4 py-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Image Gallery */}
      <div className="px-4">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
          <img
            src={currentMainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/65 flex items-center justify-center z-10">
              <span className="text-black font-bold text-2xl tracking-wide">SOLD OUT</span>
            </div>
          )}
        </div>
        {thumbnails.length > 1 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {thumbnails.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                  currentMainImage === img ? "border-black" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 mt-4 space-y-3">
        <h1 className="text-xl font-bold text-black">{product.name}</h1>
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-gray-500 font-normal">USD</span>
          <span className="text-xl text-black font-bold">${product.price.toFixed(2)}</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {product.badges.includes("EXCLUSIVE") && (
            <span className="inline-flex items-center border border-[#00B8D4] text-[#00B8D4] text-[11px] font-medium rounded px-2 py-0.5 w-fit">
              EXCLUSIVE
            </span>
          )}
          {product.badges.includes("PRE-ORDER") && (
            <span className="inline-flex items-center border border-orange-500 text-orange-500 text-[11px] font-medium rounded px-2 py-0.5 w-fit">
              PRE-ORDER
            </span>
          )}
          {product.shipping && (
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[11px] rounded px-2 py-0.5 w-fit">
              {product.shipping}
            </span>
          )}
        </div>

        {/* Member Variants Gallery for Jersey */}
        {hasMemberVariants && (
          <div>
            <p className="text-sm font-medium mb-3">Select Member</p>
            <div className="grid grid-cols-4 gap-2">
              {product.memberVariants!.map((variant) => (
                <button
                  key={variant.name}
                  onClick={() => {
                    setSelectedMember(variant.name);
                    setMainImage(variant.image);
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                    selectedMember === variant.name
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={variant.image}
                    alt={`${variant.name} ${variant.number}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] font-medium py-1 text-center">
                    {variant.name} {variant.number}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        )}

        {/* Add to Cart */}
        <button
          onClick={() => {
            if (canAddToCart) {
              const size = product.sizes?.length ? selectedSize : "ONE SIZE";
              const memberSuffix = selectedMember ? ` - ${selectedMember}` : "";
              addItem(product.id, `${size}${memberSuffix}`, 1);
            }
          }}
          disabled={!canAddToCart}
          className={`w-full py-3 rounded-lg font-medium text-center transition mt-4 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : !canAddToCart
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isOutOfStock ? "SOLD OUT" : hasMemberVariants && !selectedMember ? "Select a Member" : "Add to Cart"}
        </button>
      </div>
    </main>
  );
}
