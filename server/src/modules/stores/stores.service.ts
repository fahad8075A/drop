import { memoryDb } from "../../services/db.js";
import crypto from "crypto";

export class StoresService {
  async listUserStores(userId: string) {
    const memberships = memoryDb.memberships.filter((m) => m.userId === userId);
    const storeIds = memberships.map((m) => m.storeId);
    return memoryDb.stores
      .filter((s) => storeIds.includes(s.id))
      .map((s) => {
        const mem = memberships.find((m) => m.storeId === s.id);
        const template = memoryDb.templates.find((t) => t.id === s.templateId);
        return {
          ...s,
          myRole: mem?.role,
          templateName: template?.name,
        };
      });
  }

  async getStoreById(storeId: string) {
    const store = memoryDb.stores.find((s) => s.id === storeId);
    if (!store) {
      throw new Error("Store not found.");
    }
    const template = memoryDb.templates.find((t) => t.id === store.templateId);
    const themeConfig = memoryDb.themeConfigs.find((tc) => tc.storeId === store.id && tc.isPublished);
    return {
      ...store,
      template,
      themeConfig,
    };
  }

  async createStore(userId: string, data: { name: string; slug: string; templateId?: string; currency?: string; locale?: string }) {
    // 1. Slug uniqueness
    const normalizedSlug = data.slug.toLowerCase().trim();
    const existing = memoryDb.stores.find((s) => s.slug === normalizedSlug);
    if (existing) {
      throw new Error(`The slug '${normalizedSlug}' is already claimed by another store.`);
    }

    // 2. Entitlement check: verify user has an active paid subscription
    const subscription = memoryDb.subscriptions.find((s) => s.userId === userId && s.status === "ACTIVE");
    if (!subscription) {
      throw new Error(
        "Active paid subscription required. Please select a plan and complete your payment with Razorpay."
      );
    }
    const plan = memoryDb.plans.find((p) => p.id === subscription.planId);
    const currentOwnedStores = memoryDb.memberships.filter((m) => m.userId === userId && m.role === "OWNER").length;

    const maxAllowed = plan ? plan.maxStores : 1;
    if (currentOwnedStores >= maxAllowed) {
      throw new Error(
        `Subscription plan limit reached. Your current plan allows up to ${maxAllowed} store(s). Please upgrade your subscription to create more stores.`
      );
    }

    // Default template if unspecified
    const templateId = data.templateId || memoryDb.templates[0].id;
    const template = memoryDb.templates.find((t) => t.id === templateId) || memoryDb.templates[0];

    const newStore = {
      id: `str_${crypto.randomUUID().slice(0, 8)}`,
      name: data.name,
      slug: normalizedSlug,
      status: "DRAFT" as const,
      currency: data.currency || "USD",
      locale: data.locale || "en-US",
      templateId: template.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryDb.stores.push(newStore);

    // Add membership for owner
    memoryDb.memberships.push({
      id: `mem_${crypto.randomUUID().slice(0, 8)}`,
      userId,
      storeId: newStore.id,
      role: "OWNER" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Seed default theme config for this store
    const defaultThemeData = {
      colors: {
        primary: "#0f172a",
        background: "#ffffff",
        foreground: "#0f172a",
        accent: "#0284c7",
        muted: "#64748b",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingFont: "Inter, sans-serif",
      },
      header: {
        showAnnouncement: true,
        announcementText: `Welcome to ${newStore.name} - Official Store`,
        navigation: [
          { label: "Shop All", href: "#products" },
          { label: "About", href: "#about" },
        ],
      },
      hero: {
        headline: `Curated Dropshipping by ${newStore.name}`,
        subheadline: "Hand-picked essentials delivered worldwide with verified supplier tracking.",
        buttonText: "Browse Collection",
        buttonLink: "#products",
        backgroundImageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
      },
      sections: {
        showFeaturedProducts: true,
        showCategories: true,
        showPromotions: true,
        showNewsletter: true,
      },
      footer: {
        aboutText: `${newStore.name} brings quality trending products directly to your doorstep.`,
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
        copyright: `© ${new Date().getFullYear()} ${newStore.name}. Powered by DropPilot.`,
      },
    };

    // Both draft and published initial configs
    memoryDb.themeConfigs.push(
      {
        id: `thm_${crypto.randomUUID().slice(0, 8)}`,
        storeId: newStore.id,
        templateId: template.id,
        version: 1,
        isPublished: true,
        config: defaultThemeData,
      },
      {
        id: `thm_${crypto.randomUUID().slice(0, 8)}`,
        storeId: newStore.id,
        templateId: template.id,
        version: 1,
        isPublished: false,
        config: defaultThemeData,
      }
    );

    // Audit log
    memoryDb.auditLogs.push({
      id: `aud_${crypto.randomUUID().slice(0, 8)}`,
      userId,
      storeId: newStore.id,
      action: "STORE_CREATED",
      metadata: { name: newStore.name, slug: newStore.slug },
      createdAt: new Date().toISOString(),
    });

    return newStore;
  }

  async updateStore(storeId: string, data: any) {
    const store = memoryDb.stores.find((s) => s.id === storeId);
    if (!store) {
      throw new Error("Store not found.");
    }
    if (data.name) store.name = data.name;
    if (data.currency) store.currency = data.currency;
    if (data.locale) store.locale = data.locale;
    if (data.templateId) store.templateId = data.templateId;
    store.updatedAt = new Date().toISOString();
    return store;
  }

  async publishStore(storeId: string) {
    const store = memoryDb.stores.find((s) => s.id === storeId);
    if (!store) {
      throw new Error("Store not found.");
    }
    store.status = "PUBLISHED";
    store.updatedAt = new Date().toISOString();

    // Copy draft theme to published
    const draftConfig = memoryDb.themeConfigs.find((tc) => tc.storeId === storeId && !tc.isPublished);
    if (draftConfig) {
      let publishedConfig = memoryDb.themeConfigs.find((tc) => tc.storeId === storeId && tc.isPublished);
      if (publishedConfig) {
        publishedConfig.config = JSON.parse(JSON.stringify(draftConfig.config));
        publishedConfig.version += 1;
        publishedConfig.updatedAt = new Date().toISOString();
      }
    }

    return store;
  }
}

export const storesService = new StoresService();
