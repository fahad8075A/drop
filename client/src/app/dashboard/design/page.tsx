"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../lib/api";
import { StoreRenderer } from "@/components/storefront/StoreRenderer";
import {
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Send,
  Layers,
  Palette,
  MessageSquare,
  ShoppingBag,
  Undo2,
  Eye,
  RefreshCw,
  Sliders,
  Store,
  ArrowRight,
  ChevronRight,
  Package,
} from "lucide-react";

const EXAMPLE_PROMPTS = [
  {
    title: "UrbanStep Sneakers",
    category: "Footwear & Streetwear",
    icon: "👟",
    prompt:
      "Build a premium sneaker ecommerce store named UrbanStep. Use a black and white theme with bold typography, a full-width hero banner, featured collections, best-selling sneakers, product filters, customer reviews, promotional banners, a shopping cart, and a responsive checkout. Make the design modern, minimal, and premium.",
  },
  {
    title: "Artisan Roast Coffee",
    category: "Specialty Beverages",
    icon: "☕",
    prompt:
      "Create an artisanal specialty coffee store named Artisan Roast with a warm espresso and amber palette, single-origin bean descriptions, brewing gear, tasting notes, customer testimonials, and subscription box banners.",
  },
  {
    title: "Nordic Living Atelier",
    category: "Home & Interior Living",
    icon: "🛋️",
    prompt:
      "Design a Scandinavian minimalist home decor store named Nordic Living Atelier with clean whitespace, warm wood textures, ambient lighting catalog, interior styling tips, and high-converting cart.",
  },
  {
    title: "Pulse Audio Labs",
    category: "Consumer Tech & Audio",
    icon: "🎧",
    prompt:
      "Build a modern high-contrast tech store named Pulse Audio Labs with wireless noise-cancelling headphones, smart wearable gadgets, specification charts, verified reviews, and express single-click checkout.",
  },
];

const GENERATION_STEPS = [
  "Analyzing ecommerce prompt & brand intent...",
  "Synthesizing color palette & typography pairing...",
  "Structuring high-converting section layouts...",
  "Curating high-margin dropshipping SKUs & imagery...",
  "Compiling responsive storefront preview...",
];

