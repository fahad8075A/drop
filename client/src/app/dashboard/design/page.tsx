"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../lib/api";
import {
  Palette,
  Eye,
  Save,
  Send,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Layout,
  Sliders,
} from "lucide-react";

export default function WebsiteBuilderPage() {
  const { activeStore } = useAuth();
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [themeConfig, setThemeConfig] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!activeStore) return;

    Promise.all([
      api.get("/templates"),
      api.get(`/templates/stores/${activeStore.id}`),
    ]).then(([tmpls, themeData]) => {
      setTemplates(tmpls || []);
      setSelectedTemplateId(activeStore.templateId || tmpls[0]?.id || "");
      if (themeData?.draft) {
        setThemeConfig(themeData.draft);
      }
    });
  }, [activeStore]);

  const handleSaveDraft = async () => {
    if (!activeStore || !themeConfig) return;
    setIsSaving(true);
    setNotification(null);
    try {
      await api.put(`/templates/stores/${activeStore.id}/draft`, {
        templateId: selectedTemplateId,
        config: themeConfig,
      });
      setNotification({ type: "success", message: "Draft theme configuration saved successfully." });
    } catch (err: any) {
      setNotification({ type: "error", message: err?.message || "Failed to save draft." });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishLive = async () => {
    if (!activeStore || !themeConfig) return;
    setIsPublishing(true);
    setNotification(null);
    try {
      await api.put(`/templates/stores/${activeStore.id}/draft`, {
        templateId: selectedTemplateId,
        config: themeConfig,
      });
      await api.post(`/templates/stores/${activeStore.id}/publish`);
      setNotification({
        type: "success",
        message: "Theme published! Live storefront is now updated with your changes.",
      });
    } catch (err: any) {
      setNotification({ type: "error", message: err?.message || "Failed to publish theme." });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!activeStore || !themeConfig) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading visual theme customizer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-600" />
            <span>Storefront Website Builder</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize typography, branding colors, hero sections, and announcement banners with live preview.
          </p>
        </div>

        {/* Viewport & Actions */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setDeviceView("desktop")}
              className={`p-1.5 rounded-lg transition-colors ${
                deviceView === "desktop" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceView("tablet")}
              className={`p-1.5 rounded-lg transition-colors ${
                deviceView === "tablet" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceView("mobile")}
              className={`p-1.5 rounded-lg transition-colors ${
                deviceView === "mobile" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            disabled={isSaving}
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            disabled={isPublishing}
            onClick={handlePublishLive}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/25 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{isPublishing ? "Publishing..." : "Publish Live"}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
              : "bg-rose-50 text-rose-800 border border-rose-200 font-medium"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 space-y-6 max-h-[820px] overflow-y-auto">
          {/* Template Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" /> Active Storefront Template
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500 font-medium"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (v{t.version})
                </option>
              ))}
            </select>
          </div>

          {/* Brand Colors */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-600" /> Brand Color Palette
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Primary Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeConfig.colors?.primary || "#0f172a"}
                    onChange={(e) =>
                      setThemeConfig({
                        ...themeConfig,
                        colors: { ...themeConfig.colors, primary: e.target.value },
                      })
                    }
                    className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={themeConfig.colors?.primary || "#0f172a"}
                    onChange={(e) =>
                      setThemeConfig({
                        ...themeConfig,
                        colors: { ...themeConfig.colors, primary: e.target.value },
                      })
                    }
                    className="w-24 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Accent Highlight</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeConfig.colors?.accent || "#4f46e5"}
                    onChange={(e) =>
                      setThemeConfig({
                        ...themeConfig,
                        colors: { ...themeConfig.colors, accent: e.target.value },
                      })
                    }
                    className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={themeConfig.colors?.accent || "#4f46e5"}
                    onChange={(e) =>
                      setThemeConfig({
                        ...themeConfig,
                        colors: { ...themeConfig.colors, accent: e.target.value },
                      })
                    }
                    className="w-24 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Announcement Banner
              </label>
              <input
                type="checkbox"
                checked={themeConfig.header?.showAnnouncement ?? true}
                onChange={(e) =>
                  setThemeConfig({
                    ...themeConfig,
                    header: { ...themeConfig.header, showAnnouncement: e.target.checked },
                  })
                }
                className="rounded border-slate-300 text-indigo-600 focus:ring-0"
              />
            </div>
            <input
              type="text"
              value={themeConfig.header?.announcementText || ""}
              onChange={(e) =>
                setThemeConfig({
                  ...themeConfig,
                  header: { ...themeConfig.header, announcementText: e.target.value },
                })
              }
              placeholder="e.g. Free worldwide insured shipping on orders over $75"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>

          {/* Hero Banner Content */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-indigo-600" /> Hero Section Content
            </label>
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Headline</span>
              <input
                type="text"
                value={themeConfig.hero?.headline || ""}
                onChange={(e) =>
                  setThemeConfig({
                    ...themeConfig,
                    hero: { ...themeConfig.hero, headline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500 font-medium"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Subheadline</span>
              <textarea
                rows={2}
                value={themeConfig.hero?.subheadline || ""}
                onChange={(e) =>
                  setThemeConfig({
                    ...themeConfig,
                    hero: { ...themeConfig.hero, subheadline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Button Text</span>
                <input
                  type="text"
                  value={themeConfig.hero?.buttonText || ""}
                  onChange={(e) =>
                    setThemeConfig({
                      ...themeConfig,
                      hero: { ...themeConfig.hero, buttonText: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Button Link</span>
                <input
                  type="text"
                  value={themeConfig.hero?.buttonLink || "#products"}
                  onChange={(e) =>
                    setThemeConfig({
                      ...themeConfig,
                      hero: { ...themeConfig.hero, buttonLink: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section Visibility Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" /> Section Toggles
            </label>
            {[
              { key: "showFeaturedProducts", label: "Featured Products Grid" },
              { key: "showCategories", label: "Category Filters" },
              { key: "showPromotions", label: "Promotional Banner" },
              { key: "showNewsletter", label: "Newsletter Capture" },
            ].map((sec) => (
              <div key={sec.key} className="flex items-center justify-between text-xs text-slate-700">
                <span>{sec.label}</span>
                <input
                  type="checkbox"
                  checked={themeConfig.sections?.[sec.key] ?? true}
                  onChange={(e) =>
                    setThemeConfig({
                      ...themeConfig,
                      sections: { ...themeConfig.sections, [sec.key]: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Live Responsive Preview Frame */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="text-xs text-slate-500 mb-2 flex items-center justify-between w-full px-2">
            <span className="font-semibold text-slate-700">Live Viewport Canvas</span>
            <a
              href={`/store/${activeStore.slug}`}
              target="_blank"
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div
            className={`border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
              deviceView === "mobile"
                ? "w-[375px] h-[667px]"
                : deviceView === "tablet"
                ? "w-[768px] h-[750px]"
                : "w-full h-[750px]"
            }`}
          >
            <div className="h-full overflow-y-auto bg-slate-900 text-slate-100 flex flex-col justify-between">
              <div>
                {/* Announcement Bar */}
                {themeConfig.header?.showAnnouncement && (
                  <div
                    style={{ backgroundColor: themeConfig.colors?.accent || "#4f46e5" }}
                    className="py-1.5 px-4 text-center text-xs font-bold text-white tracking-wide"
                  >
                    {themeConfig.header?.announcementText || "✨ Welcome to our official store"}
                  </div>
                )}

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/40">
                  <span className="font-extrabold text-base tracking-tight text-white">{activeStore.name}</span>
                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <span>Shop</span>
                    <span>About</span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-bold">Cart (0)</span>
                  </div>
                </div>

                {/* Hero */}
                <div
                  className="py-16 px-6 text-center relative overflow-hidden"
                  style={{
                    backgroundColor: themeConfig.colors?.primary || "#0f172a",
                  }}
                >
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                    {themeConfig.hero?.headline || "Curated Products for You"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
                    {themeConfig.hero?.subheadline || "Browse our catalog of high quality items."}
                  </p>
                  <button
                    style={{ backgroundColor: themeConfig.colors?.accent || "#4f46e5" }}
                    className="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md"
                  >
                    {themeConfig.hero?.buttonText || "Shop Collection"}
                  </button>
                </div>

                {/* Section Preview Grid */}
                {themeConfig.sections?.showFeaturedProducts && (
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-white mb-4">Featured Collection</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                          <div className="h-24 bg-slate-700 rounded-lg mb-2" />
                          <div className="h-3 w-3/4 bg-slate-600 rounded mb-1" />
                          <div className="h-3 w-1/4 bg-indigo-400 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-800 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} {activeStore.name}. Powered by DropPilot.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
