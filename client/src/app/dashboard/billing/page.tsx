"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../lib/api";
import { formatCurrency, formatDate } from "../../../lib/utils";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function BillingPage() {
  const { user, stores } = useAuth();
  const [subscription, setSubscription] = useState<any | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/subscriptions/current")
      .then((data) => setSubscription(data))
      .catch((err) => console.error("Error loading subscription", err));

    api
      .get("/subscriptions/plans")
      .then((data) => setPlans(data || []))
      .catch((err) => console.error("Error loading plans", err));
  }, []);

  const handleUpgradePlan = async (planCode: string) => {
    setIsUpgrading(true);
    setMessage(null);
    try {
      const session = await api.post("/subscriptions/checkout", { planCode });
      setMessage(`Subscription upgraded to ${session.name}! Entitlements refreshed.`);
      const updated = await api.get("/subscriptions/current");
      setSubscription(updated);
    } catch (err: any) {
      alert(err?.message || "Failed to initiate subscription upgrade.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const currentPlan = subscription?.plan || {
    name: "Growth Plan",
    code: "PRO",
    maxStores: 5,
    maxProducts: 500,
    monthlyPrice: 79.0,
  };

  const storesUsed = stores.length;
  const storeLimit = currentPlan.maxStores;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            <span>Subscription & Plan Entitlements</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your SaaS subscription, view resource quota limits, and scale your stores.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Active Subscription Overview Card */}
      <div className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Active SaaS Subscription
            </span>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-slate-900">{currentPlan.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                {subscription?.subscription?.status || "ACTIVE"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Billed via Razorpay Subscriptions adapter. Renews automatically on{" "}
              {subscription?.subscription?.currentPeriodEnd
                ? formatDate(subscription.subscription.currentPeriodEnd)
                : "Next Billing Cycle"}
              .
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-black text-slate-900">
              ${Number(currentPlan.monthlyPrice).toFixed(0)}
              <span className="text-xs font-normal text-slate-500">/mo</span>
            </div>
          </div>
        </div>

        {/* Entitlements Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">Storefront Quota</span>
              <span className="text-indigo-600">
                {storesUsed} / {storeLimit} stores
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${Math.min(100, (storesUsed / storeLimit) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">Catalog Capacity</span>
              <span className="text-emerald-600 font-bold">Up to {currentPlan.maxProducts} products / store</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "25%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans Upgrade Matrix */}
      <div>
        <h3 className="text-base font-extrabold text-slate-900 mb-4">Available Subscription Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = currentPlan.code === p.code;
            return (
              <div
                key={p.id}
                className={`rounded-2xl p-6 bg-white border flex flex-col justify-between transition-all ${
                  isCurrent ? "border-indigo-600 shadow-md ring-1 ring-indigo-600" : "border-slate-200/80 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {p.code}
                    </span>
                    {isCurrent && (
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Current Plan
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mt-2 mb-1">{p.name}</h4>
                  <p className="text-xs text-slate-500 mb-4">{p.description}</p>
                  <div className="text-2xl font-black text-slate-900 mb-6">
                    ${Number(p.monthlyPrice).toFixed(0)}
                    <span className="text-xs font-normal text-slate-500">/mo</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{p.maxStores} Active Storefronts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Up to {p.maxProducts} Products</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Supplier Sync & Automation</span>
                    </li>
                    {p.customDomains && (
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Custom Domains & SSL</span>
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  disabled={isCurrent || isUpgrading}
                  onClick={() => handleUpgradePlan(p.code)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-slate-100 text-slate-400 cursor-default"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  }`}
                >
                  {isCurrent ? "Current Plan Active" : `Upgrade to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
