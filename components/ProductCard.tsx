"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Plane, RotateCcw } from "lucide-react";
import { Product } from "@/types";

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
    if (!hasBackImage || product.stock === 0) return;
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
    if (!hasBackImage || product.stock === 0) return;
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
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              draggable={false}
            />
            {/* Sold Out Overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
                <span className="text-black font-bold text-lg tracking-widest">SOLD OUT</span>
              </div>
            )}
            {/* Flip indicator badge */}
            {hasBackImage && product.stock > 0 && (
              <div className="absolute top-2 right-2 z-20">
                <div className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <RotateCcw className="w-3 h-3" />
                  <span>SWIPE</span>
                </div>
              </div>
            )}
            {/* Swipe hint animation overlay */}
            {hasBackImage && product.stock > 0 && !isFlipped && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                    <span className="animate-bounce-x">{"<"}</span>
                    <span>Swipe to flip</span>
                    <span className="animate-bounce-x-reverse">{">"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Back Face */}
          {hasBackImage && (
            <div className="absolute inset-0 bg-gray-100 rounded-xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-lg">
              <img
                src={product.images!.back!}
                alt={`${product.name} - Back`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                draggable={false}
              />
              {/* Back indicator */}
              <div className="absolute top-2 left-2 z-20">
                <div className="bg-white/90 backdrop-blur-md text-black text-[10px] font-medium px-2 py-1 rounded-full shadow-sm">
                  BACK VIEW
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Flip Button */}
        {hasBackImage && product.stock > 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFlip();
            }}
            className="absolute bottom-3 right-3 z-30 bg-gradient-to-r from-[#00B8D4] to-[#00838F] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg shadow-[#00B8D4]/30 hover:shadow-xl hover:shadow-[#00B8D4]/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 select-none"
          >
            <RotateCcw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? "rotate-180" : ""}`} />
            <span>{isFlipped ? "SHOW FRONT" : "TAP TO FLIP"}</span>
          </button>
        )}

        {/* Drag indicator glow */}
        {isDragging && hasBackImage && (
          <div 
            className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-150"
            style={{
              boxShadow: `0 0 20px 5px rgba(0, 184, 212, ${Math.abs(dragOffset) / 60 * 0.5})`,
            }}
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 mt-3">
        <p className="text-sm text-black font-medium line-clamp-2 leading-snug group-hover:text-[#00838F] transition-colors">
          {product.name}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-gray-400 font-normal">USD</span>
          <span className="text-base text-black font-bold">${product.price.toFixed(2)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {product.badges.includes("EXCLUSIVE") && (
            <span className="inline-flex items-center border border-[#00B8D4] text-[#00B8D4] text-[10px] font-semibold rounded-full px-2.5 py-0.5 tracking-wide">
              EXCLUSIVE
            </span>
          )}
          {product.badges.includes("PRE-ORDER") && (
            <span className="inline-flex items-center bg-purple-100 text-purple-700 text-[10px] font-semibold rounded-full px-2.5 py-0.5 tracking-wide">
              PRE-ORDER
            </span>
          )}
          {product.shipping && (
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] rounded-full px-2.5 py-0.5">
              <Plane className="w-3 h-3" />
              {product.shipping}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
