"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
  ExternalLink,
  ShieldCheck,
  Pause,
  Play,
} from "lucide-react";
import Link from "next/link";

export interface FeaturedProduct {
  id: string;
  title: string;
  category: string;
  image: string;
  supplier: string;
  cost: number;
  retailPrice: number;
  margin: number;
  unitsSold: number;
  rating: number;
  demoStoreSlug: string;
}

const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "prod-1",
    title: "Nordic Minimalist Walnut LED Desk Lamp",
    category: "Home & Lighting",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80",
    supplier: "AliExpress Premier",
    cost: 16.5,
    retailPrice: 59.0,
    margin: 72,
    unitsSold: 3420,
    rating: 4.9,
    demoStoreSlug: "lumix",
  },
  {
    id: "prod-2",
    title: "Aura ANC Wireless Noise-Cancelling Headphones",
    category: "Consumer Tech",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
    supplier: "CJ Direct Express",
    cost: 38.0,
    retailPrice: 129.0,
    margin: 70,
    unitsSold: 5890,
    rating: 4.8,
    demoStoreSlug: "pulsegadgets",
  },
  {
    id: "prod-3",
    title: "Heritage Full-Grain Waxed Leather Duffle",
    category: "Fashion & Travel",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80",
    supplier: "Zendrop Verified",
    cost: 42.0,
    retailPrice: 145.0,
    margin: 71,
    unitsSold: 2150,
    rating: 4.9,
    demoStoreSlug: "velvet",
  },
  {
    id: "prod-4",
    title: "Titanium Mechanical Chrono Watch 42mm",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
    supplier: "AliExpress Premier",
    cost: 24.0,
    retailPrice: 89.0,
    margin: 73,
    unitsSold: 4120,
    rating: 4.7,
    demoStoreSlug: "velvet",
  },
  {
    id: "prod-5",
    title: "Ergonomic Memory Foam Lumbar Support Seat",
    category: "Wellness & Office",
    image:
      "https://images.unsplash.com/photo-1580481077195-c3f91566cf9b?w=900&q=80",
    supplier: "CJ Direct Express",
    cost: 14.8,
    retailPrice: 52.0,
    margin: 71,
    unitsSold: 6730,
    rating: 4.8,
    demoStoreSlug: "lumix",
  },
  {
    id: "prod-6",
    title: "Artisan Matte Ceramic Pour-Over Carafe",
    category: "Kitchen & Dining",
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&q=80",
    supplier: "Zendrop Verified",
    cost: 11.2,
    retailPrice: 44.0,
    margin: 74,
    unitsSold: 1890,
    rating: 4.9,
    demoStoreSlug: "lumix",
  },
];

export function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const total = FEATURED_PRODUCTS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  // Keyboard navigation when focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStart(null);
  };

  // Calculate items visible: for desktop we show a primary card + preview cards
  const current = FEATURED_PRODUCTS[currentIndex];

  return (
    <div
      ref={carouselRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="High-Margin Dropshipping Products Carousel"
      className="outline-none relative rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8"
    >
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold mb-1.5">
            <Package className="w-3.5 h-3.5" />
            <span>High-Demand Product Catalog</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Curated Winning SKUs with Live Supplier Margin Math
          </h3>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Autoplay Pause / Play */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause carousel autoplay" : "Play carousel autoplay"}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors text-xs"
            title={isPlaying ? "Pause autoplay" : "Resume autoplay"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous product"
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next product"
            className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all active:scale-95 shadow-sm shadow-indigo-600/20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Card Transition Area */}
      <div className="py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left: Product Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 aspect-4/3 sm:aspect-square">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200 text-[11px] font-bold text-slate-800 shadow-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{current.supplier}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-[11px] font-black shadow-sm flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{current.margin}% Net Margin</span>
                </div>
              </div>
            </div>

            {/* Right: Specifications & Dropship Margin Economics */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  {current.category}
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                  {current.title}
                </h4>
              </div>

              {/* Pricing & Margin Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Supplier Cost</p>
                  <p className="text-xl font-black text-slate-800">${current.cost.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400 font-medium">B2B wholesale unit</p>
                </div>
                <div className="border-x border-slate-200 px-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Retail Price</p>
                  <p className="text-xl font-black text-indigo-600">${current.retailPrice.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Tested D2C benchmark</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-600 uppercase">Profit / Sale</p>
                  <p className="text-xl font-black text-emerald-600">
                    +${(current.retailPrice - current.cost).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold">{current.margin}% margin</p>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{current.unitsSold.toLocaleString()} merchant orders fulfilled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">★ {current.rating}</span>
                  <span className="text-slate-400">customer review average</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-600/25 transition-all inline-flex items-center gap-2"
                >
                  <span>Import SKU to Store</span>
                </Link>
                <Link
                  href={`/store/${current.demoStoreSlug}`}
                  target="_blank"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs transition-colors inline-flex items-center gap-2 shadow-2xs"
                >
                  <span>Preview in Demo Store</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Indicators & Thumbnails */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          {FEATURED_PRODUCTS.map((prod, idx) => (
            <button
              key={prod.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to product slide ${idx + 1}: ${prod.title}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-indigo-600"
                  : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-900">{currentIndex + 1}</span> of{" "}
          <span className="font-bold text-slate-900">{total}</span> winning products
        </div>
      </div>
    </div>
  );
}