export default function WebsiteBuilderPage() {
  const { activeStore, user, stores } = useAuth();

  // Mode: "prompt" (Initial generation) | "studio" (Split-screen live editor)
  const [viewMode, setViewMode] = useState<"prompt" | "studio">("prompt");
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"ai" | "theme" | "sections" | "products">("ai");

  // Prompt Form State
  const [prompt, setPrompt] = useState(
    "Build a premium sneaker ecommerce store named UrbanStep. Use a black and white theme with bold typography, a full-width hero banner, featured collections, best-selling sneakers, product filters, customer reviews, promotional banners, a shopping cart, and a responsive checkout. Make the design modern, minimal, and premium."
  );
  const [storeName, setStoreName] = useState("UrbanStep Kicks");
  const [category, setCategory] = useState("Footwear & Streetwear");
  const [primaryColor, setPrimaryColor] = useState("#0f172a");
  const [accentColor, setAccentColor] = useState("#e11d48");
  const [headingFont, setHeadingFont] = useState("Plus Jakarta Sans");

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Store Studio State
  const [storeConfig, setStoreConfig] = useState<any | null>(null);
  const [aiFollowUpPrompt, setAiFollowUpPrompt] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const [aiHistory, setAiHistory] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Store generated! You can tell me to change colors, modify copy, add discount banners, or reorganize sections.",
    },
  ]);

  // Saving & Publishing State
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentStoreSlug, setCurrentStoreSlug] = useState("");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Load existing theme if active store exists
  useEffect(() => {
    if (!activeStore) return;
    setCurrentStoreSlug(activeStore.slug);

    api
      .get(`/templates/stores/${activeStore.id}`)
      .then((themeData) => {
        if (themeData?.draft || themeData?.published) {
          const cfg = themeData.draft || themeData.published;
          if (cfg.brand && cfg.sections) {
            setStoreConfig(cfg);
            setViewMode("studio");
          }
        }
      })
      .catch((e) => console.log("No existing theme found:", e));
  }, [activeStore]);

  // Generate Store Handler
  const handleGenerateStore = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationStep(0);
    setNotification(null);

    // Animate progress steps
    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const generated = await api.post("/ai/generate", {
        prompt,
        storeName: storeName || undefined,
        category: category || undefined,
        brandColors: {
          primary: primaryColor,
          accent: accentColor,
        },
        typography: {
          headingFont,
          bodyFont: "Inter",
        },
      });

      clearInterval(stepInterval);
      setStoreConfig(generated);
      setCurrentStoreSlug(generated.brand.slug);
      setViewMode("studio");
      setNotification({
        type: "success",
        message: `Generated storefront for "${generated.brand.name}"! Preview and customize below.`,
      });
    } catch (err: any) {
      clearInterval(stepInterval);
      setNotification({
        type: "error",
        message: err?.message || "Failed to generate store configuration. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Conversational AI Modification Handler
  const handleAiModify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiFollowUpPrompt.trim() || !storeConfig) return;

    const userMsg = aiFollowUpPrompt.trim();
    setAiFollowUpPrompt("");
    setIsModifying(true);
    setAiHistory((prev) => [...prev, { role: "user", text: userMsg }]);

    try {
      const result = await api.post("/ai/modify", {
        prompt: userMsg,
        currentConfig: storeConfig,
      });

      setStoreConfig(result.updatedConfig);
      setAiHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.changesSummary || "Updated your storefront configuration.",
        },
      ]);
    } catch (err: any) {
      setAiHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Could not apply modification: ${err?.message || "Please try a different prompt."}`,
        },
      ]);
    } finally {
      setIsModifying(false);
    }
  };

  // Save Draft Handler
  const handleSaveDraft = async () => {
    if (!storeConfig) return;
    setIsSaving(true);
    setNotification(null);

    try {
      const result = await api.post("/ai/save", {
        storeId: activeStore?.id,
        name: storeConfig.brand.name,
        slug: currentStoreSlug || storeConfig.brand.slug,
        config: storeConfig,
        products: storeConfig.sampleProducts,
        publishNow: false,
      });

      setNotification({
        type: "success",
        message: "Draft saved successfully. Your changes remain isolated until publication.",
      });
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err?.message || "Failed to save draft. Check subscription store quota.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Live Store Handler
  const handlePublishStore = async () => {
    if (!storeConfig) return;
    setIsPublishing(true);
    setNotification(null);

    try {
      const result = await api.post("/ai/save", {
        storeId: activeStore?.id,
        name: storeConfig.brand.name,
        slug: currentStoreSlug || storeConfig.brand.slug,
        config: storeConfig,
        products: storeConfig.sampleProducts,
        publishNow: true,
      });

      setPublishedUrl(result.publicUrl);
      setNotification({
        type: "success",
        message: `Store published live! Available at ${result.publicUrl}`,
      });
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err?.message || "Failed to publish store. Verify subscription plan limits.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 shadow-xs ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          {publishedUrl && (
            <a
              href={publishedUrl}
              target="_blank"
              className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-colors flex items-center gap-1"
            >
              <span>Visit Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* MODE 1: PROMPT INPUT GENERATOR INTERFACE */}
      {viewMode === "prompt" && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold border border-white/10 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Autonomous Prompt-to-Store Engine</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Generate an Entire Ecommerce Brand From A Single Prompt
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
                Describe your desired products, aesthetic, and brand identity. DropPilot synthesizes
                responsive storefront layouts, color palettes, curated supplier SKUs, and checkout flows in seconds.
              </p>
            </div>
          </div>

          {/* Prompt Form Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <form onSubmit={handleGenerateStore} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Describe Your Desired Ecommerce Store
                </label>
                <textarea
                  rows={4}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Build a premium sneaker ecommerce store named UrbanStep. Use a black and white theme with bold typography, a full-width hero banner, featured collections, best-selling sneakers, customer reviews, promotional banners, and responsive checkout..."
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner leading-relaxed"
                />
              </div>

              {/* 1-Click Popular Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Or pick a proven high-converting blueprint:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EXAMPLE_PROMPTS.map((ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(ex.prompt);
                        setStoreName(ex.title);
                        setCategory(ex.category);
                      }}
                      className="p-3.5 text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300 transition-all shadow-2xs group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xl mb-1 block">{ex.icon}</span>
                        <div className="font-black text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {ex.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">{ex.category}</div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 mt-2 block">
                        Use Blueprint →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Brand Settings Collapsible */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Store Brand Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. UrbanStep Kicks"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Industry Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Footwear & Streetwear"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Generation Button & Progress */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isGenerating ? "Synthesizing Complete Storefront..." : "Generate Store with AI"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Multi-step progress animation */}
              {isGenerating && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span>{GENERATION_STEPS[generationStep]}</span>
                    </span>
                    <span>Step {generationStep + 1} of 5</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-indigo-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
                      style={{ width: `${((generationStep + 1) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODE 2: SPLIT-PANE LIVE STUDIO & CONVERSATIONAL EDITOR */}
      {viewMode === "studio" && storeConfig && (
        <div className="space-y-4">
          {/* Top Action & Viewport Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Store identity and status */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("prompt")}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
              >
                ← New Prompt
              </button>
              <div>
                <span className="font-black text-base text-slate-900">
                  {storeConfig.brand.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">
                  Slug: /{currentStoreSlug || storeConfig.brand.slug}
                </span>
              </div>
            </div>

            {/* Center: Device Viewport Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl inline-flex gap-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setDeviceView("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  deviceView === "desktop"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceView("tablet")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  deviceView === "tablet"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet (768px)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceView("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  deviceView === "mobile"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>{isSaving ? "Saving..." : "Save Draft"}</span>
              </button>

              <button
                type="button"
                onClick={handlePublishStore}
                disabled={isPublishing}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPublishing ? "Publishing..." : "Publish Live Store"}</span>
              </button>

              {publishedUrl && (
                <a
                  href={publishedUrl}
                  target="_blank"
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  title="Open Live Store in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Split Screen Studio Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT STUDIO PANEL: Tabs (AI Assistant, Theme, Sections, Products) */}
            <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm p-5 space-y-4">
              {/* Studio Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    activeTab === "ai"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Copilot</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("theme")}
                  className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    activeTab === "theme"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Styles</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sections")}
                  className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    activeTab === "sections"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sections</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    activeTab === "products"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>SKUs</span>
                </button>
              </div>

              {/* TAB 1: CONVERSATIONAL AI COPILOT */}
              {activeTab === "ai" && (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900">
                    💡 <strong>Conversational Assistant:</strong> Type any change to adjust styling,
                    colors, banners, or layout in real-time.
                  </div>

                  {/* Chat Log */}
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {aiHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white ml-6 text-right"
                            : "bg-slate-50 border border-slate-200/80 text-slate-800 mr-6"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                    {isModifying && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span>AI updating store configuration...</span>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      "Change theme to dark green",
                      "Make hero banner more premium",
                      "Add 20% off promo banner",
                      "Switch to monochrome black & white",
                    ].map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAiFollowUpPrompt(sug)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition-colors"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleAiModify} className="pt-2 flex gap-2">
                    <input
                      type="text"
                      required
                      value={aiFollowUpPrompt}
                      onChange={(e) => setAiFollowUpPrompt(e.target.value)}
                      placeholder="e.g. Change accent to crimson red..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-indigo-600 focus:bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isModifying || !aiFollowUpPrompt.trim()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: MANUAL THEME & STYLES */}
              {activeTab === "theme" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Store Title</label>
                    <input
                      type="text"
                      value={storeConfig.brand.name}
                      onChange={(e) =>
                        setStoreConfig({
                          ...storeConfig,
                          brand: { ...storeConfig.brand, name: e.target.value },
                          header: { ...storeConfig.header, logoText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Top Announcement</label>
                    <input
                      type="text"
                      value={storeConfig.header.announcementText}
                      onChange={(e) =>
                        setStoreConfig({
                          ...storeConfig,
                          header: { ...storeConfig.header, announcementText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Primary Color</label>
                      <input
                        type="color"
                        value={storeConfig.theme.primaryColor}
                        onChange={(e) =>
                          setStoreConfig({
                            ...storeConfig,
                            theme: { ...storeConfig.theme, primaryColor: e.target.value },
                          })
                        }
                        className="w-full h-8 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Accent Color</label>
                      <input
                        type="color"
                        value={storeConfig.theme.accentColor}
                        onChange={(e) =>
                          setStoreConfig({
                            ...storeConfig,
                            theme: { ...storeConfig.theme, accentColor: e.target.value },
                          })
                        }
                        className="w-full h-8 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SECTIONS VISIBILITY */}
              {activeTab === "sections" && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Toggle Page Sections
                  </span>
                  {storeConfig.sections.map((sec: any, idx: number) => (
                    <div
                      key={sec.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 capitalize">
                          {sec.type.replace("_", " ")}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sec.data?.title || sec.data?.headline || "Dynamic Section"}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={sec.enabled !== false}
                        onChange={(e) => {
                          const updated = [...storeConfig.sections];
                          updated[idx] = { ...sec, enabled: e.target.checked };
                          setStoreConfig({ ...storeConfig, sections: updated });
                        }}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SAMPLE PRODUCTS & PRICING */}
              {activeTab === "products" && (
                <div className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-1">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block">
                    Curated SKU Inventory ({storeConfig.sampleProducts?.length || 0})
                  </span>
                  {(storeConfig.sampleProducts || []).map((p: any, idx: number) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={p.images?.[0]}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="overflow-hidden flex-1">
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => {
                              const updated = [...storeConfig.sampleProducts];
                              updated[idx] = { ...p, title: e.target.value };
                              setStoreConfig({ ...storeConfig, sampleProducts: updated });
                            }}
                            className="w-full font-bold text-slate-900 bg-transparent outline-none truncate"
                          />
                          <span className="text-[10px] text-slate-400">{p.sku}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500">Retail Price ($)</label>
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => {
                              const updated = [...storeConfig.sampleProducts];
                              updated[idx] = { ...p, price: parseFloat(e.target.value) || 0 };
                              setStoreConfig({ ...storeConfig, sampleProducts: updated });
                            }}
                            className="w-full px-2 py-1 rounded bg-white border border-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500">Compare Price ($)</label>
                          <input
                            type="number"
                            value={p.compareAtPrice || ""}
                            onChange={(e) => {
                              const updated = [...storeConfig.sampleProducts];
                              updated[idx] = {
                                ...p,
                                compareAtPrice: parseFloat(e.target.value) || null,
                              };
                              setStoreConfig({ ...storeConfig, sampleProducts: updated });
                            }}
                            className="w-full px-2 py-1 rounded bg-white border border-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT STUDIO PANEL: Real-time Device Frame Canvas */}
            <div className="lg:col-span-8 flex justify-center bg-slate-100/80 p-4 sm:p-8 rounded-3xl border border-slate-200/90 overflow-hidden min-h-[700px]">
              <div
                className={`transition-all duration-300 bg-white shadow-2xl overflow-y-auto ${
                  deviceView === "desktop"
                    ? "w-full rounded-2xl border border-slate-300 max-h-[820px]"
                    : deviceView === "tablet"
                    ? "w-[768px] rounded-[36px] border-[12px] border-slate-800 max-h-[820px]"
                    : "w-[375px] rounded-[44px] border-[14px] border-slate-900 max-h-[780px]"
                }`}
              >
                {/* Embedded dynamic storefront */}
                <StoreRenderer config={storeConfig} isInteractive={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
