import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize official Prisma Client instance
export const prisma = new PrismaClient();

// In-Memory Database store with complete relation mapping for local dev, offline mode, & fast testing
export class MemoryDatabase {
  users: any[] = [];
  stores: any[] = [];
  memberships: any[] = [];
  templates: any[] = [];
  themeConfigs: any[] = [];
  plans: any[] = [];
  subscriptions: any[] = [];
  products: any[] = [];
  variants: any[] = [];
  categories: any[] = [];
  suppliers: any[] = [];
  supplierConnections: any[] = [];
  productSupplierLinks: any[] = [];
  customers: any[] = [];
  orders: any[] = [];
  orderItems: any[] = [];
  fulfillments: any[] = [];
  auditLogs: any[] = [];
  notifications: any[] = [];

  constructor() {
    this.seedDefaults();
  }

  seedDefaults() {
    const adminHash = bcrypt.hashSync("AdminPass123!", 10);
    const ownerHash = bcrypt.hashSync("OwnerPass123!", 10);

    // 1. Users
    const adminUser = {
      id: "usr_admin_1",
      email: "admin@droppilot.com",
      passwordHash: adminHash,
      name: "Platform Administrator",
      role: "PLATFORM_ADMIN",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const alexUser = {
      id: "usr_alex_1",
      email: "alex@droppilot.com",
      passwordHash: ownerHash,
      name: "Alex Vance",
      role: "USER",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sarahUser = {
      id: "usr_sarah_1",
      email: "sarah@droppilot.com",
      passwordHash: ownerHash,
      name: "Sarah Connor",
      role: "USER",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(adminUser, alexUser, sarahUser);

    // 2. Plans
    this.plans.push(
      {
        id: "plan_starter",
        code: "STARTER",
        name: "Starter Launch",
        description: "Perfect for new dropshippers launching their first flagship store.",
        monthlyPrice: 29.0,
        yearlyPrice: 290.0,
        currency: "USD",
        maxStores: 1,
        maxProducts: 50,
        customDomains: false,
        supplierSync: true,
        maxTeamMembers: 1,
        analyticsEnabled: false,
        isActive: true,
      },
      {
        id: "plan_pro",
        code: "PRO",
        name: "Scale & Growth",
        description: "For thriving merchants managing multiple niche brands with automation.",
        monthlyPrice: 79.0,
        yearlyPrice: 790.0,
        currency: "USD",
        maxStores: 5,
        maxProducts: 500,
        customDomains: true,
        supplierSync: true,
        maxTeamMembers: 5,
        analyticsEnabled: true,
        isActive: true,
      },
      {
        id: "plan_enterprise",
        code: "ENTERPRISE",
        name: "High Volume Enterprise",
        description: "Unlimited stores, custom contracts, dedicated fulfillment agent & SLA.",
        monthlyPrice: 199.0,
        yearlyPrice: 1990.0,
        currency: "USD",
        maxStores: 50,
        maxProducts: 10000,
        customDomains: true,
        supplierSync: true,
        maxTeamMembers: 25,
        analyticsEnabled: true,
        isActive: true,
      }
    );

    // Subscriptions for demo users
    this.subscriptions.push(
      {
        id: "sub_alex_1",
        userId: alexUser.id,
        planId: "plan_pro",
        status: "ACTIVE",
        provider: "RAZORPAY",
        providerSubscriptionId: "sub_rzp_mock_alex",
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancelAtPeriodEnd: false,
      },
      {
        id: "sub_sarah_1",
        userId: sarahUser.id,
        planId: "plan_starter",
        status: "ACTIVE",
        provider: "RAZORPAY",
        providerSubscriptionId: "sub_rzp_mock_sarah",
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancelAtPeriodEnd: false,
      }
    );

    // 3. Templates
    this.templates.push(
      {
        id: "tmpl_minimal",
        name: "Minimal Modern",
        code: "minimal-modern",
        description: "Clean aesthetic, generous whitespace, refined typography, perfect for premium artisanal goods.",
        previewUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        version: "1.0.0",
        isDefault: true,
      },
      {
        id: "tmpl_fashion",
        name: "Fashion & Lifestyle",
        code: "fashion-lifestyle",
        description: "Bold editorial visuals, dynamic promotional banners, and visual story-driven lookbooks.",
        previewUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
        version: "1.0.0",
        isDefault: false,
      },
      {
        id: "tmpl_gadgets",
        name: "Electronics & Gadgets",
        code: "electronics-gadgets",
        description: "High-contrast dark-mode highlights, technical specifications, and interactive feature matrices.",
        previewUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        version: "1.0.0",
        isDefault: false,
      }
    );

    // 4. Stores
    const storeLumix = {
      id: "str_lumix_1",
      name: "Lumix Minimal Studio",
      slug: "lumix",
      status: "PUBLISHED",
      currency: "USD",
      locale: "en-US",
      templateId: "tmpl_minimal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const storePulse = {
      id: "str_pulse_1",
      name: "Pulse Gadgets Hub",
      slug: "pulsegadgets",
      status: "PUBLISHED",
      currency: "USD",
      locale: "en-US",
      templateId: "tmpl_gadgets",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const storeVelvet = {
      id: "str_velvet_1",
      name: "Velvet Lifestyle",
      slug: "velvet",
      status: "PUBLISHED",
      currency: "USD",
      locale: "en-US",
      templateId: "tmpl_fashion",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.stores.push(storeLumix, storePulse, storeVelvet);

    // Memberships
    this.memberships.push(
      { id: "mem_1", userId: alexUser.id, storeId: storeLumix.id, role: "OWNER" },
      { id: "mem_2", userId: alexUser.id, storeId: storePulse.id, role: "OWNER" },
      { id: "mem_3", userId: sarahUser.id, storeId: storeVelvet.id, role: "OWNER" }
    );

    // Theme Configs
    this.themeConfigs.push(
      {
        id: "thm_lumix_pub",
        storeId: storeLumix.id,
        templateId: "tmpl_minimal",
        version: 1,
        isPublished: true,
        config: {
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
            announcementText: "✨ Free worldwide insured shipping on all orders over $75",
            navigation: [
              { label: "Shop All", href: "/shop" },
              { label: "Curated", href: "/curated" },
              { label: "Our Story", href: "/about" },
            ],
          },
          hero: {
            headline: "Elevated Living Through Quiet Design",
            subheadline: "Thoughtfully engineered essentials crafted for the modern workspace.",
            buttonText: "Explore Collection",
            buttonLink: "#products",
            backgroundImageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80",
          },
          sections: {
            showFeaturedProducts: true,
            showCategories: true,
            showPromotions: true,
            showNewsletter: true,
          },
          footer: {
            aboutText: "Lumix Minimal Studio is an independent design laboratory focusing on tactile elegance.",
            links: [
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Track Order", href: "/track" },
            ],
            copyright: "© 2026 Lumix Studio. Powered by DropPilot.",
          },
        },
      },
      {
        id: "thm_pulse_pub",
        storeId: storePulse.id,
        templateId: "tmpl_gadgets",
        version: 1,
        isPublished: true,
        config: {
          colors: {
            primary: "#3b82f6",
            background: "#090d16",
            foreground: "#f8fafc",
            accent: "#10b981",
            muted: "#94a3b8",
          },
          typography: {
            fontFamily: "system-ui, sans-serif",
            headingFont: "system-ui, sans-serif",
          },
          header: {
            showAnnouncement: true,
            announcementText: "⚡ NEXT-GEN SMART TECH: SAME-DAY DISPATCH AVAILABLE",
            navigation: [
              { label: "All Gear", href: "/gear" },
              { label: "Audio", href: "/audio" },
              { label: "Wearables", href: "/wearables" },
            ],
          },
          hero: {
            headline: "Future-Ready Smart Gear & Audio",
            subheadline: "Precision wireless noise cancellation, magnetic docks, and ergonomic tech.",
            buttonText: "Shop New Tech",
            buttonLink: "#products",
            backgroundImageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1600&q=80",
          },
          sections: {
            showFeaturedProducts: true,
            showCategories: true,
            showPromotions: true,
            showNewsletter: true,
          },
          footer: {
            aboutText: "Pulse Gadgets tests every unit for audio latency, thermal efficiency, and battery endurance.",
            links: [
              { label: "Warranty", href: "/warranty" },
              { label: "Support", href: "/support" },
            ],
            copyright: "© 2026 Pulse Gadgets Hub. Built on DropPilot.",
          },
        },
      }
    );

    // 5. Products for Lumix
    const p1 = {
      id: "prod_lumix_1",
      storeId: storeLumix.id,
      title: "Nordic Minimalist Desk Mat (Natural Wool & Vegan Leather)",
      slug: "nordic-minimalist-desk-mat",
      description: "Handcrafted dual-sided desk mat providing smooth glide for mice and cushioned wrist comfort.",
      price: 49.99,
      compareAtPrice: 65.0,
      supplierCost: 14.5,
      sku: "LUM-MAT-001",
      inventoryCount: 120,
      status: "ACTIVE",
      images: [
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80",
      ],
      createdAt: new Date().toISOString(),
    };

    const p2 = {
      id: "prod_lumix_2",
      storeId: storeLumix.id,
      title: "Anodized Aluminum Laptop Stand",
      slug: "anodized-aluminum-laptop-stand",
      description: "Ergonomic 15-degree tilt with integrated cable pass-through and silicon heat dissipation pads.",
      price: 59.0,
      compareAtPrice: 75.0,
      supplierCost: 18.0,
      sku: "LUM-STND-002",
      inventoryCount: 85,
      status: "ACTIVE",
      images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"],
      createdAt: new Date().toISOString(),
    };

    const p3 = {
      id: "prod_lumix_3",
      storeId: storeLumix.id,
      title: "Acoustic Felt Cable Organizers (3-Pack)",
      slug: "acoustic-felt-cable-organizers",
      description: "Magnetic snap organizers that tame desktop cable clutter with acoustic felt texture.",
      price: 19.5,
      compareAtPrice: 28.0,
      supplierCost: 4.2,
      sku: "LUM-ORG-003",
      inventoryCount: 300,
      status: "ACTIVE",
      images: ["https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80"],
      createdAt: new Date().toISOString(),
    };

    // Product for Pulse Gadgets
    const p4 = {
      id: "prod_pulse_1",
      storeId: storePulse.id,
      title: "Aura ANC Spatial Wireless Headphones",
      slug: "aura-anc-spatial-wireless-headphones",
      description: "45dB hybrid active noise cancellation with 40-hour battery and ultra-low latency gaming mode.",
      price: 129.99,
      compareAtPrice: 169.0,
      supplierCost: 42.0,
      sku: "PLS-AURA-01",
      inventoryCount: 45,
      status: "ACTIVE",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
      createdAt: new Date().toISOString(),
    };

    // Product for Velvet Lifestyle (Sarah Connor's store - for tenant testing)
    const p5 = {
      id: "prod_velvet_1",
      storeId: storeVelvet.id,
      title: "Silk Cashmere Autumn Cardigan",
      slug: "silk-cashmere-autumn-cardigan",
      description: "Ultra-soft premium knit cardigan designed for transitional climate layering.",
      price: 110.0,
      compareAtPrice: 145.0,
      supplierCost: 38.0,
      sku: "VLV-CRD-01",
      inventoryCount: 60,
      status: "ACTIVE",
      images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80"],
      createdAt: new Date().toISOString(),
    };

    this.products.push(p1, p2, p3, p4, p5);

    // Variants
    this.variants.push(
      { id: "var_1", productId: p1.id, title: "Midnight Black / Large", price: 49.99, supplierCost: 14.5, inventoryCount: 60 },
      { id: "var_2", productId: p1.id, title: "Warm Grey / Large", price: 49.99, supplierCost: 14.5, inventoryCount: 60 },
      { id: "var_3", productId: p4.id, title: "Matte Black", price: 129.99, supplierCost: 42.0, inventoryCount: 45 }
    );

    // 6. Suppliers
    this.suppliers.push(
      {
        id: "sup_sandbox",
        name: "DropPilot Sandbox Supplier",
        type: "SANDBOX_MOCK",
        apiBaseUrl: "https://sandbox.droppilot.internal/v1",
        isActive: true,
      },
      {
        id: "sup_aliexpress",
        name: "AliExpress Dropshipping API",
        type: "ALIEXPRESS",
        apiBaseUrl: "https://api-sg.aliexpress.com/sync",
        isActive: true,
      },
      {
        id: "sup_cj",
        name: "CJ Dropshipping Global API",
        type: "CJ_DROPSHIPPING",
        apiBaseUrl: "https://developers.cjdropshipping.com/api2.0/v1",
        isActive: true,
      }
    );

    // Supplier connections
    this.supplierConnections.push({
      id: "sconn_lumix_1",
      storeId: storeLumix.id,
      supplierId: "sup_sandbox",
      encryptedCredentials: "mock_encrypted_creds",
      isActive: true,
      lastSyncedAt: new Date().toISOString(),
    });

    // 7. Demo Orders for Lumix
    const demoOrder = {
      id: "ord_lumix_101",
      storeId: storeLumix.id,
      customerId: "cust_demo_1",
      orderNumber: "#1001",
      status: "PAID",
      currency: "USD",
      subtotal: 99.98,
      taxAmount: 8.0,
      shippingAmount: 0.0,
      totalAmount: 107.98,
      shippingAddress: {
        name: "Jordan Lee",
        addressLine1: "742 Evergreen Terrace",
        city: "Springfield",
        state: "OR",
        postalCode: "97477",
        country: "United States",
      },
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    };

    this.orders.push(demoOrder);
    this.orderItems.push(
      {
        id: "oi_1",
        orderId: demoOrder.id,
        productId: p1.id,
        title: p1.title,
        sku: p1.sku,
        quantity: 2,
        priceSnapshot: 49.99,
        currency: "USD",
      }
    );

    this.fulfillments.push({
      id: "ful_1",
      orderId: demoOrder.id,
      storeId: storeLumix.id,
      status: "IN_TRANSIT",
      externalOrderId: "SANDBOX-ORD-99812",
      trackingNumber: "TRK-DP-8839281",
      carrier: "FedEx International",
      trackingUrl: "https://track.droppilot.internal/TRK-DP-8839281",
      retryCount: 0,
      createdAt: new Date().toISOString(),
    });
  }
}

export const memoryDb = new MemoryDatabase();
