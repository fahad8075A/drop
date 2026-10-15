"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../lib/api";
import { formatCurrency, formatDate } from "../../../lib/utils";
import {
  ShoppingCart,
  Truck,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  PackageCheck,
  Send,
  Eye,
  X,
} from "lucide-react";

export default function OrdersPage() {
  const { activeStore } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFulfilling, setIsFulfilling] = useState(false);

  const loadOrders = () => {
    if (!activeStore) return;
    setIsLoading(true);
    api
      .get(`/orders/${activeStore.id}/orders`)
      .then((data) => setOrders(data || []))
      .catch((err) => console.error("Error loading orders", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [activeStore]);

  const handleFulfillOrder = async (orderId: string) => {
    if (!activeStore) return;
    setIsFulfilling(true);
    try {
      await api.post(`/orders/${activeStore.id}/orders/${orderId}/fulfill`);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        const updated = await api.get(`/orders/${activeStore.id}/orders/${orderId}`);
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      alert(err?.message || "Fulfillment dispatch failed.");
    } finally {
      setIsFulfilling(false);
    }
  };

  if (!activeStore) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-indigo-600" />
            <span>Orders & Fulfillment Routing</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable customer order snapshots, payment verification, and automated dropshipping dispatch.
          </p>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                <th className="py-3.5 px-4 font-bold">Order #</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Customer</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Items</th>
                <th className="py-3.5 px-4 font-bold text-right">Total</th>
                <th className="py-3.5 px-4 font-bold text-center">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders placed yet. Launch your storefront and test a checkout!
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(ord.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{ord.shippingAddress?.name || "Customer"}</div>
                      <div className="text-[10px] text-slate-400">{ord.shippingAddress?.city}, {ord.shippingAddress?.country}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === "FULFILLED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : ord.status === "PAID"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {ord.items?.length || 1} item(s)
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {formatCurrency(ord.totalAmount, ord.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Details</span>
                        </button>

                        {ord.status === "PAID" && (
                          <button
                            disabled={isFulfilling}
                            onClick={() => handleFulfillOrder(ord.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Fulfill</span>
                          </button>
                        )}

                        {ord.status === "FULFILLED" && (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Dispatched</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-black text-slate-900">Order {selectedOrder.orderNumber}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedOrder.status === "FULFILLED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}
              >
                {selectedOrder.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Placed on {formatDate(selectedOrder.createdAt)}</p>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs mb-6">
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">
                  Customer & Recipient
                </span>
                <div className="font-bold text-slate-900">{selectedOrder.shippingAddress?.name}</div>
                <div className="text-slate-500">{selectedOrder.customer?.email || "customer@example.com"}</div>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">
                  Shipping Destination
                </span>
                <div className="text-slate-700">
                  {selectedOrder.shippingAddress?.addressLine1}
                  {selectedOrder.shippingAddress?.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                </div>
                <div className="text-slate-500">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                </div>
                <div className="text-slate-500">{selectedOrder.shippingAddress?.country}</div>
              </div>
            </div>

            {/* Line-Item Snapshots */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Purchased Items ({selectedOrder.items?.length || 0})
              </span>
              <div className="divide-y divide-slate-100 border-y border-slate-100">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        SKU: {item.sku || "N/A"} | Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-black text-slate-900">
                      {formatCurrency(item.priceSnapshot * item.quantity, item.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="text-slate-900 font-medium">{formatCurrency(selectedOrder.subtotal, selectedOrder.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Taxes (8%):</span>
                <span className="text-slate-900 font-medium">{formatCurrency(selectedOrder.taxAmount, selectedOrder.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping:</span>
                <span className="text-slate-900 font-medium">{formatCurrency(selectedOrder.shippingAmount, selectedOrder.currency)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-indigo-600 font-black">
                  {formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}
                </span>
              </div>
            </div>

            {/* Supplier Fulfillment Tracking Card */}
            {selectedOrder.fulfillment ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" /> Dropshipping Shipment Active
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 uppercase">
                    {selectedOrder.fulfillment.status}
                  </span>
                </div>
                <div className="text-slate-700">
                  Carrier: <strong>{selectedOrder.fulfillment.carrier}</strong> | Tracking:{" "}
                  <code className="text-indigo-700 font-bold">{selectedOrder.fulfillment.trackingNumber}</code>
                </div>
                {selectedOrder.fulfillment.trackingUrl && (
                  <a
                    href={selectedOrder.fulfillment.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:underline pt-1 text-[11px]"
                  >
                    <span>View Public Tracking Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 mb-6 flex items-center justify-between">
                <span>Order is not yet fulfilled with supplier.</span>
                {selectedOrder.status === "PAID" && (
                  <button
                    disabled={isFulfilling}
                    onClick={() => handleFulfillOrder(selectedOrder.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    Trigger Fulfillment Now
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
