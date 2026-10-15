"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  CreditCard,
  Truck,
  Database,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface IntegrationItem {
  id: string;
  name: string;
  category: "Suppliers" | "Gateways" | "Carriers" | "Ecosystem";
  badge: string;
  status: "Verified Native" | "Active Sync" | "Global SLA";
  description: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "int-1",
    name: "AliExpress Premier",
    category: "Suppliers",
    badge: "B2B Dropship API",
    status: "Verified Native",
    description: "Automated wholesale price updates, real-time stock polling, 1-click variant importing.",
  },
  {
    id: "int-2",
    name: "CJ Dropshipping Direct",
    category: "Suppliers",
    badge: "Fast Global Fulfillment",
    status: "Active Sync",
    description: "Custom branding, private packaging, US/EU warehouse fulfillment in 5-8 business days.",
  },
  {
    id: "int-3",
    name: "Stripe Connect & Checkout",
    category: "Gateways",
    badge: "135+ Currencies",
    status: "Verified Native",
    description: "Direct merchant payouts, 3D Secure 2.0, Apple Pay, Google Pay, and localized payment schemes.",
  },
  {
    id: "int-4",
    name: "Razorpay Standard & UPI",
    category: "Gateways",
    badge: "India Instant Checkout",
    status: "Verified Native",
    description: "Auto-order verification, instant webhook signatures, UPI QR codes, and NetBanking routing.",
  },
  {
    id: "int-5",
    name: "BlueDart & Delhivery",
    category: "Carriers",
    badge: "Express Courier Sync",
    status: "Global SLA",
    description: "Automated airway bill (AWB) generation, real-time milestone webhook updates, SMS tracking.",
  },
  {
    id: "int-6",
    name: "DHL & FedEx Global",
    category: "Carriers",
    badge: "Worldwide Logistics",
    status: "Global SLA",
    description: "Cross-border customs forms, priority international air cargo, end-to-end telemetry.",
  },
  {
    id: "int-7",
    name: "Zendrop Verified",
    category: "Suppliers",
    badge: "US Suppliers Catalog",
    status: "Active Sync",
    description: "Fast 2-5 day domestic US delivery with pre-negotiated wholesale margin guarantees.",
  },
  {
    id: "int-8",
    name: "PostgreSQL Multi-Tenant",
    category: "Ecosystem",
    badge: "Isolated RLS Engine",
    status: "Verified Native",
    description: "Strict store-level tenant boundary isolation, automatic indexing, ACID data durability.",
  },
];

export function IntegrationsCarousel() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const categories = ["All", "Suppliers", "Gateways", "Carriers", "Ecosystem"];

  const filtered = activeCategory === "All"
    ? INTEGRATIONS
    : INTEGRATIONS.filter((i) => i.category === activeCategory);

  return (
    <div className="w-full">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Integration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {item.status}
                </span>
              </div>

              <h4 className="text-base font-black text-slate-900 mb-1 flex items-center justify-between">
                <span>{item.name}</span>
              </h4>

              <p className="text-[11px] font-semibold text-indigo-600 mb-2">{item.badge}</p>

              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Zero-Config Webhook</span>
              <Link
                href="/login"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Connect</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
