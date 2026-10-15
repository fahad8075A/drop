"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../lib/api";
import { formatCurrency } from "../../../lib/utils";
import {
  Package,
  Plus,
  TrendingUp,
  DollarSign,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
} from "lucide-react";

export default function ProductsPage() {
  const { activeStore } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(39.99);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(49.99);
  const [supplierCost, setSupplierCost] = useState<number>(12.0);
  const [inventoryCount, setInventoryCount] = useState<number>(50);
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT">("ACTIVE");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80");

  const loadProducts = () => {
    if (!activeStore) return;
    setIsLoading(true);
    api
      .get(`/catalog/${activeStore.id}/products`, { params: { search: search || undefined } })
      .then((data) => setProducts(data || []))
      .catch((err) => console.error("Error loading products", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [activeStore, search]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  // Real-time profit estimate calculation
  const paymentFee = price * 0.029 + 0.3;
  const netProfit = price - (supplierCost + paymentFee);
  const grossMargin = price > 0 ? ((price - supplierCost) / price) * 100 : 0;
  const netMargin = price > 0 ? (netProfit / price) * 100 : 0;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStore) return;
    setError(null);

    try {
      await api.post(`/catalog/${activeStore.id}/products`, {
        title,
        slug,
        description,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        supplierCost: supplierCost ? Number(supplierCost) : undefined,
        inventoryCount: Number(inventoryCount),
        status,
        images: imageUrl ? [imageUrl] : [],
      });
      setIsModalOpen(false);
      resetForm();
      loadProducts();
    } catch (err: any) {
      setError(err?.message || "Failed to create product.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!activeStore || !confirm("Are you sure you want to remove this product?")) return;
    try {
      await api.delete(`/catalog/${activeStore.id}/products/${id}`);
      loadProducts();
    } catch (err: any) {
      alert(err?.message || "Failed to delete product.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setPrice(39.99);
    setCompareAtPrice(49.99);
    setSupplierCost(12.0);
    setInventoryCount(50);
    setStatus("ACTIVE");
    setError(null);
  };

  if (!activeStore) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <span>Product Catalog & Profit Estimator</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage inventory, selling prices, supplier costs, and automated margins for <strong>{activeStore.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 outline-none shadow-sm"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Products: <strong className="text-slate-900">{products.length}</strong>
        </div>
      </div>

      {/* Products Table with Profit Breakdown */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                <th className="py-3.5 px-4 font-bold">Product</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Selling Price</th>
                <th className="py-3.5 px-4 font-bold text-right">Supplier Cost</th>
                <th className="py-3.5 px-4 font-bold text-right">Est. Net Profit</th>
                <th className="py-3.5 px-4 font-bold text-right">Gross Margin</th>
                <th className="py-3.5 px-4 font-bold text-right">Stock</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No products found. Add your first product or import from suppliers!
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const profit = p.profitEstimate || {
                    estimatedNetProfit: p.price - (p.supplierCost || 0),
                    estimatedGrossMarginPct: 50,
                  };
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {p.images && p.images[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="overflow-hidden max-w-xs">
                            <div className="font-bold text-slate-900 truncate">{p.title}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              SKU: {p.sku || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900">
                        {formatCurrency(p.price, activeStore.currency)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500 font-mono">
                        {p.supplierCost ? formatCurrency(p.supplierCost, activeStore.currency) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                        +{formatCurrency(profit.estimatedNetProfit, activeStore.currency)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                          {profit.estimatedGrossMarginPct}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                        {p.inventoryCount} units
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>Add Product to Store Catalog</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter product details and review live projected profit estimates.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Ergonomic Wireless Mouse"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-xs outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-xs outline-none"
                  >
                    <option value="ACTIVE">ACTIVE (Published in Store)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Compelling product copy highlighting specifications and features..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-xs outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Compare-At ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Supplier Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={supplierCost}
                    onChange={(e) => setSupplierCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Live Projected Profit Estimator Widget */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Real-Time Profit Projection
                  </span>
                  <span className="text-[10px] text-emerald-600">Includes 2.9% + $0.30 gateway fee</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Net Profit / Unit</span>
                    <span className="text-sm font-black text-emerald-700">
                      ${netProfit.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Gross Margin</span>
                    <span className="text-sm font-black text-slate-900">{grossMargin.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Net Margin</span>
                    <span className="text-sm font-black text-indigo-700">{netMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
