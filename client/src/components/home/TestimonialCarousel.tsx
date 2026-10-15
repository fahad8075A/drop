"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  CheckCircle,
  Pause,
  Play,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  storeName: string;
  niche: string;
  monthlyRevenue: string;
  growth: string;
  rating: number;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "We transitioned from custom Shopify theme maintenance to DropPilot's multi-tenant engine. The automated supplier cost-sync and zero-touch fulfillment cut our daily support tickets by 82% while doubling our net margin.",
    author: "Elena Rostova",
    role: "Founder & Lead Merchant",
    storeName: "Lumix Home Atelier",
    niche: "Scandinavian Home Goods",
    monthlyRevenue: "$142,500/mo",
    growth: "+184% YoY",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
  },
  {
    id: "t-2",
    quote:
      "The speed of launching new niche storefronts without dev dependencies is unreal. We tested 4 electronics product lines in 3 weeks, found our hero SKU, and scaled to six figures with automated AliExpress supplier routing.",
    author: "Marcus Chen",
    role: "Co-Founder & Growth Lead",
    storeName: "Pulse Gadgets Labs",
    niche: "Consumer Audio & Wearables",
    monthlyRevenue: "$98,400/mo",
    growth: "+240% QoQ",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    id: "t-3",
    quote:
      "What blew us away was the visual design standard out of the box. DropPilot templates feel like bespoke luxury agency builds rather than cookie-cutter dropship sites. Our conversion rate jumped from 1.6% to 3.8%.",
    author: "Sophia Alvarez",
    role: "Creative Director",
    storeName: "Velvet & Thread",
    niche: "High-End Leather & Apparel",
    monthlyRevenue: "$114,800/mo",
    growth: "+95% MoM",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
  },
  {
    id: "t-4",
    quote:
      "The webhook-driven order fulfillment queue handled our Black Friday rush with zero downtime. Orders routed straight to suppliers, tracking numbers synced to customers, and our team spent zero hours manual copying.",
    author: "Tariq Mansoor",
    role: "Operations Director",
    storeName: "Titan Gear Direct",
    niche: "Outdoor EDC & Hardware",
    monthlyRevenue: "$210,000/mo",
    growth: "+310% YoY",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const total = TESTIMONIALS.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    setTouchStart(null);
  };

  const current = TESTIMONIALS[currentIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Merchant Success Reviews"
      className="outline-none relative rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-10"
    >
      {/* Top Bar with Merchant Metrics and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
              Verified Merchant Proof
            </span>
            <span className="text-sm font-black text-slate-900">
              Real Stores Scaling on DropPilot Multi-Tenant Cloud
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause review rotation" : "Play review rotation"}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors text-xs"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous review"
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next review"
            className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all active:scale-95 shadow-sm shadow-indigo-600/20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Review Slide */}
      <div className="py-8 min-h-[220px] flex items-center overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full"
          >
            {/* Left Column: Quote and Rating */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-slate-500 ml-2">5.0 Verified Review</span>
              </div>

              <blockquote className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
                “{current.quote}”
              </blockquote>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={current.avatar}
                  alt={current.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
                />
                <div>
                  <h5 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    {current.author}
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                  </h5>
                  <p className="text-xs text-slate-500">
                    {current.role} — <span className="font-semibold text-slate-700">{current.storeName}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Verified Merchant Metrics Card */}
            <div className="lg:col-span-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Store Niche
                  </span>
                  <span className="text-xs font-black text-slate-800">{current.niche}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Monthly GMV
                  </span>
                  <span className="text-sm font-black text-indigo-600">{current.monthlyRevenue}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Scale Velocity
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {current.growth}
                  </span>
                </div>

                <Link
                  href="/register"
                  className="mt-3 w-full py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Build A Store Like This</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Indicators */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-indigo-600" : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

        <div className="text-xs font-medium text-slate-500">
          Story <span className="font-bold text-slate-900">{currentIndex + 1}</span> of{" "}
          <span className="font-bold text-slate-900">{total}</span>
        </div>
      </div>
    </div>
  );
}
