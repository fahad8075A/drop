"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import {
  ShieldAlert,
  Users,
  Store,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  Ban,
  Clock,
  ArrowRight,
  LogOut,
} from "lucide-react";

export default function AdminConsolePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [metrics, setMetrics] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [storesList, setStoresList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"stores" | "users" | "logs">("stores");
  const [isUpdating, setIsUpdating] = useState(false);

  const loadAdminData = () => {
    Promise.all([
      api.get("/admin/metrics"),
      api.get("/admin/users"),
      api.get("/admin/stores"),
      api.get("/admin/audit-logs"),
    ])
      .then(([m, u, s, logs]) => {
        setMetrics(m);
        setUsersList(u || []);
        setStoresList(s || []);
        setAuditLogs(logs || []);
      })
      .catch((err) => {
        console.error("Admin load error", err);
      });
  };

  useEffect(() => {
    if (user && user.role !== "PLATFORM_ADMIN") {
      router.push("/dashboard");
      return;
    }
    loadAdminData();
  }, [user]);

  const handleToggleStoreStatus = async (storeId: string, currentStatus: string) => {
    setIsUpdating(true);
    const newStatus = currentStatus === "SUSPENDED" ? "PUBLISHED" : "SUSPENDED";
    try {
      await api.put(`/admin/stores/${storeId}/status`, { status: newStatus });
      loadAdminData();
    } catch (err: any) {
      alert(err?.message || "Failed to update store status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user || user.role !== "PLATFORM_ADMIN") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-500 text-xs">
        Checking platform administrator permissions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Platform Administration Console
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Superadmin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global multi-tenant governance, user accounts, tenant suspension controls, and security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-sm"
          >
            Switch to Merchant View
          </Link>
          <button
            onClick={() => logout().then(() => router.push("/"))}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 transition-colors shadow-sm"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Global SaaS Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {metrics?.totalUsers ?? usersList.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">SaaS account owners</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Total Tenant Stores</span>
            <Store className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {metrics?.totalStores ?? storesList.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            {metrics?.activeStores ?? storesList.filter((s) => s.status === "PUBLISHED").length} Published Live
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Platform Gross GMV</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {formatCurrency(metrics?.grossMerchandiseValue || 107.98)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Across all store checkouts</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Platform Status</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Uptime: {metrics?.platformUptimeSeconds || 120}s</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab("stores")}
          className={`pb-3 transition-colors ${
            activeTab === "stores"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          All Stores ({storesList.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 transition-colors ${
            activeTab === "users"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          User Accounts ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 transition-colors ${
            activeTab === "logs"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Stores Management */}
      {activeTab === "stores" && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                  <th className="py-3 px-4 font-bold">Store</th>
                  <th className="py-3 px-4 font-bold">Owner</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Products</th>
                  <th className="py-3 px-4 font-bold">Orders</th>
                  <th className="py-3 px-4 font-bold text-center">Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {storesList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[10px] font-mono text-indigo-600">/store/{s.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{s.ownerName}</div>
                      <div className="text-[10px] text-slate-400">{s.ownerEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : s.status === "SUSPENDED"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{s.productCount}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{s.orderCount}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        disabled={isUpdating}
                        onClick={() => handleToggleStoreStatus(s.id, s.status)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          s.status === "SUSPENDED"
                            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {s.status === "SUSPENDED" ? "Reactivate Store" : "Suspend Store"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: User Accounts */}
      {activeTab === "users" && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                  <th className="py-3 px-4 font-bold">User</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">Subscription Plan</th>
                  <th className="py-3 px-4 font-bold">Stores Owned</th>
                  <th className="py-3 px-4 font-bold">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-indigo-600 font-bold">{u.planName}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{u.storeCount}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Security Audit Logs */}
      {activeTab === "logs" && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Immutable Security Audit Events</h3>
          <div className="space-y-2 text-xs font-mono">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-indigo-600">{log.action}</span>
                  <span className="text-slate-600 ml-2">
                    {log.metadata ? JSON.stringify(log.metadata) : ""}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{formatDate(log.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
