"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Package,
  CreditCard,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs py-2.5"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-200/70 py-3.5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand Logo & System Status */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform duration-200">
              DP
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                DropPilot
              </span>

            </div>
          </Link>

          {/* Live Platform Health Badge (Desktop) */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200 text-[11px] font-bold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systems Operational</span>
          </div>
        </div>

        {/* Center: Navigation Links & Mega Dropdown */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              <span>Platform</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${solutionsOpen ? "rotate-180 text-indigo-600" : "text-slate-400"
                  }`}
              />
            </button>

            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 mt-1 w-80 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xl space-y-1"
                >
                  <a
                    href="#how-it-works"
                    onClick={(e) => handleNavClick(e, "#how-it-works")}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-xs">Automated Workflow</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight">
                        3-step supplier import, builder & auto-fulfillment
                      </p>
                    </div>
                  </a>

                  <a
                    href="#catalog"
                    onClick={(e) => handleNavClick(e, "#catalog")}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-xs">Winning SKU Catalog</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight">
                        Live margin calculator & supplier cost telemetry
                      </p>
                    </div>
                  </a>

                  <a
                    href="#integrations"
                    onClick={(e) => handleNavClick(e, "#integrations")}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-xs">Supplier & Carrier Sync</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight">
                        AliExpress, CJ, Zendrop, BlueDart, Stripe, Razorpay
                      </p>
                    </div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#templates"
            onClick={(e) => handleNavClick(e, "#templates")}
            className="px-3 py-2 rounded-xl hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          >
            Storefronts
          </a>

          <a
            href="#reviews"
            onClick={(e) => handleNavClick(e, "#reviews")}
            className="px-3 py-2 rounded-xl hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          >
            Success Stories
          </a>

          <a
            href="#pricing"
            onClick={(e) => handleNavClick(e, "#pricing")}
            className="px-3 py-2 rounded-xl hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          >
            Pricing
          </a>

          <Link
            href="/dashboard"
            className="ml-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-bold text-[11px] flex items-center gap-1.5"
          >
            <span>Merchant Console</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>
        </nav>

        {/* Right: Authentication Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-600/25 transition-all flex items-center gap-1.5 group"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/register"
            className="text-xs font-bold bg-indigo-600 active:bg-indigo-700 text-white px-3.5 py-2 rounded-xl shadow-xs"
          >
            Free Trial
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden border-b border-slate-200/90 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-4 shadow-xl"
          >
            <div className="grid grid-cols-1 gap-1 text-sm font-semibold text-slate-700">
              <a
                href="#how-it-works"
                onClick={(e) => handleNavClick(e, "#how-it-works")}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-100/80 active:bg-slate-200/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>How It Works</span>
              </a>
              <a
                href="#catalog"
                onClick={(e) => handleNavClick(e, "#catalog")}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-100/80 active:bg-slate-200/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <span>Winning Products</span>
              </a>
              <a
                href="#templates"
                onClick={(e) => handleNavClick(e, "#templates")}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-100/80 active:bg-slate-200/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <span>Curated Storefronts</span>
              </a>
              <a
                href="#integrations"
                onClick={(e) => handleNavClick(e, "#integrations")}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-100/80 active:bg-slate-200/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span>Integrations</span>
              </a>
              <a
                href="#reviews"
                onClick={(e) => handleNavClick(e, "#reviews")}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-100/80 active:bg-slate-200/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Success Stories</span>
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleNavClick(e, "#pricing")}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-100/80 active:bg-slate-200/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <span>Pricing Plans</span>
              </a>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-indigo-700 bg-indigo-50/80 border border-indigo-100 font-bold mt-1"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Merchant Console
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
