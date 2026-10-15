# DropPilot System Architecture

## 1. System Overview
DropPilot is a multi-tenant ecommerce website-builder and dropshipping SaaS platform. It allows entrepreneurs to create, customize, manage, and scale independent online storefronts without writing code.

The system is decoupled into two independent applications:
1. **Frontend (`client/`)**: Next.js App Router (React, TypeScript, Tailwind CSS, Lucide Icons) providing:
   - Modern marketing website with pricing, feature showcases, and interactive demo stores.
   - User authentication and multi-step onboarding wizard.
   - Platform Administration dashboard.
   - Store Owner dashboard (Products, Inventory, Orders, Customers, Suppliers, Website Builder, Billing).
   - Public Storefront renderer with multi-tenant domain & subdomain resolution and responsive templates.
2. **Backend (`server/`)**: Modular Express.js REST API with TypeScript, PostgreSQL via Prisma ORM, Redis-backed job queues, encrypted credential vault, and payment integrations.

## 2. Multi-Tenant Architecture

### Tenant Resolution and Isolation
Multi-tenancy is handled via Store models and unique subdomains / custom domains.
- **Subdomain Mapping**: A customer accessing `gadgets.droppilot.com` or `/store/gadgets` is mapped to the store with slug `gadgets`.
- **Tenant Scope Enforcement**:
  - The server extracts and validates the tenant context for every store-specific request.
  - When an authenticated user accesses `/api/v1/stores/:storeId/*`, the `tenantAuth` middleware verifies that the user holds an active membership (`OWNER`, `ADMIN`, `EDITOR`, or `FULFILLMENT`) for that specific `storeId`.
  - All database queries for products, orders, categories, and settings enforce `WHERE storeId = :storeId` scoping. Cross-tenant leakage is prevented at both the middleware and service layers.

## 3. Core Modules & Subsystems

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                       │
│  Marketing  │  Onboarding  │  Dashboard  │  Storefront      │
└──────────────┬───────────────────────────┬──────────────────┘
               │ HTTP REST (JSON)          │ Storefront Views
               ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express Backend (API v1)                  │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ Auth & Roles │ Store Engine │ Catalog & Inv│ Order Engine   │
├──────────────┼──────────────┼──────────────┼────────────────┤
│ Subscriptions│ Integrations │ Template Eng │ Background Jobs│
└──────────────┴──────────────┴──────────────┴────────────────┘
               │                           │
               ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────────┐
│     PostgreSQL Database   │ │    External APIs & Services   │
│  (Prisma ORM Migrations)  │ │  (Razorpay, Supplier Adapters)│
└───────────────────────────┘ └───────────────────────────────┘
```

### Module Descriptions:
1. **Auth & Account Management**: JWT/cookie-based sessions, role-based authorization (`PLATFORM_ADMIN`, `STORE_OWNER`, `STORE_COLLABORATOR`, `CUSTOMER`), bcrypt password hashing, and rate limiting.
2. **Multi-Tenant Store Management**: Complete lifecycle for stores (draft, published, suspended), slug uniqueness, currency, locale, and memberships.
3. **Template & Visual Builder**:
   - 3 Curated Responsive Templates:
     - *Minimal Modern*: Clean typography, high whitespace, curated lifestyle products.
     - *Fashion & Lifestyle*: Editorial banners, lookbooks, bold visuals.
     - *Electronics & Gadgets*: Feature comparison, tech specs, vibrant badges.
   - Visual customizer with live preview, color palettes, section ordering, draft saving, and safe JSON schema-validated theme configurations.
4. **Product Catalog & Profit Estimator**: Title, SKU, variants, inventory, compare-at prices, supplier costs, and automated margin calculations.
5. **Supplier Integration Framework**:
   - Pluggable `SupplierAdapter` interface (`searchProducts`, `syncStockAndPrice`, `createSupplierOrder`, `trackShipment`).
   - Sandbox Deterministic Mock Adapter for development and testing.
   - AliExpress / CJ Dropshipping integration structure with AES-256-GCM encrypted credentials.
6. **Cart, Checkout & Payments**:
   - Server-side price recalculation (never trust client prices).
   - Atomic pending order reservation.
   - Two distinct payment domains:
     - Platform Subscription Billing (Razorpay Subscriptions + provider adapter).
     - Store Customer Checkout (Separate gateway abstraction).
7. **Order Lifecycle & Fulfillment**:
   - Finite state machine: `PENDING_PAYMENT` -> `PAID` -> `PROCESSING` -> `PARTIALLY_FULFILLED` -> `FULFILLED` / `CANCELLED` / `REFUNDED`.
   - Immutable order-item snapshots (title, SKU, price, supplier details).
   - Asynchronous background fulfillment worker with idempotent processing and retry backoff.
8. **Platform Administration**: Superadmin tools for tenant suspension, plan limits, audit logs, and global metrics.
