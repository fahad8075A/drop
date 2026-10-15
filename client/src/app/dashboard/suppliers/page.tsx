"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../lib/api";
import { formatCurrency } from "../../../lib/utils";
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Download,
  Lock,
} from "lucide-react";

export default function SuppliersPage() {
  const { activeStore } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [availableSuppliers, setAvailableSuppliers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState("SANDBOX_MOCK");
  const [importingId, setImportingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadData = () => {
    if (!activeStore) return;
    api
      .get(`/suppliers/${activeStore.id}/connections`)
      .then((data) => setConnections(data || []))
      .catch((err) => console.error("Error loading connections", err));

    api
      .get("/suppliers")
      .then((data) => setAvailableSuppliers(data || []))
      .catch((err) => console.error("Error loading suppliers", err));
  };

  useEffect(() => {
    loadData();
    handleSearchSupplierCatalog();
  }, [activeStore]);

  const handleSearchSupplierCatalog = async () => {
    setIsSearching(true);
    setStatusMessage(null);
    try {
      const data = await api.get("/suppliers/search", {
        params: { type: selectedType, q: searchQuery || undefined },
      });
      setSupplierProducts(data || []);
    } catch (err: any) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportProduct = async (externalId: string) => {
    if (!activeStore) return;
    setImportingId(externalId);
    setStatusMessage(null);
    try {
      await api.post(`/suppliers/${activeStore.id}/import`, {
        supplierType: selectedType,
        externalId,
        profitMarkup: 2.2,
      });
      setStatusMessage("Product successfully imported into your store catalog with 2.2x profit markup!");
    } catch (err: any) {
      alert(err?.message || "Import failed.");
    } finally {
      setImportingId(null);
    }
  };

  if (!activeStore) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" />
            <span>Supplier Integrations & Catalog Import</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect dropshipping partners, search external supplier feeds, and 1-click import with auto-pricing.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Connected Suppliers Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600" /> Connected Supplier Vaults
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {connections.map((c) => (
            <div key={c.id} className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{c.supplierName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Credentials encrypted via AES-256-GCM. Stock and prices synced every 6 hours.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Last Synced: Just now</span>
                <span className="text-indigo-600 font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Auto-sync
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplier Catalog Search & 1-Click Import Feed */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 mb-1">Search & Import Supplier Catalog</h3>
          <p className="text-xs text-slate-500">
            Browse trending products from your connected supplier network and import directly to <strong>{activeStore.name}</strong>.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSupplierCatalog()}
              placeholder="Search supplier feed by keyword (e.g. power bank, wallet, headphones)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-indigo-500 font-medium"
          >
            <option value="SANDBOX_MOCK">Sandbox Supplier (Deterministic Mock)</option>
            <option value="ALIEXPRESS">AliExpress Dropshipping API</option>
          </select>

          <button
            onClick={handleSearchSupplierCatalog}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
          >
            {isSearching ? "Searching..." : "Search Feed"}
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {supplierProducts.map((p) => {
            const suggestedRetail = (p.price * 2.2).toFixed(2);
            const estProfit = (Number(suggestedRetail) - p.price - (Number(suggestedRetail) * 0.029 + 0.3)).toFixed(2);

            return (
              <div
                key={p.externalId}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors"
              >
                <div>
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-44 object-cover rounded-xl bg-slate-100 mb-3 border border-slate-100"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>ID: {p.externalId}</span>
                    <span>Stock: {p.stock} units</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">{p.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Supplier Cost</span>
                      <span className="font-bold text-slate-800">${p.price.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Suggested Retail</span>
                      <span className="font-bold text-indigo-600">${suggestedRetail}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Profit</span>
                      <span className="font-bold text-emerald-600">+${estProfit}</span>
                    </div>
                  </div>

                  <button
                    disabled={importingId === p.externalId}
                    onClick={() => handleImportProduct(p.externalId)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{importingId === p.externalId ? "Importing..." : "1-Click Import to Store"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
