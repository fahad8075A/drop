import { memoryDb } from "../../services/db.js";
import crypto from "crypto";

export class CatalogService {
  /**
   * Calculates realistic profit estimate breakdown
   */
  calculateProfitEstimate(price: number, supplierCost: number = 0, shippingCost: number = 0) {
    const paymentGatewayFee = price * 0.029 + 0.3; // Standard 2.9% + $0.30
    const totalCost = supplierCost + shippingCost + paymentGatewayFee;
    const estimatedNetProfit = price - totalCost;
    const estimatedGrossMargin = price > 0 ? ((price - supplierCost) / price) * 100 : 0;
    const estimatedNetMargin = price > 0 ? (estimatedNetProfit / price) * 100 : 0;

    return {
      sellingPrice: Number(price.toFixed(2)),
      supplierCost: Number(supplierCost.toFixed(2)),
      estimatedPaymentFee: Number(paymentGatewayFee.toFixed(2)),
      estimatedShippingCost: Number(shippingCost.toFixed(2)),
      estimatedNetProfit: Number(estimatedNetProfit.toFixed(2)),
      estimatedGrossMarginPct: Number(estimatedGrossMargin.toFixed(1)),
      estimatedNetMarginPct: Number(estimatedNetMargin.toFixed(1)),
      isEstimateOnly: true,
      disclaimer: "Profit estimates are projected and exclude platform subscription fees, ad spend, and local sales taxes.",
    };
  }

  async listProducts(storeId: string, query?: { search?: string; status?: string }) {
    let products = memoryDb.products.filter((p) => p.storeId === storeId);

    if (query?.status) {
      products = products.filter((p) => p.status === query.status);
    }

    if (query?.search) {
      const term = query.search.toLowerCase();
      products = products.filter(
        (p) => p.title.toLowerCase().includes(term) || p.sku?.toLowerCase().includes(term)
      );
    }

    return products.map((p) => {
      const variants = memoryDb.variants.filter((v) => v.productId === p.id);
      const profit = this.calculateProfitEstimate(p.price, p.supplierCost || 0);
      return {
        ...p,
        variants,
        profitEstimate: profit,
      };
    });
  }

  async getProduct(storeId: string, productId: string) {
    const product = memoryDb.products.find((p) => p.id === productId && p.storeId === storeId);
    if (!product) {
      throw new Error("Product not found in this store.");
    }
    const variants = memoryDb.variants.filter((v) => v.productId === product.id);
    const profit = this.calculateProfitEstimate(product.price, product.supplierCost || 0);

    return {
      ...product,
      variants,
      profitEstimate: profit,
    };
  }

  async createProduct(storeId: string, data: any) {
    // 1. Slug uniqueness within this store
    const existing = memoryDb.products.find(
      (p) => p.storeId === storeId && p.slug === data.slug.toLowerCase().trim()
    );
    if (existing) {
      throw new Error(`A product with slug '${data.slug}' already exists in this store.`);
    }

    // 2. Entitlement product limit check
    const store = memoryDb.stores.find((s) => s.id === storeId);
    const ownerMembership = memoryDb.memberships.find((m) => m.storeId === storeId && m.role === "OWNER");
    if (ownerMembership) {
      const subscription = memoryDb.subscriptions.find((s) => s.userId === ownerMembership.userId && s.status !== "EXPIRED");
      const plan = subscription ? memoryDb.plans.find((p) => p.id === subscription.planId) : null;
      const currentProductsCount = memoryDb.products.filter((p) => p.storeId === storeId).length;
      const maxAllowed = plan ? plan.maxProducts : 50;

      if (currentProductsCount >= maxAllowed) {
        throw new Error(
          `Product limit reached. Your subscription plan allows up to ${maxAllowed} products per store. Please upgrade your plan.`
        );
      }
    }

    const newProduct = {
      id: `prod_${crypto.randomUUID().slice(0, 8)}`,
      storeId,
      title: data.title,
      slug: data.slug.toLowerCase().trim(),
      description: data.description,
      price: Number(data.price),
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
      supplierCost: data.supplierCost ? Number(data.supplierCost) : null,
      sku: data.sku || `SKU-${Date.now().toString().slice(-6)}`,
      inventoryCount: data.inventoryCount || 0,
      status: data.status || "DRAFT",
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.description.slice(0, 160),
      images: data.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryDb.products.push(newProduct);

    // Save variants if provided
    const createdVariants = [];
    if (data.variants && Array.isArray(data.variants)) {
      for (const v of data.variants) {
        const variantObj = {
          id: `var_${crypto.randomUUID().slice(0, 8)}`,
          productId: newProduct.id,
          title: v.title,
          sku: v.sku || `${newProduct.sku}-${v.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          price: Number(v.price),
          supplierCost: v.supplierCost ? Number(v.supplierCost) : newProduct.supplierCost,
          inventoryCount: v.inventoryCount || 0,
          options: v.options || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        memoryDb.variants.push(variantObj);
        createdVariants.push(variantObj);
      }
    }

    return {
      ...newProduct,
      variants: createdVariants,
      profitEstimate: this.calculateProfitEstimate(newProduct.price, newProduct.supplierCost || 0),
    };
  }

  async updateProduct(storeId: string, productId: string, data: any) {
    const product = memoryDb.products.find((p) => p.id === productId && p.storeId === storeId);
    if (!product) {
      throw new Error("Product not found in this store.");
    }

    if (data.title) product.title = data.title;
    if (data.description) product.description = data.description;
    if (data.price !== undefined) product.price = Number(data.price);
    if (data.compareAtPrice !== undefined) product.compareAtPrice = Number(data.compareAtPrice);
    if (data.supplierCost !== undefined) product.supplierCost = Number(data.supplierCost);
    if (data.sku) product.sku = data.sku;
    if (data.inventoryCount !== undefined) product.inventoryCount = Number(data.inventoryCount);
    if (data.status) product.status = data.status;
    if (data.images) product.images = data.images;
    product.updatedAt = new Date().toISOString();

    return product;
  }

  async deleteProduct(storeId: string, productId: string) {
    const index = memoryDb.products.findIndex((p) => p.id === productId && p.storeId === storeId);
    if (index === -1) {
      throw new Error("Product not found in this store.");
    }

    const removed = memoryDb.products.splice(index, 1)[0];
    // Remove associated variants
    memoryDb.variants = memoryDb.variants.filter((v) => v.productId !== productId);
    return removed;
  }
}

export const catalogService = new CatalogService();
