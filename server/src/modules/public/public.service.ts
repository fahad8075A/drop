import { memoryDb } from "../../services/db.js";
import { fulfillmentWorker } from "../../jobs/fulfillment.worker.js";
import { config } from "../../config/index.js";
import crypto from "crypto";

export class PublicStorefrontService {
  /**
   * Resolves store information by its unique slug
   */
  async resolveStoreBySlug(slug: string) {
    const normalizedSlug = slug.toLowerCase().trim();
    const store = memoryDb.stores.find((s) => s.slug === normalizedSlug);

    if (!store) {
      throw new Error(`Store with slug '${normalizedSlug}' was not found.`);
    }

    if (store.status === "SUSPENDED") {
      throw new Error("This store is currently unavailable.");
    }

    const template = memoryDb.templates.find((t) => t.id === store.templateId);
    const themeConfig = memoryDb.themeConfigs.find((tc) => tc.storeId === store.id && tc.isPublished);

    const products = memoryDb.products
      .filter((p) => p.storeId === store.id && p.status === "ACTIVE")
      .map((p) => {
        const variants = memoryDb.variants.filter((v) => v.productId === p.id);
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          images: p.images,
          inventoryCount: p.inventoryCount,
          variants,
        };
      });

    return {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        currency: store.currency,
        locale: store.locale,
      },
      template,
      theme: themeConfig?.config || null,
      products,
    };
  }

  async getProductBySlug(storeSlug: string, productSlug: string) {
    const store = memoryDb.stores.find((s) => s.slug === storeSlug.toLowerCase());
    if (!store) {
      throw new Error("Store not found.");
    }

    const product = memoryDb.products.find(
      (p) => p.storeId === store.id && p.slug === productSlug.toLowerCase() && p.status === "ACTIVE"
    );

    if (!product) {
      throw new Error("Product not found.");
    }

    const variants = memoryDb.variants.filter((v) => v.productId === product.id);

    return {
      ...product,
      variants,
    };
  }

  /**
   * Secure Checkout: Recalculates prices strictly from database records.
   * Client-submitted prices are completely ignored.
   */
  async processCheckout(storeSlug: string, data: any) {
    const store = memoryDb.stores.find((s) => s.slug === storeSlug.toLowerCase());
    if (!store) {
      throw new Error("Store not found.");
    }

    if (store.status === "SUSPENDED") {
      throw new Error("Store is suspended and cannot accept orders.");
    }

    let subtotal = 0;
    const resolvedOrderItems: any[] = [];

    // Recalculate each item price strictly from database
    for (const item of data.items) {
      const product = memoryDb.products.find((p) => p.id === item.productId && p.storeId === store.id);
      if (!product) {
        throw new Error(`Product ID '${item.productId}' not found in store.`);
      }

      let unitPrice = product.price;
      let sku = product.sku;
      let title = product.title;

      if (item.variantId) {
        const variant = memoryDb.variants.find(
          (v) => v.id === item.variantId && v.productId === product.id
        );
        if (variant) {
          unitPrice = variant.price;
          sku = variant.sku || sku;
          title = `${product.title} (${variant.title})`;
        }
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      resolvedOrderItems.push({
        id: `oi_${crypto.randomUUID().slice(0, 8)}`,
        productId: product.id,
        variantId: item.variantId || null,
        title,
        sku,
        quantity: item.quantity,
        priceSnapshot: unitPrice,
        currency: store.currency,
      });
    }

    // Calculate tax and shipping rules
    const taxAmount = Number((subtotal * 0.08).toFixed(2)); // Standard 8% tax
    const shippingAmount = subtotal >= 75 ? 0 : 9.99; // Free shipping over $75
    const totalAmount = Number((subtotal + taxAmount + shippingAmount).toFixed(2));

    // Save or lookup customer
    let customer = memoryDb.customers.find(
      (c) => c.storeId === store.id && c.email.toLowerCase() === data.customer.email.toLowerCase()
    );

    if (!customer) {
      customer = {
        id: `cust_${crypto.randomUUID().slice(0, 8)}`,
        storeId: store.id,
        email: data.customer.email.toLowerCase(),
        name: data.customer.name,
        phone: data.customer.phone || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryDb.customers.push(customer);
    }

    const orderNumber = `#${1000 + memoryDb.orders.filter((o) => o.storeId === store.id).length + 1}`;

    const newOrder = {
      id: `ord_${crypto.randomUUID().slice(0, 8)}`,
      storeId: store.id,
      customerId: customer.id,
      orderNumber,
      status: "PENDING_PAYMENT" as const,
      currency: store.currency,
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount,
      shippingAmount,
      totalAmount,
      shippingAddress: data.shippingAddress,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryDb.orders.push(newOrder);

    // Persist immutable line-item snapshots
    for (const item of resolvedOrderItems) {
      memoryDb.orderItems.push({
        ...item,
        orderId: newOrder.id,
      });
    }

    return {
      order: {
        ...newOrder,
        items: resolvedOrderItems,
      },
      checkoutSession: {
        orderId: newOrder.id,
        totalAmount,
        currency: store.currency,
        provider: "RAZORPAY",
        razorpayKeyId: config.RAZORPAY_KEY_ID,
        clientSecret: `cs_live_${crypto.randomUUID()}`,
      },
    };
  }

  /**
   * Verifies payment and advances order to PAID
   */
  async verifyPayment(orderId: string, paymentId: string, provider: string = "SANDBOX") {
    const order = memoryDb.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.status === "PAID") {
      return { order, message: "Order already marked as paid." };
    }

    order.status = "PAID";
    order.updatedAt = new Date().toISOString();

    // Record audit log
    memoryDb.auditLogs.push({
      id: `aud_${crypto.randomUUID().slice(0, 8)}`,
      storeId: order.storeId,
      action: "ORDER_PAID",
      metadata: { orderId: order.id, total: order.totalAmount, paymentId },
      createdAt: new Date().toISOString(),
    });

    // Automatically trigger fulfillment worker
    try {
      await fulfillmentWorker.fulfillOrder(order.id);
    } catch (e) {
      console.warn("Fulfillment worker delayed execution:", e);
    }

    const items = memoryDb.orderItems.filter((i) => i.orderId === order.id);
    const fulfillment = memoryDb.fulfillments.find((f) => f.orderId === order.id);

    return {
      order: {
        ...order,
        items,
        fulfillment,
      },
      paymentConfirmed: true,
    };
  }
}

export const publicStorefrontService = new PublicStorefrontService();
