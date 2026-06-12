"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Plane, RotateCcw, Heart, Plane as PlaneIcon } from "lucide-react";
import { Product } from "@/types";
import { useWishlist } from "@/lib/wishlist-context";

interface ProductCardProps {
  product: Product;
}

// Haptic feedback utility
const triggerHaptic = (style: "light" | "medium" | "heavy" = "medium") => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    const patterns = { light: 10, medium: 25, heavy: 50 };
    navigator.vibrate(patterns[style]);
  }
};

// Flip sound effect (subtle click)
const playFlipSound = () => {
  if (typeof window !== "undefined") {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
};

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const hasBackImage = !!product.images?.back;

  // Handle flip with haptic and sound
  const handleFlip = () => {
    triggerHaptic("medium");
    playFlipSound();
    setIsFlipped(!isFlipped);
    setDragOffset(0);
  };

  // Touch/swipe handlers for swipe-to-flip
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasBackImage) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !isDragging || !hasBackImage) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    // Only track horizontal swipes
    if (deltaY < Math.abs(deltaX)) {
      e.preventDefault();
      // Limit drag offset for visual feedback
      const maxOffset = 60;
      const offset = Math.max(-maxOffset, Math.min(maxOffset, deltaX * 0.5));
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !hasBackImage) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    const swipeThreshold = 50;

    // Horizontal swipe detected
    if (Math.abs(deltaX) > swipeThreshold && deltaY < Math.abs(deltaX)) {
      e.preventDefault();
      handleFlip();
    }

    setTouchStart(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse drag for desktop swipe simulation
  const [mouseStart, setMouseStart] = useState<{ x: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasBackImage) return;
    setMouseStart({ x: e.clientX });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseStart || !isDragging || !hasBackImage) return;
    const deltaX = e.clientX - mouseStart.x;
    const maxOffset = 60;
    const offset = Math.max(-maxOffset, Math.min(maxOffset, deltaX * 0.5));
    setDragOffset(offset);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseStart || !hasBackImage) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const deltaX = e.clientX - mouseStart.x;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold) {
      handleFlip();
    }

    setMouseStart(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setMouseStart(null);
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  // Calculate dynamic rotation based on drag
  const getDragRotation = () => {
    if (!isDragging || dragOffset === 0) return 0;
    return (dragOffset / 60) * 15; // Max 15 degree tilt
  };



  return (
    <Link href={`/product/${product.id}/`} className="block group">
      {/* Card Container with 3D perspective */}
      <div 
        ref={cardRef}
        className="relative aspect-square [perspective:1200px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Flip Container */}
        <div
          className={`relative w-full h-full transition-transform ease-out [transform-style:preserve-3d] ${
            isDragging ? "duration-0" : "duration-500"
          }`}
          style={{
            transform: `rotateY(${isFlipped ? 180 + getDragRotation() : getDragRotation()}deg)`,
          }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-gray-100 rounded-xl overflow-hidden [backface-visibility:hidden] shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              draggable={false}
            />
            
            {/* Limited Edition Badge - Bottom Left */}
            {product.stock > 0 && product.stock <= 10 && (
              <div className="absolute bottom-3 left-3 z-20">
                <div className="backdrop-blur-xl bg-black/50 border border-amber-400/50 rounded-lg px-3 py-1.5 shadow-2xl">
                  <div className="text-amber-300 text-[10px] font-semibold tracking-widest uppercase">Limited Edition</div>
                </div>
              </div>
            )}

            {/* Flip indicator badge */}
            {hasBackImage && (
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Flip</span>
                </div>
              </div>
            )}

            {/* Wishlist button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
                triggerHaptic("light");
              }}
              className="absolute top-3 left-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-md"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* Back Face */}
          {hasBackImage && (
            <div className="absolute inset-0 bg-gray-100 rounded-xl overflow-hidden [backface-visibility:hidden] shadow-lg"
              style={{ transform: "rotateY(180deg)" }}>
              <img
                src={product.images.back}
                alt={`${product.name} - Back`}
                className="w-full h-full object-contain p-4"
                draggable={false}
              />
              {/* Back side luxury label */}
              <div className="absolute bottom-3 right-3 z-20">
                <div className="backdrop-blur-xl bg-black/40 border border-amber-300/40 rounded-lg px-3 py-2 shadow-2xl">
                  <div className="text-white text-[10px] font-light tracking-wider">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="text-amber-200/70 text-[8px] mt-1 tracking-wider">EXCLUSIVE</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Info Below Card */}
      <div className="mt-3 px-1">
        <h3 className="text-sm font-light tracking-wide text-gray-900 line-clamp-2 group-hover:text-black transition">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase font-semibold">
          ${product.price.toFixed(2)}
        </p>
        
        {/* Product Badges */}
        <div className="mt-1.5 flex flex-wrap gap-1">
          {/* EXCLUSIVE Badge */}
          <div className="border border-cyan-400 rounded-full px-1.5 py-0.5 bg-white">
            <span className="text-cyan-400 text-[8px] font-medium tracking-wider uppercase">Exclusive</span>
          </div>
          
          {/* PRE-ORDER Badge */}
          <div className="border border-blue-400 rounded-full px-1.5 py-0.5 bg-white">
            <span className="text-blue-400 text-[8px] font-medium tracking-wider uppercase">Pre-Order</span>
          </div>
          
          {/* Shipped from US Badge */}
          <div className="border border-gray-300 rounded-full px-1.5 py-0.5 bg-white flex items-center gap-0.5">
            <Plane className="w-2 h-2 text-gray-500" />
            <span className="text-gray-600 text-[8px] font-normal">Shipped from US</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
