"use client";

import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../lib/api";
import {
  Settings,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Copy,
  ShieldCheck,
  Server,
} from "lucide-react";

export default function SettingsPage() {
  const { activeStore, refreshUser } = useAuth();
  const [name, setName] = useState(activeStore?.name || "");
  const [currency, setCurrency] = useState(activeStore?.currency || "USD");
  const [locale, setLocale] = useState(activeStore?.locale || "en-US");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!activeStore) return null;

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      await api.put(`/stores/${activeStore.id}`, { name, currency, locale });
      await refreshUser();
      setStatusMessage("Store general settings updated successfully.");
    } catch (err: any) {
      alert(err?.message || "Failed to update store settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Store Settings & Custom Domains</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure currency localization, store metadata, and connect custom apex/subdomains.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* General Settings Form */}
      <div className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 mb-2">General Configuration</h3>
        <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Store Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Storefront Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500 font-medium"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="INR">INR (₹ - Indian Rupee)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Locale
              </label>
              <input
                type="text"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </form>
      </div>

      {/* Custom Domain Setup Card */}
      <div className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Custom Domain Mapping</span>
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            SSL Managed
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Point your custom domain (e.g. <code>shop.mybrand.com</code>) to the DropPilot router by adding a CNAME DNS record.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2">
          <div className="flex justify-between text-slate-500">
            <span>DNS Type:</span>
            <span className="text-slate-900 font-bold">CNAME</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Host / Name:</span>
            <span className="text-slate-900 font-bold">shop (or @ for root)</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Target / Points To:</span>
            <span className="text-indigo-600 font-bold">cname.droppilot.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
