# DropPilot REST API Specification (v1)

All endpoints are mounted under `/api/v1`. Authentication is via Bearer token in the `Authorization` header (`Bearer <token>`) or `droppilot_session` HTTP-only cookie.

## 1. Authentication Endpoints (`/api/v1/auth`)
- `POST /api/v1/auth/register`: Create a new user account.
  - Body: `{ email, password, name }`
- `POST /api/v1/auth/login`: Authenticate and receive session token.
  - Body: `{ email, password }`
- `POST /api/v1/auth/logout`: Invalidate session cookie.
- `GET /api/v1/auth/me`: Fetch authenticated user profile and memberships.
- `POST /api/v1/auth/verify-email`: Confirm email verification token.

## 2. Store Management Endpoints (`/api/v1/stores`)
- `GET /api/v1/stores`: List stores accessible to the authenticated user.
- `POST /api/v1/stores`: Create a new store (enforces subscription plan limits).
  - Body: `{ name, slug, templateId, currency }`
- `GET /api/v1/stores/:storeId`: Retrieve store details and settings.
- `PUT /api/v1/stores/:storeId`: Update store configuration.
- `DELETE /api/v1/stores/:storeId`: Archive/delete store (Owner only).
- `POST /api/v1/stores/:storeId/publish`: Publish store draft to live storefront.

## 3. Template & Builder Endpoints (`/api/v1/templates`)
- `GET /api/v1/templates`: List system storefront templates.
- `GET /api/v1/stores/:storeId/theme`: Get draft and published theme configs.
- `PUT /api/v1/stores/:storeId/theme/draft`: Save draft theme configuration.
- `POST /api/v1/stores/:storeId/theme/publish`: Publish draft configuration to live storefront.

## 4. Product Catalog Endpoints (`/api/v1/stores/:storeId/products`)
- `GET /api/v1/stores/:storeId/products`: List products with pagination, search, status filter.
- `POST /api/v1/stores/:storeId/products`: Create a new product.
- `GET /api/v1/stores/:storeId/products/:productId`: Get product details & variants.
- `PUT /api/v1/stores/:storeId/products/:productId`: Update product and variants.
- `DELETE /api/v1/stores/:storeId/products/:productId`: Delete product.

## 5. Orders & Fulfillment Endpoints (`/api/v1/stores/:storeId/orders`)
- `GET /api/v1/stores/:storeId/orders`: List orders with status and date filters.
- `GET /api/v1/stores/:storeId/orders/:orderId`: View immutable order-line snapshots, customer address, payment status.
- `POST /api/v1/stores/:storeId/orders/:orderId/fulfill`: Trigger supplier order placement and fulfillment.

## 6. Public Storefront Endpoints (`/api/v1/public/store/:slug`)
- `GET /api/v1/public/store/:slug`: Resolve store, published theme, categories.
- `GET /api/v1/public/store/:slug/products`: List published products.
- `GET /api/v1/public/store/:slug/products/:productSlug`: Get product detail for shopping.
- `POST /api/v1/public/store/:slug/checkout`: Submit customer cart, validate prices on server, generate order.
- `POST /api/v1/public/store/:slug/checkout/verify-payment`: Verify payment and advance order to `PAID`.

## 7. Supplier Integration Endpoints (`/api/v1/stores/:storeId/suppliers`)
- `GET /api/v1/stores/:storeId/suppliers`: List connected suppliers.
- `POST /api/v1/stores/:storeId/suppliers/connect`: Save encrypted supplier credentials.
- `POST /api/v1/stores/:storeId/suppliers/:supplierId/test`: Verify connection health.
- `POST /api/v1/stores/:storeId/suppliers/:supplierId/sync`: Trigger background sync of catalog prices & stock.

## 8. Subscriptions & Billing (`/api/v1/subscriptions`)
- `GET /api/v1/subscriptions/plans`: List public subscription plans (Starter, Pro, Enterprise).
- `GET /api/v1/subscriptions/current`: Retrieve user's current subscription & entitlements.
- `POST /api/v1/subscriptions/checkout`: Create subscription order.
- `POST /api/v1/subscriptions/webhook`: Razorpay signed webhook handler.

## 9. Platform Admin Endpoints (`/api/v1/admin`)
- `GET /api/v1/admin/metrics`: Platform-wide stats (users, stores, GMV, orders).
- `GET /api/v1/admin/users`: User management list.
- `GET /api/v1/admin/stores`: All stores management & suspension control.
- `PUT /api/v1/admin/stores/:storeId/status`: Suspend or activate store.
- `GET /api/v1/admin/audit-logs`: Security audit log stream.
