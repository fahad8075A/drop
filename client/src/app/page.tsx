"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Store,
  Palette,
  Truck,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Layers,
  ShoppingBag,
  CreditCard,
  ChevronDown,
  Globe,
  Database,
  Lock,
  Zap,
  Users,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import {
  RevealFromLeft,
  RevealFromRight,
  RevealUp,
  ScaleIn,
  TwoSidedSection,
  TwoSidedColumn,
  StaggerGrid,
  StaggerCard,
  AnimatedCounter,
} from "@/components/animations/MotionWrappers";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { IntegrationsCarousel } from "@/components/home/IntegrationsCarousel";
import { Navbar } from "@/components/navigation/Navbar";

export default function MarketingPage() {
  const [activeTemplate, setActiveTemplate] = useState<"minimal" | "fashion" | "gadgets">("minimal");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const templatePreviews = {
    minimal: {
      name: "Minimal Modern",
      tag: "Artisanal, Home & Living",
      slug: "lumix",
      desc: "Clean aesthetic, generous whitespace, understated elegance. Optimized for design-conscious buyers.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80",
    },
    fashion: {
      name: "Fashion & Lifestyle",
      tag: "Apparel, Lookbooks, Streetwear",
      slug: "velvet",
      desc: "Bold typography, editorial photography grids, full-width seasonal hero banners, and lookbook modules.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=80",
    },
    gadgets: {
      name: "Electronics & Gadgets",
      tag: "Smart Tech, Audio, Wearables",
      slug: "pulsegadgets",
      desc: "High-contrast dark mode, technical specification badges, feature comparisons, and high-velocity checkout.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80",
    },
  };

  const faqs = [
    {
      q: "How does DropPilot prevent supplier out-of-stock and price spikes?",
      a: "Our automated background workers poll supplier endpoints (AliExpress, CJ Dropshipping, Zendrop) every 15 minutes. If a supplier raises their price, your retail prices adjust according to your preset target margin rules. If stock hits zero, your storefront automatically disables checkout for that variant.",
    },
    {
      q: "Can I bring my own custom domain to my storefront?",
      a: "Yes. Every store automatically gets a fast SSL-enabled subdomain (e.g. droppilot.com/store/yourbrand), and Pro & Enterprise plans include custom apex and subdomain mapping (e.g. store.yourbrand.com) with automated Let's Encrypt certificates.",
    },
    {
      q: "How does tenant isolation work across multi-tenant stores?",
      a: "DropPilot uses strict tenant schema identifiers on every PostgreSQL query, enforced at the application middleware and database foreign key levels. A store owner cannot access, query, or mutate another store's orders, customers, or supplier credentials.",
    },
    {
      q: "What payment gateways are supported for customer checkouts?",
      a: "We natively support Stripe (135+ currencies, Apple Pay, Google Pay) and Razorpay (cards, NetBanking, and UPI QR codes for Indian merchants). Customers check out directly on your store with cryptographic webhook signature verification.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden">
      {/* Professional Sticky Enterprise Navigation Bar */}
      <Navbar />

      {/* SECTION 1: HERO (Two-Sided Animation: Left Content from Left, Right UI Preview from Right) */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <TwoSidedSection
            leftContent={
              <div className="space-y-5 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span>⚡ Autonomous AI Dropshipping Platform</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Build, Launch & Scale{" "}
                  <span className="text-indigo-600">Autonomous Ecommerce</span> Brands
                </h1>

                <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-normal">
                  Create high-converting online stores in seconds without writing code. Sync verified B2B suppliers, automate real-time profit margins, and fulfill orders hands-free with isolated tenant data integrity.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 sm:px-8 py-3.5 rounded-xl shadow-md shadow-indigo-600/25 transition-all text-center"
                  >
                    <span>Start 14-Day Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/store/lumix"
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl transition-all shadow-2xs text-center"
                  >
                    <Store className="w-4 h-4 text-indigo-600" />
                    <span>View Live Demo Store</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>

                {/* Quick Evaluation Banner */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-0.5">
                      Instant Sandbox Credentials
                    </p>
                    <p className="text-xs text-slate-600">
                      Owner: <code className="text-indigo-700 font-bold">alex@droppilot.com</code> (Password:{" "}
                      <code className="text-slate-800 font-bold">password123</code>)
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="whitespace-nowrap px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs self-stretch sm:self-auto text-center"
                  >
                    Quick Log In →
                  </Link>
                </div>
              </div>
            }
            rightContent={
              <div className="relative">
                {/* Decorative border frame with live preview */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xl space-y-4">
                  {/* Mock browser header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-400" />
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">droppilot.com/dashboard/overview</span>
                      <span className="text-[11px] font-mono text-slate-400 ml-2 sm:hidden">droppilot.com</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sync
                    </span>
                  </div>

                  {/* Mock Dashboard Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                      <p className="text-[11px] font-bold text-indigo-900 uppercase">Today's Revenue</p>
                      <p className="text-2xl font-black text-indigo-700 mt-1">$4,892.40</p>
                      <p className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" /> +28.4% vs yesterday
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">Auto-Fulfill Queue</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">38 Orders</p>
                      <p className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" /> 100% routed to suppliers
                      </p>
                    </div>
                  </div>

                  {/* Real-Time Supplier Order Activity Table Mock */}
                  <div className="rounded-2xl border border-slate-100 overflow-x-auto text-xs">
                    <div className="min-w-[280px]">
                      <div className="bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                        <span>Recent Order</span>
                        <span>Supplier Status</span>
                        <span>Net Profit</span>
                      </div>
                      <div className="divide-y divide-slate-100 bg-white">
                        <div className="px-4 py-3 flex items-center justify-between gap-2">
                          <div>
                            <p className="font-bold text-slate-900">Walnut Desk Lamp</p>
                            <p className="text-[10px] text-slate-400">Order #DP-9481 · Lumix</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                            Shipped (CJ)
                          </span>
                          <span className="font-black text-emerald-600 shrink-0">+$42.50</span>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between gap-2">
                          <div>
                            <p className="font-bold text-slate-900">ANC Headphones</p>
                            <p className="text-[10px] text-slate-400">Order #DP-9480 · Pulse</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            Tracking Gen
                          </span>
                          <span className="font-black text-emerald-600 shrink-0">+$91.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* SECTION 2: METRICS COUNTERS STRIP (Centered upward reveal with AnimatedCounter) */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StaggerCard className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
              <p className="text-2xl sm:text-4xl font-black text-slate-900">
                <AnimatedCounter target={12450} suffix="+" />
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                Active Storefronts
              </p>
            </StaggerCard>

            <StaggerCard className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
              <p className="text-2xl sm:text-4xl font-black text-indigo-600">
                <AnimatedCounter target={48} prefix="$" suffix="M+" />
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                Gross Merchandise Value
              </p>
            </StaggerCard>

            <StaggerCard className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
              <p className="text-2xl sm:text-4xl font-black text-slate-900">
                <AnimatedCounter target={180} suffix="+" />
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                Verified B2B Suppliers
              </p>
            </StaggerCard>

            <StaggerCard className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
              <p className="text-2xl sm:text-4xl font-black text-emerald-600">
                <AnimatedCounter target={68} suffix="%" />
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                Average Merchant Margin
              </p>
            </StaggerCard>
          </StaggerGrid>
        </div>
      </section>

      {/* SECTION 3: WORKFLOW / HOW IT WORKS (Alternating Direction: Section 3a is reversed) */}
      <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <RevealUp className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From Zero to Scale in 3 Automated Steps
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Forget manual copy-pasting, CSV imports, and broken supplier spreadsheets. DropPilot orchestrates everything in real-time.
            </p>
          </RevealUp>

          {/* Workflow Step 1: Reversed Two-Sided Reveal (Left from Right, Right from Left) */}
          <TwoSidedSection
            reversed={true}
            leftContent={
              <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Connect Verified Suppliers & Set Smart Margins
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Browse thousands of winning products from AliExpress, CJ Dropshipping, and Zendrop. Click to import with wholesale costs, high-resolution product imagery, and automated target profit calculations.
                </p>
                <div className="space-y-2 pt-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant currency conversion & shipping cost breakdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dynamic price guard prevents negative margin sales</span>
                  </div>
                </div>
              </div>
            }
            rightContent={
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Supplier Integration Catalog</span>
                  <span className="text-[10px] font-bold text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50">
                    Live API Connected
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">AliExpress Global API</p>
                      <p className="text-[10px] text-slate-500">12,000+ Verified Suppliers · Auto-Sync</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Connected</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">CJ Dropshipping Direct</p>
                      <p className="text-[10px] text-slate-500">Fast 5-Day US/EU Warehouse Dispatch</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Connected</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Workflow Step 2: Normal Two-Sided Reveal (Left from Left, Right from Right) */}
          <TwoSidedSection
            reversed={false}
            leftContent={
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Visual Theme Customizer</span>
                  <span className="text-[10px] font-bold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50">
                    Real-Time Preview
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Primary Brand Color</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 border-2 border-white shadow-2xs" />
                      <span className="font-mono text-slate-600 text-[11px]">#4f46e5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Typography Pairing</span>
                    <span className="text-[11px] font-bold text-indigo-700">Plus Jakarta + Inter</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Checkout Flow</span>
                    <span className="text-[11px] font-bold text-slate-600">Single-Step Express</span>
                  </div>
                </div>
              </div>
            }
            rightContent={
              <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Customize & Publish Your High-Converting Storefront
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Choose from our agency-grade responsive templates. Fine-tune colors, hero banners, product grids, trust badges, and promotional announcement bars with instant preview.
                </p>
                <div className="space-y-2 pt-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero code required, instantly published to CDN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Optimized for 95+ Google Lighthouse mobile performance</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Workflow Step 3: Reversed Two-Sided Reveal */}
          <TwoSidedSection
            reversed={true}
            leftContent={
              <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                  3
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Hands-Free Automated Order Fulfillment Queue
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  When a customer purchases on your store, our asynchronous fulfillment engine places the order with the supplier, fetches tracking credentials, and notifies your customer via email.
                </p>
                <div className="space-y-2 pt-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-time webhook synchronization for tracking updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Stripe & Razorpay instant merchant payouts</span>
                  </div>
                </div>
              </div>
            }
            rightContent={
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Fulfillment Pipeline Telemetry</span>
                  <span className="text-[10px] font-bold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50">
                    Auto-Queue Active
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-900">Carrier Dispatch</p>
                        <p className="text-[10px] text-slate-500">Tracking: BLUEDART-99218291</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">Delivered in 4d</span>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* SECTION 4: WINNING PRODUCTS INTERACTIVE CAROUSEL */}
      <section id="catalog" className="py-12 sm:py-20 px-4 sm:px-6 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <RevealUp className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Interactive Product Showcase
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Test-Driven High-Margin Catalog
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Browse proven dropshipping SKUs with pre-calculated margins and instant live demo previews.
            </p>
          </RevealUp>

          <RevealUp delay={0.15}>
            <ProductCarousel />
          </RevealUp>
        </div>
      </section>

      {/* SECTION 5: CURATED STOREFRONT TEMPLATES (Normal Direction Two-Sided Reveal) */}
      <section id="templates" className="py-12 sm:py-20 px-4 sm:px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <RevealUp className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Curated Storefronts
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              3 Original Responsive Templates
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Each template is crafted with responsive layouts, accessible navigation, fast server rendering, and instant visual customizer integration.
            </p>
          </RevealUp>

          {/* Template Switcher Tabs */}
          <div className="flex justify-start sm:justify-center overflow-x-auto pb-2">
            <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex gap-1.5 sm:gap-2 border border-slate-200 shrink-0">
              {(["minimal", "fashion", "gadgets"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTemplate(key)}
                  className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTemplate === key
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {templatePreviews[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Template Showcase Card - Normal Two-Sided Reveal */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-slate-200/80 bg-slate-50 shadow-sm">
            <TwoSidedSection
              reversed={false}
              leftContent={
                <div className="space-y-4 sm:space-y-5">
                  <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-white text-indigo-700 border border-slate-200 shadow-2xs">
                    {templatePreviews[activeTemplate].tag}
                  </span>
                  <h4 className="text-xl sm:text-3xl font-black text-slate-900">
                    {templatePreviews[activeTemplate].name}
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                    {templatePreviews[activeTemplate].desc}
                  </p>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Dynamic announcement bar & brand typography</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Variant selectors, stock badges & compare-at pricing</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Server-validated shopping cart with instant checkout</span>
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-3 flex items-center gap-3">
                    <Link
                      href={`/store/${templatePreviews[activeTemplate].slug}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm"
                    >
                      <span>Launch Live Storefront</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              }
              rightContent={
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <img
                    src={templatePreviews[activeTemplate].image}
                    alt={templatePreviews[activeTemplate].name}
                    className="w-full h-[260px] sm:h-[360px] object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-800 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-mono text-[10px] sm:text-[11px]">
                      Slug: <strong>/{templatePreviews[activeTemplate].slug}</strong>
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Storefront
                    </span>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* SECTION 6: INTEGRATIONS & GATEWAYS CAROUSEL */}
      <section id="integrations" className="py-12 sm:py-20 px-4 sm:px-6 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <RevealUp className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Native Integrations
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Suppliers, Gateways & Global Couriers
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Connect your essential commerce tooling with pre-configured API adapters and automated webhook listeners.
            </p>
          </RevealUp>

          <RevealUp delay={0.15}>
            <IntegrationsCarousel />
          </RevealUp>
        </div>
      </section>

      {/* SECTION 7: MERCHANT TESTIMONIAL CAROUSEL */}
      <section id="reviews" className="py-12 sm:py-20 px-4 sm:px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <RevealUp className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Merchant Testimonials
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Loved by Independent Brand Operators
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Discover how modern dropshipping entrepreneurs replace complex multi-tool stacks with DropPilot.
            </p>
          </RevealUp>

          <RevealUp delay={0.15}>
            <TestimonialCarousel />
          </RevealUp>
        </div>
      </section>

      {/* SECTION 8: PRICING PLANS (Staggered Card Grid Reveal) */}
      <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          <RevealUp className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Transparent Plans
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Predictable SaaS Subscriptions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              All plans include high-speed CDN hosting, automated supplier price updates, and zero transaction fee overrides.
            </p>
          </RevealUp>

          <StaggerGrid className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Starter */}
            <StaggerCard className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  Starter
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-4 mb-1">Starter Launch</h4>
                <p className="text-xs text-slate-500 mb-6">For new merchants launching their first store.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">$29</span>
                  <span className="text-slate-500 text-xs font-medium">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 1 Active Storefront
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Up to 50 Products
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Standard Templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Supplier Catalog Sync
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full text-center py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors"
              >
                Start 14-Day Trial
              </Link>
            </StaggerCard>

            {/* Pro */}
            <StaggerCard className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-white border-2 border-indigo-600 shadow-md relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Growth
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-4 mb-1">Scale & Growth</h4>
                <p className="text-xs text-slate-500 mb-6">
                  For scaling merchants managing multi-niche stores.
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">$79</span>
                  <span className="text-slate-500 text-xs font-medium">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 5 Active Storefronts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Up to 500 Products
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Custom Domains & SSL
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Automated Fulfillment Queue
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Profit & Margin Analytics
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-sm shadow-indigo-600/25 transition-all"
              >
                Launch With Pro
              </Link>
            </StaggerCard>

            {/* Enterprise */}
            <StaggerCard className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  Enterprise
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-4 mb-1">High Volume</h4>
                <p className="text-xs text-slate-500 mb-6">For high volume ecommerce brand houses.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">$199</span>
                  <span className="text-slate-500 text-xs font-medium">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Storefronts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Products
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 25 Collaborator Seats
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Priority Fulfillment SLAs
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full text-center py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors"
              >
                Contact Enterprise
              </Link>
            </StaggerCard>
          </StaggerGrid>
        </div>
      </section>

      {/* SECTION 9: FAQ & SECURITY (Reversed Two-Sided Reveal) */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <TwoSidedSection
            reversed={true}
            leftContent={
              <div className="space-y-5 sm:space-y-6">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
                  Reliability & Security
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Everything you need to know about DropPilot's multi-tenant isolation, automated supplier order routing, and subscription terms.
                </p>

                <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Enterprise Security Standards</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    SOC2 compliant architecture, encrypted supplier credentials via AES-256-GCM, automated daily database snapshots, and 99.98% uptime SLA.
                  </p>
                </div>
              </div>
            }
            rightContent={
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                            isOpen ? "rotate-180 text-indigo-600" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            }
          />
        </div>
      </section>

      {/* SECTION 10: CALL TO ACTION BANNER (Normal Two-Sided Reveal) */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl bg-indigo-600 p-6 sm:p-12 text-white shadow-xl">
            <TwoSidedSection
              reversed={false}
              leftContent={
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white inline-block">
                    Get Started In Minutes
                  </span>
                  <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    Launch Your Automated Dropshipping Business Today
                  </h2>
                  <p className="text-indigo-100 text-xs sm:text-base leading-relaxed max-w-xl">
                    Join over 12,000+ brand owners leveraging DropPilot's automated supplier sync, fast responsive storefronts, and multi-tenant isolation.
                  </p>
                </div>
              }
              rightContent={
                <div className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white text-slate-900 space-y-4 shadow-lg">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Create Your Account & Store
                  </h3>
                  <p className="text-xs text-slate-500">
                    No credit card required for 14-day full access evaluation.
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <Link
                      href="/register"
                      className="w-full text-center py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Start Free 14-Day Trial →
                    </Link>
                    <Link
                      href="/login"
                      className="w-full text-center py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                    >
                      Sign In to Existing Account
                    </Link>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center font-medium">
                    Instant access to Lumix, Velvet, and Pulse demo stores.
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* SECTION 11: FOOTER (Clean Two-Sided Entrance) */}
      <footer className="border-t border-slate-200 py-8 sm:py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <RevealFromLeft>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                DP
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900">DropPilot Cloud SaaS</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  © 2026 DropPilot Inc. All rights reserved. Multi-tenant dropshipping platform.
                </p>
              </div>
            </div>
          </RevealFromLeft>

          <RevealFromRight>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 text-xs font-bold text-slate-500">
              <Link href="/store/lumix" className="hover:text-indigo-600 transition-colors">
                Lumix Store
              </Link>
              <Link href="/store/pulsegadgets" className="hover:text-indigo-600 transition-colors">
                Pulse Store
              </Link>
              <Link href="/store/velvet" className="hover:text-indigo-600 transition-colors">
                Velvet Store
              </Link>
              <Link href="/login" className="hover:text-indigo-600 transition-colors">
                Merchant Sign In
              </Link>
              <Link href="/admin" className="hover:text-indigo-600 transition-colors">
                Platform Admin
              </Link>
            </div>
          </RevealFromRight>
        </div>
      </footer>
    </div>
  );
}
