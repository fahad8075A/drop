"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import {
  Store,
  Palette,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("minimal-modern");
  const [selectedSupplier, setSelectedSupplier] = useState("SANDBOX_MOCK");
  const [templates, setTemplates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdStore, setCreatedStore] = useState<any | null>(null);

  useEffect(() => {
    api
      .get("/templates")
      .then((data) => setTemplates(data))
      .catch((err) => console.error("Error loading templates", err));
  }, []);

  const handleNameChange = (name: string) => {
    setStoreName(name);
    if (!createdStore) {
      setStoreSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleCreateStore = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const templateObj = templates.find((t) => t.code === selectedTemplate) || templates[0];
      const newStore = await api.post("/stores", {
        name: storeName,
        slug: storeSlug,
        templateId: templateObj?.id,
        currency: "USD",
      });

      setCreatedStore(newStore);
      await refreshUser();
      setStep(4);
    } catch (err: any) {
      setError(err?.message || "Failed to create store. Please check slug availability.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishAndFinish = async () => {
    if (!createdStore) return;
    setIsSubmitting(true);
    try {
      await api.post(`/stores/${createdStore.id}/publish`);
      await refreshUser();
      router.push(`/dashboard`);
    } catch (err: any) {
      setError(err?.message || "Failed to publish store.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between py-10 px-6 sm:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 mb-2 uppercase tracking-wider">
            Storefront Setup Wizard
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Launch Your New Dropshipping Store
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your store identity, choose an original template, connect suppliers, and publish.
          </p>
        </div>

        {/* Multi-Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { num: 1, label: "Store Identity" },
            { num: 2, label: "Select Template" },
            { num: 3, label: "Supplier Connection" },
            { num: 4, label: "Review & Publish" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.num
                    ? "bg-indigo-600 text-white shadow-sm"
                    : step > s.num
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-xs font-bold hidden sm:inline ${
                  step === s.num ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
              {s.num < 4 && <div className="w-8 h-0.5 bg-slate-200 hidden sm:block" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Store Identity */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                <span>Store Name & Subdomain</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your store slug creates your unique platform subdomain and routing URL.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Store Public Name
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Nordic Living Essentials"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subdomain Slug
                </label>
                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:bg-white focus-within:border-indigo-500">
                  <span className="px-4 text-xs font-bold text-slate-500 bg-slate-100 py-3 border-r border-slate-200">
                    droppilot.com/store/
                  </span>
                  <input
                    type="text"
                    required
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="nordic"
                    className="w-full px-4 py-3 bg-transparent text-slate-900 text-sm outline-none font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Only lowercase letters, numbers, and hyphens. You can map custom domains later in settings.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={!storeName || !storeSlug}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-sm"
              >
                <span>Continue to Templates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                <span>Choose Storefront Template</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select an initial layout. You can customize colors, hero, sections, and fonts anytime in the design dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  code: "minimal-modern",
                  name: "Minimal Modern",
                  tag: "Artisanal & Decor",
                  desc: "Generous whitespace, quiet typography, refined aesthetic.",
                  img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
                },
                {
                  code: "fashion-lifestyle",
                  name: "Fashion & Lifestyle",
                  tag: "Apparel & Streetwear",
                  desc: "Bold lookbooks, high-impact seasonal banners, editorial layout.",
                  img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
                },
                {
                  code: "electronics-gadgets",
                  name: "Electronics & Gadgets",
                  tag: "Smart Tech & Audio",
                  desc: "High-contrast dark mode, spec tables, feature matrix badges.",
                  img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
                },
              ].map((tmpl) => (
                <div
                  key={tmpl.code}
                  onClick={() => setSelectedTemplate(tmpl.code)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTemplate === tmpl.code
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <img src={tmpl.img} alt={tmpl.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{tmpl.name}</span>
                    {selectedTemplate === tmpl.code && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 block mb-1.5">{tmpl.tag}</span>
                  <p className="text-xs text-slate-500 line-clamp-2">{tmpl.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-sm"
              >
                <span>Continue to Supplier Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Supplier Connection */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                <span>Choose Dropshipping Supplier</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                DropPilot securely encrypts supplier credentials with AES-256-GCM.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "SANDBOX_MOCK",
                  name: "DropPilot Sandbox Supplier (Instant Testing)",
                  desc: "Pre-configured mock supplier with deterministic test catalog, live auto-tracking, and instant fulfillment.",
                  badge: "Recommended for Dev",
                },
                {
                  id: "ALIEXPRESS",
                  name: "AliExpress Dropshipping API",
                  desc: "Connect directly to the AliExpress Open Platform for global product sourcing and order dispatch.",
                  badge: "Production Ready",
                },
                {
                  id: "CJ_DROPSHIPPING",
                  name: "CJ Dropshipping Global API",
                  desc: "Fast US/EU warehouse fulfillment, automated POD, and custom packaging support.",
                  badge: "Production Ready",
                },
              ].map((sup) => (
                <div
                  key={sup.id}
                  onClick={() => setSelectedSupplier(sup.id)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    selectedSupplier === sup.id
                      ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{sup.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {sup.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{sup.desc}</p>
                  </div>
                  {selectedSupplier === sup.id && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 ml-4" />}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCreateStore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? "Provisioning Store..." : "Create & Initialize Store"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review, Preview & Publish */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Store Successfully Created!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your store <strong>{storeName}</strong> is ready for live publishing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Store Name:</span>
                <span className="font-bold text-slate-900">{storeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Public Slug:</span>
                <span className="font-mono text-indigo-600 font-bold">/store/{storeSlug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Template:</span>
                <span className="font-bold text-slate-900">{selectedTemplate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Connected Supplier:</span>
                <span className="font-bold text-slate-900">{selectedSupplier}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePublishAndFinish}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                <span>{isSubmitting ? "Publishing..." : "Publish Live & Open Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all"
              >
                Keep as Draft & Open Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
