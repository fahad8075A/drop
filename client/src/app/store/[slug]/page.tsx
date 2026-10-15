"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import { formatCurrency } from "../../../lib/utils";
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  Star,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Eye,
  Sparkles,
} from "lucide-react";
import {
  RevealFromLeft,
  RevealFromRight,
  RevealUp,
  TwoSidedSection,
  StaggerGrid,
  StaggerCard,
} from "@/components/animations/MotionWrappers";

export default function PublicStorefrontPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [storeData, setStoreData] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [theme, setTheme] = useState<any | null>(null);
  const [template, setTemplate] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Array<{ product: any; variant?: any; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Customer Checkout Form
  const [customerName, setCustomerName] = useState("Jane Doe");
  const [customerEmail, setCustomerEmail] = useState("jane.doe@example.com");
  const [addressLine1, setAddressLine1] = useState("452 Elm Street");
  const [city, setCity] = useState("Seattle");
  const [state, setState] = useState("WA");
  const [postalCode, setPostalCode] = useState("98101");
  const [country, setCountry] = useState("United States");

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    api
      .get(`/public/store/${slug}`)
      .then((data) => {
        setStoreData(data.store);
        setProducts(data.products || []);
        setTheme(data.theme);
        setTemplate(data.template);
      })
      .catch((err) => {
        setError(err?.message || "Store not found or currently suspended.");
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const addToCart = (product: any, variant?: any) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.variant?.id === variant?.id
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, idx) => {
          if (idx === index) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any
    );
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.variant?.price || item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle Checkout submission with server-validated prices
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeData || cart.length === 0) return;
    setIsSubmittingOrder(true);
    setError(null);

    try {
      const checkoutResult = await api.post(`/public/store/${slug}/checkout`, {
        customer: {
          name: customerName,
          email: customerEmail,
        },
        shippingAddress: {
          name: customerName,
          addressLine1,
          city,
          state,
          postalCode,
          country,
        },
        items: cart.map((i) => ({
          productId: i.product.id,
          variantId: i.variant?.id,
          quantity: i.quantity,
        })),
      });

      // Simulate instantaneous provider payment capture
      const verifyResult = await api.post(`/public/store/${slug}/checkout/verify-payment`, {
        orderId: checkoutResult.order.id,
        paymentId: `pay_sandbox_${Date.now()}`,
        provider: "SANDBOX",
      });

      setConfirmedOrder(verifyResult.order);
      setCart([]);
      setIsCheckoutOpen(false);
    } catch (err: any) {
      setError(err?.message || "Checkout failed. Please review your cart.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-500 text-xs font-semibold">
        <div className="flex items-center gap-3 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Resolving multi-tenant storefront...</span>
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Storefront Unavailable</h1>
        <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
          {error || `The store slug '${slug}' does not exist or has been suspended.`}
        </p>
        <a
          href="/"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          Return to DropPilot Home
        </a>
      </div>
    );
  }

  const primaryColor = theme?.colors?.primary || "#4f46e5";
  const accentColor = theme?.colors?.accent || "#4f46e5";
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between overflow-x-hidden">
      <div>
        {/* Announcement Bar */}
        {theme?.header?.showAnnouncement && (
          <div
            style={{ backgroundColor: accentColor }}
            className="py-2.5 px-4 text-center text-xs font-bold text-white tracking-wide shadow-xs"
          >
            {theme.header.announcementText || "Free worldwide insured shipping on orders over $75"}
          </div>
        )}

        {/* Public Storefront Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl font-black tracking-tight text-slate-900">{storeData.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Store
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Search input */}
              <div className="relative hidden sm:block w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors shadow-2xs"
              >
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span
                    style={{ backgroundColor: accentColor }}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Two-Sided Hero Banner (Left headline & CTA from Left, Right feature imagery from Right) */}
        <section className="py-16 sm:py-20 px-6 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto">
            <TwoSidedSection
              reversed={false}
              leftContent={
                <div className="space-y-5">
                  <span
                    style={{ color: accentColor }}
                    className="text-xs font-bold uppercase tracking-wider block"
                  >
                    Curated Direct-to-Consumer
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    {theme?.hero?.headline || "Elevated Essentials Crafted For Living"}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                    {theme?.hero?.subheadline ||
                      "Hand-picked dropshipping products backed by worldwide tracking, quality assurance, and zero middlemen."}
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href="#products"
                      style={{ backgroundColor: accentColor }}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-white font-bold text-xs shadow-sm shadow-indigo-600/20 hover:opacity-90 transition-all"
                    >
                      <span>{theme?.hero?.buttonText || "Browse Collection"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              }
              rightContent={
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-16/10 sm:aspect-16/9 bg-slate-100">
                  <img
                    src={
                      theme?.hero?.backgroundImageUrl ||
                      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80"
                    }
                    alt={storeData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Supplier Delivery Guarantee</span>
                  </div>
                </div>
              }
            />
          </div>
        </section>

        {/* Product Catalog Grid (Staggered Cards) */}
        <section id="products" className="py-16 px-6 max-w-7xl mx-auto">
          <RevealUp className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Catalog Collection</h2>
              <p className="text-xs text-slate-500 mt-0.5">All items are available for worldwide express dispatch.</p>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
            </div>
          </RevealUp>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const discount =
                p.compareAtPrice && p.compareAtPrice > p.price
                  ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                  : null;

              return (
                <StaggerCard
                  key={p.id}
                  className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 flex flex-col justify-between transition-all duration-300 group"
                >
                  <div>
                    <div className="relative rounded-xl overflow-hidden bg-slate-100 mb-4 h-56 border border-slate-100">
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {discount && (
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] uppercase shadow-xs">
                          Save {discount}%
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">{p.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-slate-900">
                          {formatCurrency(p.price, storeData.currency)}
                        </span>
                        {p.compareAtPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatCurrency(p.compareAtPrice, storeData.currency)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">In Stock · Ready to Ship</span>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      style={{ backgroundColor: accentColor }}
                      className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </StaggerCard>
              );
            })}
          </StaggerGrid>
        </section>
      </div>

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col justify-between p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-black text-slate-900 text-base">Your Shopping Cart</h3>
                </div>
                <button
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
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div className="overflow-hidden max-w-[200px]">
                        <div className="font-bold text-slate-900 truncate">{item.product.title}</div>
                        <div className="text-indigo-600 font-black mt-0.5">
                          {formatCurrency(item.product.price, storeData.currency)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1 rounded-xl">
                        <button
                          onClick={() => updateQuantity(idx, -1)}
                          className="p-0.5 text-slate-400 hover:text-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-slate-900 text-xs w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, 1)}
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
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800">
                      {formatCurrency(cartSubtotal, storeData.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-800">
                      {cartSubtotal >= 75 ? "FREE" : "$9.99"}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
                    <span>Estimated Total</span>
                    <span className="text-indigo-600">
                      {formatCurrency(
                        cartSubtotal + (cartSubtotal >= 75 ? 0 : 9.99) + cartSubtotal * 0.08,
                        storeData.currency
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  style={{ backgroundColor: accentColor }}
                  className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-sm hover:opacity-95 transition-transform flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Secure Instant Checkout</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Prices recalculated on server to prevent price tampering.
            </p>

            <form onSubmit={handleCheckout} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Shipping Address</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">State / Prov</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Cart Items ({cartItemCount}):</span>
                  <span className="font-bold text-slate-800">{formatCurrency(cartSubtotal, storeData.currency)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxes (8%):</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(cartSubtotal * 0.08, storeData.currency)}
                  </span>
                </div>
                <div className="flex justify-between font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Authorized Charge:</span>
                  <span className="text-emerald-600">
                    {formatCurrency(
                      cartSubtotal + (cartSubtotal >= 75 ? 0 : 9.99) + cartSubtotal * 0.08,
                      storeData.currency
                    )}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {isSubmittingOrder ? "Authorizing Payment..." : "Complete Order & Pay (Test Mode)"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmed View */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Order Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Order Number: <strong>{confirmedOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Total Paid:</span>
                <span className="font-black text-emerald-600">
                  {formatCurrency(confirmedOrder.totalAmount, confirmedOrder.currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping Recipient:</span>
                <span className="font-bold text-slate-800">{confirmedOrder.shippingAddress?.name}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Fulfillment Status:</span>
                <span className="font-bold text-indigo-600">
                  {confirmedOrder.fulfillment?.status || "IN_TRANSIT"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedOrder(null)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500 bg-white mt-16">
        <p className="mb-1">{theme?.footer?.aboutText || `${storeData.name} - Quality curated goods.`}</p>
        <p>{theme?.footer?.copyright || `© ${new Date().getFullYear()} ${storeData.name}. Powered by DropPilot.`}</p>
      </footer>
    </div>
  );
}
