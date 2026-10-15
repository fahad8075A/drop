import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("Integration & Cross-Tenant Security Tests", () => {
  let alexToken: string;
  let sarahToken: string;
  let adminToken: string;
  let alexStoreId: string;
  let sarahStoreId: string;
  let alexProductId: string;

  beforeAll(async () => {
    // 1. Authenticate Alex (Store Owner 1)
    const alexRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "alex@droppilot.com", password: "OwnerPass123!" });
    expect(alexRes.status).toBe(200);
    alexToken = alexRes.body.data.token;

    // 2. Authenticate Sarah (Store Owner 2)
    const sarahRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "sarah@droppilot.com", password: "OwnerPass123!" });
    expect(sarahRes.status).toBe(200);
    sarahToken = sarahRes.body.data.token;

    // 3. Authenticate Platform Admin
    const adminRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@droppilot.com", password: "AdminPass123!" });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.data.token;

    // Fetch stores
    const alexStores = await request(app)
      .get("/api/v1/stores")
      .set("Authorization", `Bearer ${alexToken}`);
    alexStoreId = alexStores.body.data[0].id; // Lumix Minimal Studio

    const sarahStores = await request(app)
      .get("/api/v1/stores")
      .set("Authorization", `Bearer ${sarahToken}`);
    sarahStoreId = sarahStores.body.data[0].id; // Velvet Lifestyle

    // Fetch Alex's product
    const alexProds = await request(app)
      .get(`/api/v1/catalog/${alexStoreId}/products`)
      .set("Authorization", `Bearer ${alexToken}`);
    alexProductId = alexProds.body.data[0].id;
  });

  describe("Authentication & Session Flows", () => {
    it("should reject login with wrong password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "alex@droppilot.com", password: "WrongPassword!" });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should retrieve current user profile with valid Bearer token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${alexToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe("alex@droppilot.com");
      expect(res.body.data.stores).toBeDefined();
    });
  });

  describe("Cross-Tenant Security: Tenant Isolation Enforcement", () => {
    it("SECURITY: Sarah CANNOT access Alex's store settings", async () => {
      const res = await request(app)
        .get(`/api/v1/stores/${alexStoreId}`)
        .set("Authorization", `Bearer ${sarahToken}`);

      // Expect 403 Forbidden due to tenantAuth middleware
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("TENANT_ACCESS_DENIED");
    });

    it("SECURITY: Sarah CANNOT modify Alex's product", async () => {
      const res = await request(app)
        .put(`/api/v1/catalog/${alexStoreId}/products/${alexProductId}`)
        .set("Authorization", `Bearer ${sarahToken}`)
        .send({ title: "Hacked Product Title" });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("TENANT_ACCESS_DENIED");
    });

    it("SECURITY: Sarah CANNOT delete Alex's product", async () => {
      const res = await request(app)
        .delete(`/api/v1/catalog/${alexStoreId}/products/${alexProductId}`)
        .set("Authorization", `Bearer ${sarahToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("TENANT_ACCESS_DENIED");
    });

    it("SECURITY: Sarah CANNOT access Alex's orders", async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${alexStoreId}/orders`)
        .set("Authorization", `Bearer ${sarahToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("TENANT_ACCESS_DENIED");
    });

    it("SECURITY: Platform Admin CAN inspect store governance", async () => {
      const res = await request(app)
        .get(`/api/v1/stores/${alexStoreId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(alexStoreId);
    });
  });

  describe("Public Storefront & Cart Checkout Price Integrity", () => {
    it("should resolve published storefront by slug", async () => {
      const res = await request(app).get("/api/v1/public/store/lumix");
      expect(res.status).toBe(200);
      expect(res.body.data.store.slug).toBe("lumix");
      expect(res.body.data.theme).toBeDefined();
      expect(res.body.data.products.length).toBeGreaterThan(0);
    });

    it("SECURITY: Checkout server recalculates total and ignores tampered client prices", async () => {
      const res = await request(app)
        .post("/api/v1/public/store/lumix/checkout")
        .send({
          customer: {
            name: "Test Customer",
            email: "shopper@gmail.com",
          },
          shippingAddress: {
            name: "Test Customer",
            addressLine1: "123 Main St",
            city: "Austin",
            state: "TX",
            postalCode: "78701",
            country: "United States",
          },
          items: [
            {
              productId: alexProductId,
              quantity: 1,
              // Attempting to send a tampered price of $0.01
              price: 0.01,
            },
          ],
        });

      expect(res.status).toBe(201);
      const order = res.body.data.order;
      // Real price is $49.99, subtotal must be 49.99, not 0.01!
      expect(order.subtotal).toBe(49.99);
      expect(order.totalAmount).toBeGreaterThan(49.99);
      expect(order.status).toBe("PENDING_PAYMENT");

      // Verify payment confirmation advances state to PAID
      const verifyRes = await request(app)
        .post("/api/v1/public/store/lumix/checkout/verify-payment")
        .send({
          orderId: order.id,
          paymentId: "pay_test_verified_123",
          provider: "SANDBOX",
        });

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.data.order.status).toBe("FULFILLED"); // advanced and fulfilled by worker
    });
  });
});
