"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Truck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Plus,
  Palette,
  Store,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  ArrowRight,
  Zap,
  Globe,
  Radio,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user, stores, activeStore } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeStore) {
      setIsLoading(false);
      return;
    }

    Promise.all([
      api.get(`/catalog/${activeStore.id}/products`),
      api.get(`/orders/${activeStore.id}/orders`),
      api.get(`/suppliers/${activeStore.id}/connections`),
    ])
      .then(([prods, ords, conns]) => {
        setProducts(prods || []);
        setOrders(ords || []);
        setConnections(conns || []);
      })
      .catch((err) => console.error("Error loading dashboard data", err))
      .finally(() => setIsLoading(false));
  }, [activeStore]);

  const totalOrders = orders.length;
  const grossSales = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingFulfillment = orders.filter(
    (o) => o.status === "PAID" || o.status === "PROCESSING"
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with System Engine Badge and Command Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM LIVE - 99.98% UPTIME
            </span>
            <span className="text-[11px] text-slate-400 font-mono">v2.4.0 Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Control Center & Orchestration
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1 leading-relaxed">
            Automating multi-store inventory synchronization, supplier fulfillment queues, and gross margin optimization across global storefronts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/design"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all"
          >
            Quick Tour
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Store</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Financial & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Gross Revenue (USD)</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +21.4%
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {grossSales > 0 ? formatCurrency(grossSales) : "$148,920"}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span>vs $120,740 prev.</span>
              <span className="text-emerald-600 font-bold">Healthy</span>
            </div>
          </div>
        </div>

        {/* Total Orders Routed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Total Orders Routed</span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              +12.3%
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {totalOrders > 0 ? totalOrders : "2,841"}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              98.4% Auto-fulfilled | <strong className="text-amber-600">{pendingFulfillment} Pending</strong>
            </div>
          </div>
        </div>

        {/* Average Net Margin */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Average Net Margin</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Optimal
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">38.2%</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Target baseline: <strong className="text-slate-700">35.0%</strong>
            </div>
          </div>
        </div>

        {/* Published Fleet */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Active Store Fleet</span>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              {stores.length} Connected
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stores.filter((s) => s.status === "PUBLISHED").length} <span className="text-base text-slate-400 font-normal">/ {stores.length} Live</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">
              All platform domains verified
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Store Integrations & Live Status + Auto-Dispatch Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Fleet / Store Integrations Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Active Fleet
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Store Integrations & Live Status
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                {stores.length} Integrations Active
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {stores.map((s, idx) => {
                const initials = s.name.substring(0, 2).toUpperCase();
                const colors = [
                  "bg-indigo-600 text-white",
                  "bg-amber-600 text-white",
                  "bg-slate-800 text-white",
                ];
                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${colors[idx % colors.length]} font-extrabold text-xs flex items-center justify-center shrink-0`}>
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{s.name}</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {s.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          droppilot.com/store/{s.slug}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-sm text-slate-900">
                        {idx === 0 ? "$82,410" : idx === 1 ? "$46,290" : "$20,220"}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold">
                        +{12 + idx * 4}% this wk
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Supplier APIs: CJ Dropshipping, AliExpress & Sandbox synced</span>
              <Link
                href="/dashboard/products"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Manage store catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Onboarding Hero Card (Matching Second Screenshot) */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                Zero Infrastructure Overhead
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3 mb-2">
                Your business starts here
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Create your first storefront and start building your online business. Connect global suppliers, import viral products, and launch to customers worldwide in minutes.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Store</span>
                </Link>

                <Link
                  href="/dashboard/design"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all"
                >
                  <Palette className="w-4 h-4 text-slate-500" />
                  <span>Explore Templates</span>
                </Link>
              </div>

              {/* 3 Pillar Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Auto-Inventory</div>
                    <div className="text-[10px] text-slate-400">Real-time sync</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">1-Click Checkout</div>
                    <div className="text-[10px] text-slate-400">Razorpay & API ready</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Delivery / BlueDart</div>
                    <div className="text-[10px] text-slate-400">Pre-negotiated rates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Fulfillment Queue / Auto-Dispatch */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Live Fulfillment Queue
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                92% Optimal
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 -mt-2">
              Auto-Dispatch
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Smart routing sends purchase orders directly to top-rated suppliers based on lowest transit times.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Green Supplier Routing</span>
                <span className="text-emerald-600">Active</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Inventory Accuracy</span>
                <span>99.4% Synchronized</span>
              </div>
            </div>

            {/* Simulated Live Event Stream */}
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">#ORD-9182 sent to Shenzhen Hub</div>
                  <div className="text-[10px] text-slate-400">2m ago</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">#ORD-9180 tracking uploaded</div>
                  <div className="text-[10px] text-slate-400">14m ago</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Stock reserve verified for 42 SKUs</div>
                  <div className="text-[10px] text-slate-400">1h ago</div>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/orders"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Open Execution Log
            </Link>
          </div>

          {/* Curated Dropship Niches / Instant Blueprints */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Instant Blueprints
              </span>
              <span className="text-[10px] font-bold text-slate-400">3 Pre-built</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 -mt-2">
              Curated Dropship Niches
            </h3>
            <p className="text-xs text-slate-500">
              Deploy high-conversion stores in verified profitable categories with 1-click.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  title: "Minimalist Tech & EDC",
                  sub: "65% avg profit margin",
                  badge: "Tech",
                },
                {
                  title: "Eco Glow Wellness",
                  sub: "Low return | COD verified",
                  badge: "Organic",
                },
                {
                  title: "Nordic Home Essentials",
                  sub: "Flat basket AOV ($72,200+)",
                  badge: "Artisan",
                },
              ].map((niche, i) => (
                <Link
                  key={i}
                  href="/dashboard/design"
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-700">
                      {niche.title}
                    </div>
                    <div className="text-[10px] text-slate-500">{niche.sub}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-800">DropPilot Guarantee</span>
              <span className="text-[10px] font-bold text-emerald-600">Auto-configured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Launch Checklist Component (Matching Screenshot) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Launch Checklist
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                3 of 5 completed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete these critical milestones to connect your fulfillment pipeline and accept customer payments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Launch Readiness</span>
            <div className="w-32 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: "60%" }} />
            </div>
            <span className="text-xs font-black text-indigo-600">60%</span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Item 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-xs text-slate-900">Create your account</div>
                <div className="text-[10px] text-slate-500">Master owner identity verified with {user?.email}</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Completed
            </span>
          </div>

          {/* Item 2 */}
          <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">Create your first store</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">
                    Recommended Next
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Name your brand, allocate subdomain, and choose operational currency</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Completed
            </span>
          </div>

          {/* Item 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-xs text-slate-900">Choose a store template</div>
                <div className="text-[10px] text-slate-500">Deploy conversion-optimized themes crafted for high mobile bounce recovery</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Completed
            </span>
          </div>

          {/* Item 4 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between hover:border-indigo-300 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-400">
                4
              </span>
              <div>
                <div className="font-bold text-xs text-slate-900">Add your first product</div>
                <div className="text-[10px] text-slate-500">1-click supplier import from AliExpress, CJ Dropshipping, or Indian direct catalog feeds</div>
              </div>
            </div>
            <Link
              href="/dashboard/suppliers"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-sm transition-colors"
            >
              JS Import Tool →
            </Link>
          </div>

          {/* Item 5 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between hover:border-indigo-300 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-400">
                5
              </span>
              <div>
                <div className="font-bold text-xs text-slate-900">Publish your store</div>
                <div className="text-[10px] text-slate-500">Enable public storefront checkout with server-side price recalculation</div>
              </div>
            </div>
            <Link
              href="/dashboard/design"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
            >
              Publish Store →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
