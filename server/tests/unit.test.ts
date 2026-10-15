import { describe, it, expect } from "vitest";
import { encryptCredential, decryptCredential } from "../src/utils/crypto.js";
import { catalogService } from "../src/modules/catalog/catalog.service.js";
import { registerSchema } from "../src/modules/auth/auth.validation.js";
import { createStoreSchema } from "../src/modules/stores/stores.validation.js";

describe("Unit Tests: Cryptography & Security", () => {
  it("should encrypt and decrypt supplier credentials accurately using AES-256-GCM", () => {
    const rawCredentials = JSON.stringify({
      apiKey: "ali_key_99812481",
      apiSecret: "secret_xyz_8871239102",
    });

    const encrypted = encryptCredential(rawCredentials);
    expect(encrypted).not.toEqual(rawCredentials);
    expect(encrypted.split(":")).toHaveLength(3); // iv:authTag:ciphertext

    const decrypted = decryptCredential(encrypted);
    expect(decrypted).toEqual(rawCredentials);
  });

  it("should fail to decrypt tampered ciphertexts", () => {
    const encrypted = encryptCredential("test-secret");
    const tampered = encrypted.slice(0, -4) + "abcd";
    expect(() => decryptCredential(tampered)).toThrow();
  });
});

describe("Unit Tests: Profit & Pricing Calculations", () => {
  it("should accurately calculate net profit, gateway fees, and margins", () => {
    const price = 100.0;
    const supplierCost = 40.0;
    const shipping = 5.0;

    const breakdown = catalogService.calculateProfitEstimate(price, supplierCost, shipping);

    // Fee = 100 * 0.029 + 0.30 = $3.20
    expect(breakdown.sellingPrice).toBe(100.0);
    expect(breakdown.supplierCost).toBe(40.0);
    expect(breakdown.estimatedPaymentFee).toBe(3.2);
    expect(breakdown.estimatedShippingCost).toBe(5.0);

    // Net profit = 100 - (40 + 5 + 3.20) = $51.80
    expect(breakdown.estimatedNetProfit).toBe(51.8);
    expect(breakdown.estimatedGrossMarginPct).toBe(60.0);
    expect(breakdown.isEstimateOnly).toBe(true);
  });
});

describe("Unit Tests: Zod Validation Schemas", () => {
  it("should validate valid user registration payload", () => {
    const valid = registerSchema.safeParse({
      email: "entrepreneur@store.com",
      password: "StrongPassword123!",
      name: "Marcus Aurelius",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject weak password and invalid email", () => {
    const invalidEmail = registerSchema.safeParse({
      email: "not-an-email",
      password: "short",
      name: "M",
    });
    expect(invalidEmail.success).toBe(false);
  });

  it("should validate store slug format (lowercase alphanumeric and hyphens)", () => {
    const valid = createStoreSchema.safeParse({
      name: "Nordic Home",
      slug: "nordic-home-2026",
    });
    expect(valid.success).toBe(true);

    const invalidSlug = createStoreSchema.safeParse({
      name: "Nordic Home",
      slug: "Nordic Home Invalid!",
    });
    expect(invalidSlug.success).toBe(false);
  });
});

describe("Unit Tests: AI Store Generator & Conversational Modifiers", () => {
  it("should generate a complete, validated store configuration from a sneaker prompt", async () => {
    const { aiStoreService } = await import("../src/modules/ai/ai.service.js");
    const result = await aiStoreService.generateStoreFromPrompt({
      prompt: "Build a premium sneaker ecommerce store named UrbanStep with a black and white theme",
      storeName: "UrbanStep",
    });

    expect(result.brand.name).toBe("UrbanStep");
    expect(result.brand.slug).toContain("urbanstep");
    expect(result.theme.primaryColor).toBeDefined();
    expect(result.header.showAnnouncement).toBe(true);
    expect(result.sections.length).toBeGreaterThanOrEqual(4);
    expect(result.sampleProducts.length).toBeGreaterThanOrEqual(2);
    expect(result.sampleProducts[0].price).toBeGreaterThan(0);
  });

  it("should modify theme and layout conversational instructions while preserving other settings", async () => {
    const { aiStoreService } = await import("../src/modules/ai/ai.service.js");
    const initial = await aiStoreService.generateStoreFromPrompt({
      prompt: "Build an artisan coffee store",
    });

    const modified = await aiStoreService.modifyStoreConfig({
      prompt: "Change theme to dark green and add promo banner",
      currentConfig: initial,
    });

    expect(modified.updatedConfig.theme.primaryColor).toBe("#064e3b");
    expect(modified.updatedConfig.theme.accentColor).toBe("#10b981");
    expect(modified.changesSummary).toContain("green");
    // Ensure brand name preserved
    expect(modified.updatedConfig.brand.name).toBe(initial.brand.name);
  });
});

