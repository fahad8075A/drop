# DropPilot - Multi-Tenant Dropshipping Website Builder SaaS

DropPilot is an all-in-one multi-tenant ecommerce platform empowering entrepreneurs to launch, customize, and automate dropshipping storefronts without writing code.

---

## Key Features

- **Store Builder & Templates**: 3 responsive, customizable templates (*Minimal Modern*, *Fashion & Lifestyle*, *Electronics & Gadgets*) with live preview, branding controls, and safe schema-validated theme configs.
- **Multi-Tenant Architecture**: Robust tenant isolation at both the routing and database query level, supporting platform subdomains and custom domains.
- **Product & Inventory Engine**: Full catalog management, variant control, supplier cost tracking, and automated real-time profit margin estimation.
- **Supplier Integration Framework**: Pluggable supplier adapters (AliExpress, CJ Dropshipping, and deterministic sandbox mock) with AES-256 encrypted credential storage and stock/price sync.
- **Order Lifecycle & Background Fulfillment**: Automated state transitions (`PENDING_PAYMENT` -> `PAID` -> `PROCESSING` -> `FULFILLED`), immutable order-line snapshots, and fulfillment background workers.
- **Two-Tier Payment Processing**:
  - **SaaS Subscriptions**: Razorpay/Stripe subscription billing with automated plan entitlement enforcement.
  - **Storefront Checkout**: Server-calculated cart totals and secure payment verification.
- **Platform Administration**: Superadmin dashboard for user oversight, tenant suspension, plan configurations, and security audit logs.

---

## Project Structure

```text
droppilot/
  client/                 # Next.js 14 App Router, React, Tailwind CSS, Lucide
    public/
    src/
      app/                # Marketing, Auth, Onboarding, Dashboard, Storefronts
      components/         # UI components, builder controls, layouts
      hooks/              # Reusable React hooks
      lib/                # Typed REST API client & helpers
      types/              # Frontend types & theme schema definitions
    .env.example
    package.json
    tsconfig.json
  server/                 # Node.js, Express.js, TypeScript REST API
    prisma/
      schema.prisma       # Complete multi-tenant relational schema
      seed.ts             # Demo data, templates, plans, test accounts
    src/
      config/             # Environment & encryption configuration
      middleware/         # Auth, Tenant isolation, Role-based permissions, Rate limiting
      modules/            # Auth, Stores, Products, Orders, Templates, Suppliers, Payments, Admin
      services/           # Business logic & Entitlement enforcement
      integrations/       # Supplier adapters & payment adapters
      jobs/               # Background fulfillment & catalog sync workers
      utils/              # Cryptography, token verification, response formatting
      app.ts              # Express application configuration
      server.ts           # HTTP server entrypoint
    tests/                # Unit, integration, and cross-tenant security tests
    .env.example
    package.json
    tsconfig.json
  docs/
    ARCHITECTURE.md
    API.md
    SETUP.md
    SECURITY.md
  package.json
  .gitignore
  README.md
```

---

## Quick Start

### 1. Install Dependencies
```bash
# In server
cd server && npm install

# In client
cd ../client && npm install
```

### 2. Configure Environment
```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env.local
```

### 3. Generate Database Models & Seed Data
```bash
cd server
npm run prisma:generate
npm run prisma:seed
```

### 4. Run Development Servers
In separate terminals:
```bash
# Backend (Express API at http://localhost:5000)
cd server && npm run dev

# Frontend (Next.js at http://localhost:3000)
cd client && npm run dev
```

### 5. Run Automated Tests
```bash
cd server && npm run test
```
