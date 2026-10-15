# DropPilot Security Architecture & Verification

Security is treated as a core architectural requirement. The following controls are built directly into the codebase:

## 1. Multi-Tenant Isolation
- **Tenant Scope Enforcement**:
  Every database query touching store-owned entities (products, categories, orders, customers, theme configs) explicitly filters by `storeId`.
- **Tenant Authorization Middleware (`tenantAuth`)**:
  Inspects the requesting user's verified session and queries `StoreMembership` for that specific store ID.
  If the user lacks an authorized role (`OWNER`, `ADMIN`, `EDITOR`, or `FULFILLMENT`), the request is rejected with `403 Forbidden`.
- **Cross-Tenant Security Tests**:
  Automated tests explicitly verify that User A cannot read, update, or delete User B's store, products, or orders by substituting IDs in request payloads or URL parameters.

## 2. Authentication & Session Management
- **Password Hashing**: Passwords are cryptographically hashed using `bcryptjs` with standard salt rounds (12).
- **Session Tokens**: Cryptographically signed JWT tokens stored in `httpOnly`, `SameSite=Lax`, `secure` cookies or Bearer Authorization headers.
- **Role-Based Access Control (RBAC)**:
  - `PLATFORM_ADMIN`: Global platform oversight, store suspension, plan management.
  - `STORE_OWNER`: Full store authority, billing, team invitations.
  - `STORE_COLLABORATOR`: Scoped permissions (e.g. Editor can edit products/themes; Fulfillment can process orders).
  - `CUSTOMER`: Public storefront checkout and order tracking only.

## 3. Credential Encryption & Secret Protection
- **Supplier Credentials**: API keys and secrets for dropshipping suppliers (AliExpress, CJ, etc.) are encrypted before storage in the database using AES-256-GCM.
- **Client Security**: No database connection strings, server secrets, or encryption keys are ever prefixed with `NEXT_PUBLIC_` or bundled in client builds.

## 4. Payment & Checkout Integrity
- **Server-Side Price Validation**:
  Public checkout requests submit item IDs and quantities only. The server recalculates prices from authoritative database records before computing subtotal, taxes, shipping, and total.
  Client tampering with prices or discounts is mathematically impossible.
- **Idempotent Webhook Verification**:
  SaaS subscription and customer payment webhooks verify cryptographic signatures (e.g. HMAC SHA256) and record webhook event IDs to prevent replay attacks or duplicate fulfillments.

## 5. Defense in Depth
- **Helmet**: Secures HTTP response headers against clickjacking, MIME-sniffing, and cross-site scripting.
- **Input Validation**: Strict Zod schema validation on all incoming request parameters, query strings, and request bodies.
- **Safe Error Handling**: Internal stack traces and database error codes are stripped in production responses.
