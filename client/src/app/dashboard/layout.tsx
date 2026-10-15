"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  Palette,
  Truck,
  CreditCard,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  ExternalLink,
  Plus,
  User,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  Code,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, stores, activeStore, setActiveStore, logout, isLoading } = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top immediately when navigating between dashboard tabs
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Stores", href: "/dashboard", icon: Store },
    { name: "Products & Inventory", href: "/dashboard/products", icon: Package },
    { name: "Orders & Routing", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Website Builder", href: "/dashboard/design", icon: Palette },
    { name: "Suppliers & Feeds", href: "/dashboard/suppliers", icon: Truck },
    { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-500 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Connecting to Workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Sidebar - Clean Light Theme */}
      <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
                DP
              </div>
              <div>
                <span className="font-extrabold text-base text-slate-900 tracking-tight">DropPilot</span>
                <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-0.5">
                  Multi-Store HQ
                </span>
              </div>
            </Link>
          </div>

          {/* Workspace Switcher Pill */}
          <div className="p-3 border-b border-slate-100 relative">
            <button
              onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors text-left"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <div className="overflow-hidden">
                  <div className="text-[11px] font-bold text-slate-900 truncate">
                    {activeStore ? activeStore.name : "All Workspaces"}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    {activeStore ? `/${activeStore.slug}` : "Multi-Store Inc."}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </button>

            {storeDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1.5 p-2 rounded-xl bg-white border border-slate-200 shadow-xl z-50 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Active Stores ({stores.length})
                </div>
                {stores.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveStore(s);
                      setStoreDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      activeStore?.id === s.id
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">/{s.slug}</span>
                  </button>
                ))}
                <Link
                  href="/onboarding"
                  onClick={() => setStoreDropdownOpen(false)}
                  className="w-full mt-1 pt-1.5 border-t border-slate-100 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Store</span>
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Main Navigation
            </div>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2">
              Support & Docs
            </div>
            <div className="space-y-1">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Help & Support</span>
              </Link>
            </div>
          </div>

          {/* Bottom User Pill */}
          <div className="p-3 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {userInitial}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => logout().then(() => router.push("/"))}
                title="Log Out"
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Bar matching Screenshot */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20">
          {/* Left: Global Search Input */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search stores, products, orders... ⌘K"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Center / Right: Live Sync Breadcrumb + Region Badge + Profile Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
              <span className="font-medium text-slate-700">Organization / Workspace HQ</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Sync
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>ap-south | Mumbai</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            {/* User Profile Avatar with Flyout Dropdown (Matches Screenshot!) */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {userInitial}
                </div>
                <div className="hidden xl:block text-left text-xs leading-tight">
                  <div className="font-bold text-slate-900">{user.name}</div>
                  <div className="text-[10px] text-slate-400">Merchant HQ</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Flyout Profile Card Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                        {userInitial}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm leading-tight">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{user.email}</div>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-200">
                          Owner - Growth Plan
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Stores Quota Bar */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Active Stores
                      </span>
                      <Link
                        href="/dashboard/billing"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="text-[10px] font-bold text-indigo-600 hover:underline"
                      >
                        Upgrade →
                      </Link>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>{stores.length} / 5 Max</span>
                      <span className="text-emerald-600 text-[10px]">Healthy</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${(stores.length / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Profile Menu Links */}
                  <div className="space-y-0.5 pt-1 text-slate-700 font-medium">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>Billing & Plans</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        14 days left
                      </span>
                    </Link>
                    <Link
                      href="/dashboard/suppliers"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs"
                    >
                      <Code className="w-3.5 h-3.5 text-slate-400" />
                      <span>API & Webhooks</span>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout().then(() => router.push("/"));
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout (Sign out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
