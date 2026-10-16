"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Star,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ArrowRight,
  Eye,
  ExternalLink,
  Tag,
  Mail,
  SlidersHorizontal,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface StoreRendererProps {
  config: any;
  liveProducts?: any[];
  isInteractive?: boolean;
  onAddToCart?: (product: any) => void;
  onCheckoutSubmit?: (orderData: any) => Promise<any>;
}

export function StoreRenderer({
  config,
  liveProducts,
  isInteractive = true,
  onAddToCart,
  onCheckoutSubmit,
}: StoreRendererProps) {
  const [cart, setCart] = useState<Array<{ product: any; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  if (!config) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        No store configuration loaded.
      </div>
    );
  }

  const {
    brand = { name: "DropPilot Store", tagline: "Quality Goods" },
    theme = {
      primaryColor: "#0f172a",
      accentColor: "#4f46e5",
      backgroundColor: "#ffffff",
      cardBackgroundColor: "#f8fafc",
      textColor: "#0f172a",
      headingFont: "Plus Jakarta Sans",
      bodyFont: "Inter",
    },
    header = {
      showAnnouncement: true,
      announcementText: "Free worldwide shipping on orders over $75",
      logoText: brand.name,
      navLinks: [{ label: "Products", href: "#products" }],
    },
    sections = [],
    sampleProducts = [],
  } = config;

  // Use live products from database if available, otherwise sample products
  const allProducts = (liveProducts && liveProducts.length > 0) ? liveProducts : sampleProducts;
  const filteredProducts = allProducts.filter((p: any) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (product: any) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (idx: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === idx ? { ...item, quantity: item.quantity + delta } : item))
        .filter((i) => i.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Section finders
  const heroSection = sections.find((s: any) => s.type === "hero" && s.enabled !== false);
  const categoriesSection = sections.find(
    (s: any) => s.type === "categories" && s.enabled !== false
  );
  const productsSection = sections.find(
    (s: any) => s.type === "products" && s.enabled !== false
  );
  const promoSection = sections.find(
    (s: any) => s.type === "promo_banner" && s.enabled !== false
  );
  const reviewsSection = sections.find(
    (s: any) => s.type === "reviews" && s.enabled !== false
  );
  const newsletterSection = sections.find(
    (s: any) => s.type === "newsletter" && s.enabled !== false
  );

  return (
    <div
      className="min-h-full flex flex-col justify-between text-slate-900 transition-colors duration-300"
      style={{
        backgroundColor: theme.backgroundColor || "#ffffff",
        color: theme.textColor || "#0f172a",
        fontFamily: theme.bodyFont ? `var(--font-${theme.bodyFont.toLowerCase().replace(/\s+/g, "-")}), sans-serif` : "inherit",
      }}
    >
      <div>
        {/* Top Announcement Bar */}
        {header.showAnnouncement && (
          <div
            style={{ backgroundColor: theme.primaryColor || "#0f172a" }}
            className="py-2.5 px-4 text-center text-xs font-bold text-white tracking-wide shadow-xs flex items-center justify-center gap-2"
          >
            <span>{header.announcementText}</span>
          </div>
        )}

        {/* Storefront Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 sm:py-4 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                style={{ color: theme.primaryColor || "#0f172a" }}
                className="text-lg sm:text-2xl font-black tracking-tight"
              >
                {header.logoText || brand.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hidden xs:inline">
                Verified Store
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
              {(header.navLinks || []).map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.href}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Search & Cart Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative hidden sm:block w-48 lg:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors shadow-2xs"
              >
                <ShoppingBag
                  style={{ color: theme.accentColor || "#4f46e5" }}
                  className="w-4 h-4"
                />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span
                    style={{ backgroundColor: theme.accentColor || "#4f46e5" }}
                    className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        {heroSection && (
          <section className="relative py-10 sm:py-20 px-4 sm:px-6 border-b border-slate-200 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                {heroSection.data?.badgeText && (
                  <span
                    style={{ color: theme.accentColor || "#4f46e5" }}
                    className="inline-block text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full bg-slate-100 border border-slate-200"
                  >
                    {heroSection.data.badgeText}
                  </span>
                )}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                  {heroSection.data?.headline || "Curated Products for Modern Living"}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  {heroSection.data?.subheadline ||
                    "Discover premium quality craftsmanship with worldwide insured delivery."}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={heroSection.data?.buttonLink || "#products"}
                    style={{ backgroundColor: theme.accentColor || "#4f46e5" }}
                    className="px-7 py-3.5 rounded-xl text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:opacity-95 transition-all inline-flex items-center gap-2"
                  >
                    <span>{heroSection.data?.buttonText || "Shop Collection"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  {heroSection.data?.secondaryButtonText && (
                    <a
                      href={heroSection.data?.secondaryButtonLink || "#categories"}
                      className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-xs text-slate-700 transition-colors shadow-2xs"
                    >
                      {heroSection.data.secondaryButtonText}
                    </a>
                  )}
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl aspect-4/3 sm:aspect-16/10 bg-slate-100">
                  <img
                    src={
                      heroSection.data?.backgroundImage ||
                      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&q=80"
                    }
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 shadow-sm flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>100% Quality Inspected</span>
                    </span>
                    <span className="text-slate-500 font-medium">Free 30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CATEGORIES SECTION */}
        {categoriesSection && categoriesSection.data?.items?.length > 0 && (
          <section id="categories" className="py-10 sm:py-16 px-4 sm:px-6 border-b border-slate-200 bg-slate-50/60">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {categoriesSection.data?.title || "Explore Categories"}
                </h3>
                {categoriesSection.data?.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {categoriesSection.data.subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {categoriesSection.data.items.map((cat: any) => (
                  <a
                    key={cat.id}
                    href="#products"
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xs hover:shadow-md transition-all h-52 sm:h-64 flex flex-col justify-end p-4 sm:p-5"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative text-white z-10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        {cat.itemCount || "Featured"}
                      </p>
                      <h4 className="text-lg sm:text-xl font-black text-white">{cat.name}</h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PRODUCTS CATALOG GRID */}
        {productsSection && (
          <section id="products" className="py-10 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {productsSection.data?.title || "Featured Products"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {productsSection.data?.subtitle ||
                    "Direct-from-supplier inventory with real-time stock sync."}
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p: any) => {
                const discount =
                  p.compareAtPrice && p.compareAtPrice > p.price
                    ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                    : null;

                return (
                  <div
                    key={p.id}
                    style={{ backgroundColor: theme.cardBackgroundColor || "#ffffff" }}
                    className="rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-square mb-4 border border-slate-100">
                        <img
                          src={
                            p.images?.[0] ||
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
                          }
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {discount && (
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] uppercase shadow-xs">
                            Save {discount}%
                          </span>
                        )}
                        {p.badge && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px]">
                            {p.badge}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(p)}
                          className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Quick View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {p.category || "General"}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-slate-900">
                            {formatCurrency(p.price, "USD")}
                          </span>
                          {p.compareAtPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatCurrency(p.compareAtPrice, "USD")}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          In Stock · Ships 24h
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(p)}
                        style={{ backgroundColor: theme.accentColor || "#4f46e5" }}
                        className="px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PROMOTIONAL CALLOUT BANNER */}
        {promoSection && (
          <section className="py-10 sm:py-16 px-4 sm:px-6 bg-slate-900 text-white border-y border-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white inline-block">
                  {promoSection.data?.tag || "Limited Time Offer"}
                </span>
                <h3 className="text-xl sm:text-4xl font-black text-white tracking-tight">
                  {promoSection.data?.headline || "Special Promotional Savings"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {promoSection.data?.description ||
                    "Enter promo code at checkout for immediate cart savings."}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 font-mono text-sm font-bold text-amber-300">
                    CODE: {promoSection.data?.code || "WELCOME10"}
                  </div>
                  <a
                    href={promoSection.data?.buttonLink || "#products"}
                    style={{ backgroundColor: theme.accentColor || "#4f46e5" }}
                    className="px-6 py-2.5 rounded-xl text-white font-bold text-xs hover:opacity-95 transition-all"
                  >
                    {promoSection.data?.buttonText || "Shop Now"}
                  </a>
                </div>
              </div>

              {promoSection.data?.image && (
                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl max-h-72">
                    <img
                      src={promoSection.data.image}
                      alt="Promotion"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CUSTOMER REVIEWS */}
        {reviewsSection && (
          <section id="reviews" className="py-10 sm:py-16 px-4 sm:px-6 border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                  Community Proof
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {reviewsSection.data?.title || "Customer Reviews"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {reviewsSection.data?.subtitle ||
                    "Social proof module rendered from store configuration."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {(reviewsSection.data?.items || []).map((rev: any) => (
                  <div
                    key={rev.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[11px] font-bold text-slate-500 ml-2">
                        Verified Purchase
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">{rev.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      “{rev.text}”
                    </p>
                    <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-800">{rev.author}</span>
                      <span className="text-[11px]">{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* NEWSLETTER SECTION */}
        {newsletterSection && (
          <section className="py-10 sm:py-16 px-4 sm:px-6 bg-slate-50/70 border-b border-slate-200">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {newsletterSection.data?.headline || "Stay Connected"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {newsletterSection.data?.description ||
                  "Subscribe for exclusive product drops and promotions."}
              </p>

              {newsletterSubmitted ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you for subscribing! Check your inbox for updates.</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newsletterEmail) setNewsletterSubmitted(true);
                  }}
                  className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={
                      newsletterSection.data?.placeholder || "Enter your email address..."
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs outline-none focus:border-indigo-600"
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: theme.primaryColor || "#0f172a" }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-bold text-xs whitespace-nowrap hover:opacity-90 transition-all shadow-xs"
                  >
                    {newsletterSection.data?.buttonText || "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-8 sm:py-10 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div>
            <span className="font-black text-slate-900 text-sm mr-2">{brand.name}</span>
            <span>— {brand.tagline}</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} {brand.name}. Powered by DropPilot SaaS.</span>
          </div>
        </div>
      </footer>

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col justify-between p-4 sm:p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-black text-slate-900 text-base">Your Cart</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs font-medium">
                  Your cart is currently empty.
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div className="overflow-hidden max-w-[200px]">
                        <div className="font-bold text-slate-900 truncate">
                          {item.product.title}
                        </div>
                        <div className="text-indigo-600 font-black mt-0.5">
                          {formatCurrency(item.product.price, "USD")}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => updateQty(idx, -1)}
                          className="p-0.5 text-slate-400 hover:text-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-slate-900 text-xs w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(idx, 1)}
                          className="p-0.5 text-slate-400 hover:text-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex justify-between font-black text-sm text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-indigo-600">{formatCurrency(cartTotal, "USD")}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  style={{ backgroundColor: theme.primaryColor || "#0f172a" }}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT QUICK VIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-video">
              <img
                src={selectedProduct.images?.[0]}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase">
                {selectedProduct.category || "General"}
              </span>
              <h3 className="text-lg font-black text-slate-900">{selectedProduct.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xl font-black text-slate-900">
                {formatCurrency(selectedProduct.price, "USD")}
              </span>
              <button
                type="button"
                onClick={() => {
                  handleAdd(selectedProduct);
                  setSelectedProduct(null);
                }}
                style={{ backgroundColor: theme.accentColor || "#4f46e5" }}
                className="px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs hover:opacity-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Direct Merchant Checkout
              </span>
              <h3 className="text-xl font-black text-slate-900">Complete Your Order</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your shipping address to finalize delivery from {brand.name}.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const orderPayload = {
                  customer: {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                  },
                  shippingAddress: {
                    name: formData.get("name") as string,
                    addressLine1: formData.get("address") as string,
                    city: formData.get("city") as string,
                    state: formData.get("state") as string,
                    postalCode: formData.get("zip") as string,
                    country: "United States",
                  },
                  items: cart.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                  })),
                };

                if (onCheckoutSubmit) {
                  try {
                    const res = await onCheckoutSubmit(orderPayload);
                    if (res?.order) {
                      setOrderConfirmed(res.order);
                      setCart([]);
                      setIsCheckoutOpen(false);
                      return;
                    }
                  } catch (err: any) {
                    alert(err?.message || "Checkout failed. Please try again.");
                    return;
                  }
                }

                // Default simulated preview checkout
                setOrderConfirmed({
                  orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                  totalAmount: cartTotal + (cartTotal >= 75 ? 0 : 9.99) + cartTotal * 0.08,
                  currency: "USD",
                  shippingAddress: { name: (formData.get("name") as string) || "Customer" },
                  fulfillment: { status: "PROCESSING" },
                });
                setCart([]);
                setIsCheckoutOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue="Jane Doe"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="jane.doe@example.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Street Address</label>
                <input
                  name="address"
                  type="text"
                  required
                  defaultValue="742 Evergreen Terrace"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City</label>
                  <input
                    name="city"
                    type="text"
                    required
                    defaultValue="Springfield"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">State</label>
                  <input
                    name="state"
                    type="text"
                    required
                    defaultValue="OR"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Postal Code</label>
                  <input
                    name="zip"
                    type="text"
                    required
                    defaultValue="97477"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 mt-2">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({cartItemCount} items):</span>
                  <span className="font-bold text-slate-800">{formatCurrency(cartTotal, "USD")}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Shipping:</span>
                  <span className="font-bold text-slate-800">
                    {cartTotal >= 75 ? "FREE" : "$9.99"}
                  </span>
                </div>
                <div className="flex justify-between font-black text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>Total Authorized:</span>
                  <span className="text-emerald-600">
                    {formatCurrency(cartTotal + (cartTotal >= 75 ? 0 : 9.99) + cartTotal * 0.08, "USD")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                style={{ backgroundColor: theme.primaryColor || "#0f172a" }}
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Authorize & Pay with Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Order Placed Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Order ID: <strong>{orderConfirmed.orderNumber}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Total Paid:</span>
                <span className="font-black text-emerald-600">
                  {formatCurrency(orderConfirmed.totalAmount, orderConfirmed.currency || "USD")}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Recipient:</span>
                <span className="font-bold text-slate-800">
                  {orderConfirmed.shippingAddress?.name || "Customer"}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Fulfillment Status:</span>
                <span className="font-bold text-indigo-600">
                  {orderConfirmed.fulfillment?.status || "IN_TRANSIT"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOrderConfirmed(null)}
              style={{ backgroundColor: theme.primaryColor || "#0f172a" }}
              className="w-full py-3 rounded-xl text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all"
            >
              Continue Browsing Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
