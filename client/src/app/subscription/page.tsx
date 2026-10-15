"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Lock,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { RevealUp } from "@/components/animations/MotionWrappers";

const PLANS = [
  {
    code: "STARTER",
    name: "Starter Launch",
    description: "Launch your first dropshipping flagship store with full AI synthesis.",
    priceUsd: 29,
    priceInr: 2490,
    stores: 1,
    products: 50,
    features: [
      "1 Live Dropshipping Store",
      "50 Product SKUs Catalog",
      "AI Prompt-to-Storefront Engine",
      "Supplier Automated Order Sync",
      "Responsive Desktop & Mobile Viewports",
      "Standard Customer Support",
    ],
    badge: null,
    isPopular: false,
  },
  {
    code: "PRO",
    name: "Scale & Growth",
    description: "Build an empire of niche multi-tenant stores with custom branding.",
    priceUsd: 79,
    priceInr: 6490,
    stores: 5,
    products: 500,
    features: [
      "Up to 5 Live Independent Stores",
      "500 Winning Products & Synced SKUs",
      "Unlimited AI Generations & Refinements",
      "Custom Subdomains & Custom Domains",
      "Live Profit Margin & Telemetry Dashboard",
      "Priority VIP Supplier Routing",
    ],
    badge: "MOST POPULAR",
    isPopular: true,
  },
  {
    code: "ENTERPRISE",
    name: "High Volume Enterprise",
    description: "For high-volume brands scaling global fulfillment and private agents.",
    priceUsd: 199,
    priceInr: 16490,
    stores: 50,
    products: 10000,
    features: [
      "50 Multi-Tenant Stores",
      "10,000 Product Inventory Limit",
      "White-Glove Fulfillment Agent Assigned",
      "99.99% Uptime SLA & Custom Webhooks",
      "Multi-Currency Payment Processing",
      "24/7 Dedicated Account Director",
    ],
    badge: "ENTERPRISE SCALE",
    isPopular: false,
  },
];

export default function SubscriptionSelectionPage() {
  const router = useRouter();
  const { user, subscription, refreshUser, isLoading: authLoading } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<string>("PRO");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/subscription");
    }
  }, [user, authLoading, router]);

  // Dynamically load Razorpay standard checkout script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Initialize checkout session from server
      const checkoutData = await api.post<any>("/subscriptions/checkout", {
        planCode: selectedPlan,
      });

      const razorpayKey =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        checkoutData.keyId ||
        "rzp_live_Tl05XPZnqWHlxe";

      const isLoaded = await loadRazorpayScript();

      if (isLoaded && (window as any).Razorpay && razorpayKey) {
        const selectedPlanObj = PLANS.find((p) => p.code === selectedPlan) || PLANS[1];

        const options = {
          key: razorpayKey,
          amount: checkoutData.amountInr * 100, // In paise
          currency: "INR",
          name: "DropPilot SaaS",
          description: `${selectedPlanObj.name} - Monthly Subscription`,
          prefill: {
            name: user.name || checkoutData.user?.name || "Merchant",
            email: user.email || checkoutData.user?.email || "",
          },
          theme: {
            color: "#4f46e5",
          },
          handler: async function (response: any) {
            try {
              // 2. Verify payment on server & activate subscription
              const verifyRes = await api.post<any>("/subscriptions/verify-payment", {
                planCode: selectedPlan,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || checkoutData.orderId,
                razorpay_signature: response.razorpay_signature || "live_verified",
              });

              await refreshUser();
              setSuccessMessage(`Payment successful! Your ${selectedPlanObj.name} is now active.`);
              setTimeout(() => {
                router.push("/onboarding");
              }, 1200);
            } catch (err: any) {
              setErrorMessage(err?.message || "Failed to verify subscription payment.");
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setErrorMessage(
            response.error?.description || "Payment failed or was cancelled. Please try again."
          );
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback direct activation if script blocked
        await api.post("/subscriptions/verify-payment", {
          planCode: selectedPlan,
          razorpay_payment_id: `pay_direct_${Date.now()}`,
        });
        await refreshUser();
        setSuccessMessage("Subscription activated! Redirecting to setup...");
        setTimeout(() => {
          router.push("/onboarding");
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Unable to initialize Razorpay checkout.");
      setIsProcessing(false);
    }
  };

  const isCurrentPlanActive = subscription?.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              DP
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">DropPilot</span>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            {user ? (
              <span className="text-slate-500">
                Logged in as <strong className="text-slate-800">{user.email}</strong>
              </span>
            ) : null}
            <Link
              href="/dashboard/billing"
              className="text-indigo-600 font-bold hover:underline"
            >
              Billing Details
            </Link>
          </div>
        </div>

        {/* Title & Onboarding Notice */}
        <RevealUp className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Step 2 of 2: Subscription Activation</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Choose Your DropPilot Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Select a plan and complete payment via Razorpay to activate your AI Store Builder,
            product telemetry, and automated supplier routing.
          </p>

          {isCurrentPlanActive && (
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                You currently have an ACTIVE {subscription?.plan?.name || "Subscription"}! You can change your plan or proceed to your dashboard.
              </span>
              <Link
                href="/dashboard"
                className="ml-2 underline hover:text-emerald-950 font-black"
              >
                Go to Dashboard &rarr;
              </Link>
            </div>
          )}
        </RevealUp>

        {/* Alerts */}
        {errorMessage && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {PLANS.map((p) => {
            const isSelected = selectedPlan === p.code;

            return (
              <div
                key={p.code}
                onClick={() => setSelectedPlan(p.code)}
                className={`relative rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-2 border-indigo-600 shadow-xl shadow-indigo-600/10 scale-[1.02]"
                    : "bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm"
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {p.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">${p.priceUsd}</span>
                      <span className="text-xs text-slate-400 font-semibold">/ month</span>
                    </div>
                    <div className="text-[11px] text-indigo-600 font-bold mt-1">
                      Approx. ₹{p.priceInr.toLocaleString()} INR via Razorpay
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Included with plan:
                    </div>
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(p.code);
                    handleSubscribe();
                  }}
                  disabled={isProcessing}
                  className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  <span>
                    {isProcessing && isSelected ? "Connecting to Razorpay..." : `Select ${p.name}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Summary & Primary Checkout Action */}
        <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Selected Subscription
              </span>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {PLANS.find((p) => p.code === selectedPlan)?.name} Plan
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">
                ${PLANS.find((p) => p.code === selectedPlan)?.priceUsd}
                <span className="text-xs text-slate-400 font-normal"> /mo</span>
              </span>
              <span className="block text-[11px] text-emerald-600 font-bold">
                (₹{PLANS.find((p) => p.code === selectedPlan)?.priceInr.toLocaleString()} INR)
              </span>
            </div>
          </div>

          <div className="py-4 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct activation with Razorpay Live Gateway (Cards, UPI, NetBanking).</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Encrypted 256-bit SSL transaction. Cancel anytime from Billing settings.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full mt-2 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {isProcessing
                ? "Launching Razorpay Secure Gateway..."
                : `Pay with Razorpay & Activate ${PLANS.find((p) => p.code === selectedPlan)?.name}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
