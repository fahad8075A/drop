export type UserRole = "PLATFORM_ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

export type StoreRole = "OWNER" | "ADMIN" | "EDITOR" | "FULFILLMENT";
export type StoreStatus = "DRAFT" | "PUBLISHED" | "SUSPENDED" | "ARCHIVED";

export interface StoreMembership {
  id: string;
  userId: string;
  storeId: string;
  role: StoreRole;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  status: StoreStatus;
  currency: string;
  locale: string;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
  memberships?: StoreMembership[];
}

export interface Template {
  id: string;
  name: string;
  code: "minimal-modern" | "fashion-lifestyle" | "electronics-gadgets";
  description: string;
  previewUrl?: string;
  version: string;
  isDefault: boolean;
}

export interface ThemeColors {
  primary: string;
  background: string;
  foreground: string;
  accent: string;
  muted: string;
}

export interface ThemeConfigData {
  colors: ThemeColors;
  typography: {
    fontFamily: string;
    headingFont: string;
  };
  header: {
    announcementText?: string;
    showAnnouncement: boolean;
    logoUrl?: string;
    navigation: Array<{ label: string; href: string }>;
  };
  hero: {
    headline: string;
    subheadline: string;
    buttonText: string;
    buttonLink: string;
    backgroundImageUrl?: string;
  };
  sections: {
    showFeaturedProducts: boolean;
    showCategories: boolean;
    showPromotions: boolean;
    showNewsletter: boolean;
  };
  footer: {
    aboutText: string;
    links: Array<{ label: string; href: string }>;
    copyright: string;
  };
}

export interface ThemeConfig {
  id: string;
  storeId: string;
  templateId: string;
  version: number;
  isPublished: boolean;
  config: ThemeConfigData;
}

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  sku?: string;
  price: number;
  supplierCost?: number;
  inventoryCount: number;
  options?: Record<string, string>;
}

export interface Product {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  supplierCost?: number;
  sku?: string;
  inventoryCount: number;
  status: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  images?: string[];
  variants?: ProductVariant[];
  createdAt: string;
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  title: string;
  sku?: string;
  quantity: number;
  priceSnapshot: number;
  currency: string;
}

export interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingAddress: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  createdAt: string;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  maxStores: number;
  maxProducts: number;
  customDomains: boolean;
  supplierSync: boolean;
  maxTeamMembers: number;
  analyticsEnabled: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED";
  currentPeriodEnd: string;
  plan?: Plan;
}
