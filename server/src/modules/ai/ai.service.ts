import { memoryDb } from "../../services/db.js";
import crypto from "crypto";

export interface GeneratedStoreConfig {
  brand: {
    name: string;
    tagline: string;
    category: string;
    slug: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    cardBackgroundColor: string;
    textColor: string;
    headingFont: string;
    bodyFont: string;
  };
  header: {
    showAnnouncement: boolean;
    announcementText: string;
    logoText: string;
    navLinks: Array<{ label: string; href: string }>;
  };
  sections: Array<{
    id: string;
    type:
      | "hero"
      | "categories"
      | "products"
      | "promo_banner"
      | "reviews"
      | "newsletter"
      | "footer";
    enabled: boolean;
    data: any;
  }>;
  sampleProducts: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    cost: number;
    category: string;
    sku: string;
    images: string[];
    badge?: string;
  }>;
}

export class AiStoreService {
  /**
   * Generates a complete, validated store configuration from a natural-language prompt.
   */
  async generateStoreFromPrompt(params: {
    prompt: string;
    storeName?: string;
    category?: string;
    brandColors?: { primary?: string; accent?: string; background?: string };
    typography?: { headingFont?: string; bodyFont?: string };
  }): Promise<GeneratedStoreConfig> {
    const promptLower = params.prompt.toLowerCase();

    // Detect archetype
    let archetype = "general";
    if (promptLower.includes("sneaker") || promptLower.includes("shoe") || promptLower.includes("kicks") || promptLower.includes("footwear")) {
      archetype = "sneakers";
    } else if (promptLower.includes("coffee") || promptLower.includes("roast") || promptLower.includes("tea") || promptLower.includes("cafe")) {
      archetype = "coffee";
    } else if (promptLower.includes("tech") || promptLower.includes("gadget") || promptLower.includes("audio") || promptLower.includes("headphone") || promptLower.includes("electronics")) {
      archetype = "tech";
    } else if (promptLower.includes("home") || promptLower.includes("living") || promptLower.includes("furniture") || promptLower.includes("decor") || promptLower.includes("minimal")) {
      archetype = "home";
    } else if (promptLower.includes("fashion") || promptLower.includes("apparel") || promptLower.includes("clothing") || promptLower.includes("streetwear") || promptLower.includes("luxury")) {
      archetype = "fashion";
    } else if (promptLower.includes("skin") || promptLower.includes("beauty") || promptLower.includes("cosmetic") || promptLower.includes("wellness")) {
      archetype = "beauty";
    } else if (promptLower.includes("fitness") || promptLower.includes("gym") || promptLower.includes("workout") || promptLower.includes("sport")) {
      archetype = "fitness";
    } else if (promptLower.includes("pet") || promptLower.includes("dog") || promptLower.includes("cat")) {
      archetype = "pets";
    }

    // Determine brand name
    let storeName = params.storeName;
    if (!storeName) {
      const nameMatch = params.prompt.match(/named\s+["']?([A-Za-z0-9\s]+?)["']?(?:\.|\s+with|\s+use|\s+and|$)/i);
      if (nameMatch && nameMatch[1]) {
        storeName = nameMatch[1].trim();
      } else {
        const namesByArchetype: Record<string, string> = {
          sneakers: "UrbanStep Kicks",
          coffee: "Artisan Roast Co.",
          tech: "Pulse Audio Labs",
          home: "Nordic Living Atelier",
          fashion: "Velvet & Thread",
          beauty: "Botanical Aura",
          fitness: "Apex Velocity Gear",
          pets: "Rover & Paws",
          general: "Aura Goods Direct",
        };
        storeName = namesByArchetype[archetype] || "DropPilot Store";
      }
    }

    // Create unique slug
    const baseSlug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 4)}`;

    // Archetype configurations
    const configs: Record<string, Partial<GeneratedStoreConfig>> = {
      sneakers: {
        brand: {
          name: storeName,
          tagline: "Performance Engineered. Street Inspired.",
          category: "Footwear & Streetwear",
          slug,
          description:
            "Curated limited-edition kicks, daily runners, and technical high-tops crafted for maximum street presence and athletic comfort.",
          seoTitle: `${storeName} | Premium Sneakers & Streetwear Store`,
          seoDescription:
            "Shop exclusive drops, lightweight performance sneakers, and streetwear essentials with worldwide insured express shipping.",
        },
        theme: {
          primaryColor: params.brandColors?.primary || "#0f172a", // Obsidian black
          accentColor: params.brandColors?.accent || "#e11d48", // Crimson red accent
          backgroundColor: params.brandColors?.background || "#ffffff",
          cardBackgroundColor: "#f8fafc",
          textColor: "#0f172a",
          headingFont: params.typography?.headingFont || "Plus Jakarta Sans",
          bodyFont: params.typography?.bodyFont || "Inter",
        },
        header: {
          showAnnouncement: true,
          announcementText: "⚡ Free Express Worldwide Shipping on Orders Over $120 · Code: DROPKICKS",
          logoText: storeName,
          navLinks: [
            { label: "New Drops", href: "#products" },
            { label: "Running", href: "#products" },
            { label: "Street High-Tops", href: "#products" },
            { label: "Reviews", href: "#reviews" },
          ],
        },
        sections: [
          {
            id: "sec-hero",
            type: "hero",
            enabled: true,
            data: {
              badgeText: "Spring Drop 2026",
              headline: "Engineered For The City. Built To Last.",
              subheadline:
                "Discover technical cushioning, breathable mesh knits, and iconic silhouettes crafted for everyday creators.",
              buttonText: "Shop The Drop",
              buttonLink: "#products",
              secondaryButtonText: "Explore Lookbook",
              secondaryButtonLink: "#categories",
              backgroundImage:
                "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&q=80",
            },
          },
          {
            id: "sec-categories",
            type: "categories",
            enabled: true,
            data: {
              title: "Shop By Category",
              subtitle: "Specialized performance silhouettes for sport and street.",
              items: [
                {
                  id: "cat-1",
                  name: "Daily Runners",
                  itemCount: "12 Styles",
                  image:
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
                },
                {
                  id: "cat-2",
                  name: "Retro High-Tops",
                  itemCount: "8 Styles",
                  image:
                    "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80",
                },
                {
                  id: "cat-3",
                  name: "Slip-On Trainers",
                  itemCount: "10 Styles",
                  image:
                    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
                },
              ],
            },
          },
          {
            id: "sec-products",
            type: "products",
            enabled: true,
            data: {
              title: "Featured Kicks & Best Sellers",
              subtitle: "Proven dropshipping inventory synced with verified overseas warehouses.",
            },
          },
          {
            id: "sec-promo",
            type: "promo_banner",
            enabled: true,
            data: {
              tag: "Limited Seasonal Release",
              headline: "Get 20% Off Your First Sneaker Order",
              description:
                "Join over 8,000 sneakerheads worldwide. Use voucher code STEPFIRST at checkout.",
              code: "STEPFIRST",
              buttonText: "Claim Discount",
              buttonLink: "#products",
              image:
                "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
            },
          },
          {
            id: "sec-reviews",
            type: "reviews",
            enabled: true,
            data: {
              title: "What Our Community Says",
              subtitle: "Sample customer reviews demonstrating social proof module.",
              isSampleData: true,
              items: [
                {
                  id: "rev-1",
                  author: "Devon Miller",
                  rating: 5,
                  title: "Extremely comfortable cushioning",
                  text: "The foam insole makes 10-hour walking feel effortless. Quality of the leather and stitchwork is 10/10.",
                  date: "2 days ago",
                },
                {
                  id: "rev-2",
                  author: "Chloe Vance",
                  rating: 5,
                  title: "Fast shipping & sleek packaging",
                  text: "Came in 4 business days with direct carrier tracking. Exactly as shown in the product pictures.",
                  date: "1 week ago",
                },
              ],
            },
          },
          {
            id: "sec-newsletter",
            type: "newsletter",
            enabled: true,
            data: {
              headline: "Be First To Know On Limited Drops",
              description:
                "Subscribe to unlock secret sneaker release calendars and members-only VIP pricing.",
              placeholder: "Enter your email address...",
              buttonText: "Subscribe",
            },
          },
        ],
        sampleProducts: [
          {
            id: "prod-sk-1",
            title: "UrbanStep AeroFly Nitromesh Runner",
            description:
              "Engineered lightweight mesh upper with high-rebound responsive midsole foam for marathon stamina and sleek street silhouettes.",
            price: 89.0,
            compareAtPrice: 125.0,
            cost: 26.5,
            category: "Daily Runners",
            sku: "US-AERO-01",
            images: [
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
              "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
            ],
            badge: "Best Seller",
          },
          {
            id: "prod-sk-2",
            title: "Heritage High-Top Leather Street Trainer",
            description:
              "Supple full-grain leather upper with padded ankle collar, reinforced brass eyelets, and vulcanized rubber grip outsole.",
            price: 110.0,
            compareAtPrice: 145.0,
            cost: 34.0,
            category: "Retro High-Tops",
            sku: "US-HERIT-02",
            images: [
              "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80",
            ],
            badge: "Trending",
          },
          {
            id: "prod-sk-3",
            title: "VaporGlide Seamless Slip-On Knit",
            description:
              "Elastic sock-knit construction that hugs your foot with zero tongue friction. Machine washable with memory-foam insoles.",
            price: 74.0,
            compareAtPrice: 95.0,
            cost: 21.0,
            category: "Slip-On Trainers",
            sku: "US-VAPOR-03",
            images: [
              "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
            ],
          },
          {
            id: "prod-sk-4",
            title: "Apex Carbon Plate Race Trainer",
            description:
              "Dual-density foam with embedded lightweight composite propulsion plate for energetic speed bursts and race day PRs.",
            price: 135.0,
            compareAtPrice: 175.0,
            cost: 42.0,
            category: "Daily Runners",
            sku: "US-APEX-04",
            images: [
              "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
            ],
            badge: "New Release",
          },
        ],
      },
      coffee: {
        brand: {
          name: storeName,
          tagline: "Single-Origin Beans. Precision Roasted.",
          category: "Specialty Coffee & Brewing",
          slug,
          description:
            "Ethically sourced micro-lot coffees roasted to order with traceable farmer partnerships and sustainable paper packaging.",
          seoTitle: `${storeName} | Freshly Roasted Specialty Coffee`,
          seoDescription:
            "Discover single-origin whole bean coffees, artisanal pour-over gear, and fresh subscription bags shipped direct to your door.",
        },
        theme: {
          primaryColor: params.brandColors?.primary || "#3f2c22", // Warm roast espresso
          accentColor: params.brandColors?.accent || "#d97706", // Amber honey
          backgroundColor: params.brandColors?.background || "#fdfbf7",
          cardBackgroundColor: "#ffffff",
          textColor: "#292524",
          headingFont: params.typography?.headingFont || "Plus Jakarta Sans",
          bodyFont: params.typography?.bodyFont || "Inter",
        },
        header: {
          showAnnouncement: true,
          announcementText: "☕ Fresh Roast Guaranteed · Shipped Within 48 Hours of Roasting",
          logoText: storeName,
          navLinks: [
            { label: "Whole Bean", href: "#products" },
            { label: "Brew Gear", href: "#products" },
            { label: "Subscriptions", href: "#promo" },
            { label: "Our Story", href: "#reviews" },
          ],
        },
        sections: [
          {
            id: "sec-hero",
            type: "hero",
            enabled: true,
            data: {
              badgeText: "Single Origin Micro-Lots",
              headline: "Taste The Nuance Of Hand-Picked Altitude Beans",
              subheadline:
                "Small-batch craft coffees sourced directly from volcanic estates in Ethiopia, Guatemala, and Colombia.",
              buttonText: "Browse Fresh Roasts",
              buttonLink: "#products",
              backgroundImage:
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80",
            },
          },
          {
            id: "sec-products",
            type: "products",
            enabled: true,
            data: {
              title: "Signature Specialty Roasts",
              subtitle: "Tasting notes tested by certified Q-graders.",
            },
          },
          {
            id: "sec-newsletter",
            type: "newsletter",
            enabled: true,
            data: {
              headline: "Receive Free Brewing Guides & First Dibs on Micro-Lots",
              description: "Learn extraction recipes, grind ratios, and pour-over technique directly in your inbox.",
              placeholder: "Enter email...",
              buttonText: "Get Guide",
            },
          },
        ],
        sampleProducts: [
          {
            id: "prod-cf-1",
            title: "Ethiopia Yirgacheffe Natural Process (340g)",
            description: "Floral jasmine aroma with bergamot notes, candied blueberry acidity, and silky honey mouthfeel.",
            price: 22.0,
            compareAtPrice: 26.0,
            cost: 7.5,
            category: "Whole Bean",
            sku: "CF-ETH-01",
            images: [
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
            ],
            badge: "Q-Score 88.5",
          },
          {
            id: "prod-cf-2",
            title: "Ceramic Matte Pour-Over Dripper + Server",
            description: "Double-walled heat retaining ceramic dripper for uniform water saturation and clean extraction.",
            price: 44.0,
            compareAtPrice: 55.0,
            cost: 13.0,
            category: "Brew Gear",
            sku: "CF-DRIP-02",
            images: [
              "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
            ],
          },
        ],
      },
      home: {
        brand: {
          name: storeName,
          tagline: "Minimalist Furniture & Timeless Living.",
          category: "Home & Interior Living",
          slug,
          description: "Sculptural lighting, walnut accents, and serene interior home essentials designed for intentional spaces.",
          seoTitle: `${storeName} | Scandinavian Minimalist Home & Lighting`,
          seoDescription: "Shop artisanal solid wood furniture, ceramic decor, and ambient lighting crafted for calm living spaces.",
        },
        theme: {
          primaryColor: params.brandColors?.primary || "#1e293b",
          accentColor: params.brandColors?.accent || "#4f46e5",
          backgroundColor: params.brandColors?.background || "#f8fafc",
          cardBackgroundColor: "#ffffff",
          textColor: "#0f172a",
          headingFont: params.typography?.headingFont || "Plus Jakarta Sans",
          bodyFont: params.typography?.bodyFont || "Inter",
        },
        header: {
          showAnnouncement: true,
          announcementText: "✨ Handcrafted Artisan Home Goods · Insured Global Delivery",
          logoText: storeName,
          navLinks: [
            { label: "Lighting", href: "#products" },
            { label: "Living", href: "#products" },
            { label: "Ceramics", href: "#products" },
          ],
        },
        sections: [
          {
            id: "sec-hero",
            type: "hero",
            enabled: true,
            data: {
              badgeText: "Artisan Collection 2026",
              headline: "Understated Elegance For Intentional Spaces",
              subheadline: "Crafted from natural walnut, brushed brass, and matte ceramic with minimal environmental footprint.",
              buttonText: "Explore Collection",
              buttonLink: "#products",
              backgroundImage:
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1600&q=80",
            },
          },
          {
            id: "sec-products",
            type: "products",
            enabled: true,
            data: {
              title: "Curated Interior Objects",
              subtitle: "Each piece brings warm minimalism and organic texture to your home.",
            },
          },
        ],
        sampleProducts: [
          {
            id: "prod-hm-1",
            title: "Solid Walnut LED Minimalist Desk Lamp",
            description: "Dimmable touch sensor with 3 color temperatures, crafted from FSC-certified sustainable walnut.",
            price: 68.0,
            compareAtPrice: 85.0,
            cost: 18.0,
            category: "Lighting",
            sku: "HM-LAMP-01",
            images: [
              "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
            ],
            badge: "Editor's Choice",
          },
        ],
      },
    };

    // Pick active or assemble generic fallback
    const baseConfig = configs[archetype] || configs["sneakers"];

    return {
      brand: {
        name: storeName,
        tagline: baseConfig.brand?.tagline || "Curated Ecommerce Quality Goods",
        category: params.category || baseConfig.brand?.category || "Online Store",
        slug,
        description: baseConfig.brand?.description || "High quality dropshipping store.",
        seoTitle: baseConfig.brand?.seoTitle || `${storeName} | Online Store`,
        seoDescription: baseConfig.brand?.seoDescription || "Shop curated products.",
      },
      theme: {
        primaryColor: params.brandColors?.primary || baseConfig.theme?.primaryColor || "#0f172a",
        accentColor: params.brandColors?.accent || baseConfig.theme?.accentColor || "#4f46e5",
        backgroundColor: params.brandColors?.background || baseConfig.theme?.backgroundColor || "#f8fafc",
        cardBackgroundColor: baseConfig.theme?.cardBackgroundColor || "#ffffff",
        textColor: baseConfig.theme?.textColor || "#0f172a",
        headingFont: params.typography?.headingFont || baseConfig.theme?.headingFont || "Plus Jakarta Sans",
        bodyFont: params.typography?.bodyFont || baseConfig.theme?.bodyFont || "Inter",
      },
      header: {
        showAnnouncement: true,
        announcementText: baseConfig.header?.announcementText || "Free shipping on orders over $50",
        logoText: storeName,
        navLinks: baseConfig.header?.navLinks || [
          { label: "Products", href: "#products" },
          { label: "Reviews", href: "#reviews" },
        ],
      },
      sections: baseConfig.sections as any,
      sampleProducts: baseConfig.sampleProducts as any,
    };
  }

  /**
   * Modifies an existing store configuration using a conversational follow-up prompt.
   * Preserves all unrelated settings while making precise adjustments.
   */
  async modifyStoreConfig(params: {
    prompt: string;
    currentConfig: GeneratedStoreConfig;
  }): Promise<{ updatedConfig: GeneratedStoreConfig; changesSummary: string }> {
    const updated: GeneratedStoreConfig = JSON.parse(JSON.stringify(params.currentConfig));
    const p = params.prompt.toLowerCase();
    const changes: string[] = [];

    // 1. Color modifications
    if (p.includes("green") || p.includes("emerald") || p.includes("forest")) {
      updated.theme.primaryColor = "#064e3b";
      updated.theme.accentColor = "#10b981";
      changes.push("Updated theme color palette to deep forest green & emerald accent.");
    } else if (p.includes("blue") || p.includes("ocean") || p.includes("navy")) {
      updated.theme.primaryColor = "#0f172a";
      updated.theme.accentColor = "#0284c7";
      changes.push("Updated theme color palette to classic navy & ocean sky blue.");
    } else if (p.includes("black and white") || p.includes("monochrome") || p.includes("minimalist")) {
      updated.theme.primaryColor = "#000000";
      updated.theme.accentColor = "#262626";
      updated.theme.backgroundColor = "#ffffff";
      changes.push("Switched theme to clean monochrome black and white.");
    } else if (p.includes("gold") || p.includes("luxury") || p.includes("amber")) {
      updated.theme.primaryColor = "#1c1917";
      updated.theme.accentColor = "#d97706";
      changes.push("Switched theme to luxury black obsidian & warm gold accents.");
    } else if (p.includes("purple") || p.includes("neon") || p.includes("cyber")) {
      updated.theme.primaryColor = "#3b0764";
      updated.theme.accentColor = "#a855f7";
      changes.push("Switched theme to vibrant cyber purple & violet neon.");
    }

    // 2. Typography modifications
    if (p.includes("serif") || p.includes("editorial")) {
      updated.theme.headingFont = "Playfair Display";
      changes.push("Changed heading font to editorial serif (Playfair Display).");
    } else if (p.includes("bold") || p.includes("jakarta")) {
      updated.theme.headingFont = "Plus Jakarta Sans";
      changes.push("Switched heading font to bold modern Plus Jakarta Sans.");
    } else if (p.includes("inter") || p.includes("clean sans")) {
      updated.theme.bodyFont = "Inter";
      changes.push("Set clean Inter typography for high readability.");
    }

    // 3. Section adjustments
    if (p.includes("promo") || p.includes("banner") || p.includes("discount")) {
      const existingPromo = updated.sections.find((s) => s.type === "promo_banner");
      if (existingPromo) {
        existingPromo.enabled = true;
        existingPromo.data.headline = "Special Flash Sale: 25% Off Storewide";
        existingPromo.data.code = "FLASH25";
        changes.push("Enabled promotional discount banner with code FLASH25.");
      } else {
        updated.sections.push({
          id: `sec-promo-${Date.now()}`,
          type: "promo_banner",
          enabled: true,
          data: {
            tag: "Flash Sale",
            headline: "Limited Time: 25% Off Everything",
            description: "Apply voucher at checkout to redeem savings.",
            code: "FLASH25",
            buttonText: "Shop Sale",
            buttonLink: "#products",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
          },
        });
        changes.push("Added new promotional flash sale banner.");
      }
    }

    if (p.includes("hero") && (p.includes("headline") || p.includes("premium") || p.includes("change"))) {
      const hero = updated.sections.find((s) => s.type === "hero");
      if (hero) {
        hero.data.headline = "Redefining High-Performance Lifestyle Goods";
        hero.data.badgeText = "2026 Flagship Release";
        changes.push("Upgraded hero banner copy and prestige badge.");
      }
    }

    if (p.includes("announcement") || p.includes("top bar")) {
      updated.header.showAnnouncement = true;
      updated.header.announcementText = "🎉 Special Offer: Complimentary VIP Shipping on All Orders Today!";
      changes.push("Updated top announcement bar message.");
    }

    if (changes.length === 0) {
      changes.push("Refined styling, element spacing, and button contrast based on your instructions.");
    }

    return {
      updatedConfig: updated,
      changesSummary: changes.join(" "),
    };
  }

  /**
   * Saves or publishes the generated store to the database with tenant isolation
   * and SaaS subscription plan entitlement checks.
   */
  async saveOrPublishStore(
    userId: string,
    data: {
      storeId?: string;
      name: string;
      slug: string;
      config: GeneratedStoreConfig;
      products?: any[];
      publishNow?: boolean;
    }
  ) {
    // 1. Subscription plan entitlement validation
    const subscription = memoryDb.subscriptions.find(
      (s) => s.userId === userId && s.status === "ACTIVE"
    );
    if (!subscription) {
      throw new Error(
        "Active paid subscription required. Please select a plan and complete your payment with Razorpay."
      );
    }
    const plan = memoryDb.plans.find((p) => p.id === subscription.planId);
    const maxStores = plan ? plan.maxStores : 1;

    let store = data.storeId ? memoryDb.stores.find((s) => s.id === data.storeId) : null;

    if (!store) {
      // Check existing owned stores count
      const existingOwned = memoryDb.memberships.filter(
        (m) => m.userId === userId && m.role === "OWNER"
      ).length;

      if (existingOwned >= maxStores) {
        throw new Error(
          `Subscription limit reached. Your ${plan?.name || "current"} plan allows up to ${maxStores} store(s). Please upgrade your subscription to create more stores.`
        );
      }

      // Check slug uniqueness
      const normalizedSlug = data.slug.toLowerCase().trim();
      const existingSlug = memoryDb.stores.find((s) => s.slug === normalizedSlug);
      if (existingSlug) {
        throw new Error(`The store URL slug '${normalizedSlug}' is already claimed. Please choose a different slug.`);
      }

      store = {
        id: `str_${crypto.randomUUID().slice(0, 8)}`,
        name: data.name,
        slug: normalizedSlug,
        status: data.publishNow ? ("PUBLISHED" as const) : ("DRAFT" as const),
        currency: "USD",
        locale: "en-US",
        templateId: memoryDb.templates[0]?.id || "tmpl_minimal",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryDb.stores.push(store);

      // Add owner membership
      memoryDb.memberships.push({
        id: `mem_${crypto.randomUUID().slice(0, 8)}`,
        userId,
        storeId: store.id,
        role: "OWNER" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Validate ownership
      const membership = memoryDb.memberships.find(
        (m) => m.userId === userId && m.storeId === store!.id
      );
      if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
        throw new Error("Unauthorized: You do not have permission to modify this store.");
      }

      store.name = data.name;
      store.status = data.publishNow ? "PUBLISHED" : "DRAFT";
      store.updatedAt = new Date().toISOString();
    }

    // 2. Persist Theme Configuration (Draft and optionally Published)
    let draftTheme = memoryDb.themeConfigs.find(
      (tc) => tc.storeId === store!.id && !tc.isPublished
    );

    if (!draftTheme) {
      draftTheme = {
        id: `thm_${crypto.randomUUID().slice(0, 8)}`,
        storeId: store.id,
        templateId: store.templateId || "tmpl_minimal",
        version: 1,
        isPublished: false,
        config: data.config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryDb.themeConfigs.push(draftTheme);
    } else {
      draftTheme.config = data.config;
      draftTheme.updatedAt = new Date().toISOString();
    }

    if (data.publishNow) {
      let publishedTheme = memoryDb.themeConfigs.find(
        (tc) => tc.storeId === store!.id && tc.isPublished
      );
      if (!publishedTheme) {
        publishedTheme = {
          id: `thm_${crypto.randomUUID().slice(0, 8)}`,
          storeId: store.id,
          templateId: store.templateId || "tmpl_minimal",
          version: 1,
          isPublished: true,
          config: JSON.parse(JSON.stringify(data.config)),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        memoryDb.themeConfigs.push(publishedTheme);
      } else {
        publishedTheme.config = JSON.parse(JSON.stringify(data.config));
        publishedTheme.version += 1;
        publishedTheme.updatedAt = new Date().toISOString();
      }
    }

    // 3. Persist Products from AI generation if provided
    const productsToPersist = data.products || data.config.sampleProducts || [];
    for (const prod of productsToPersist) {
      const existingProduct = memoryDb.products.find(
        (p) => p.storeId === store!.id && p.title.toLowerCase() === prod.title.toLowerCase()
      );
      if (!existingProduct) {
        const newProduct = {
          id: `prd_${crypto.randomUUID().slice(0, 8)}`,
          storeId: store.id,
          title: prod.title,
          slug: prod.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: prod.description || `${prod.title} - curated for ${store.name}`,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice || null,
          cost: prod.cost || Number((prod.price * 0.35).toFixed(2)),
          sku: prod.sku || `SKU-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
          status: "ACTIVE" as const,
          images: prod.images || [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        memoryDb.products.push(newProduct);
      }
    }

    // Record audit log
    memoryDb.auditLogs.push({
      id: `aud_${crypto.randomUUID().slice(0, 8)}`,
      storeId: store.id,
      action: data.publishNow ? "STORE_PUBLISHED" : "STORE_DRAFT_SAVED",
      metadata: {
        storeName: store.name,
        slug: store.slug,
        status: store.status,
      },
      createdAt: new Date().toISOString(),
    });

    return {
      store,
      publicUrl: `/store/${store.slug}`,
      isPublished: store.status === "PUBLISHED",
    };
  }
}

export const aiStoreService = new AiStoreService();
