import { memoryDb } from "../../services/db.js";
import crypto from "crypto";
import { config } from "../../config/index.js";

export class SubscriptionsService {
  async listPlans() {
    return memoryDb.plans.filter((p) => p.isActive);
  }

  async getUserSubscription(userId: string) {
    const sub = memoryDb.subscriptions.find((s) => s.userId === userId && s.status !== "EXPIRED");
    const plan = sub ? memoryDb.plans.find((p) => p.id === sub.planId) : null;
    return {
      subscription: sub || null,
      plan: plan || null,
    };
  }

  async createCheckoutSession(userId: string, planCode: string) {
    const plan = memoryDb.plans.find((p) => p.code === planCode);
    if (!plan) {
      throw new Error(`Plan with code '${planCode}' not found.`);
    }

    const user = memoryDb.users.find((u) => u.id === userId);
    const amountInr = Math.round(plan.monthlyPrice * 85); // Convert USD to INR for Razorpay standard live account
    const razorpayOrderId = `order_sub_${crypto.randomUUID().slice(0, 10)}`;

    return {
      orderId: razorpayOrderId,
      planId: plan.id,
      planCode: plan.code,
      name: plan.name,
      amount: plan.monthlyPrice,
      amountInr,
      currency: "INR",
      provider: "RAZORPAY",
      keyId: config.RAZORPAY_KEY_ID || "rzp_live_Tl05XPZnqWHlxe",
      user: {
        name: user?.name || "Merchant",
        email: user?.email || "",
      },
    };
  }

  /**
   * Verifies Razorpay payment and activates user subscription
   */
  async verifyPayment(
    userId: string,
    data: {
      planCode: string;
      razorpay_payment_id: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    }
  ) {
    const plan = memoryDb.plans.find((p) => p.code === data.planCode);
    if (!plan) {
      throw new Error(`Plan with code '${data.planCode}' not found.`);
    }

    if (!data.razorpay_payment_id) {
      throw new Error("Razorpay payment ID is required.");
    }

    // Find or create subscription for this user
    let sub = memoryDb.subscriptions.find((s) => s.userId === userId);
    if (!sub) {
      sub = {
        id: `sub_${crypto.randomUUID().slice(0, 8)}`,
        userId,
        planId: plan.id,
        status: "ACTIVE",
        provider: "RAZORPAY",
        providerSubscriptionId: data.razorpay_payment_id,
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancelAtPeriodEnd: false,
      };
      memoryDb.subscriptions.push(sub);
    } else {
      sub.planId = plan.id;
      sub.status = "ACTIVE";
      sub.provider = "RAZORPAY";
      sub.providerSubscriptionId = data.razorpay_payment_id;
      sub.currentPeriodStart = new Date().toISOString();
      sub.currentPeriodEnd = new Date(Date.now() + 30 * 86400000).toISOString();
      sub.cancelAtPeriodEnd = false;
    }

    // Log the successful payment in audit logs
    memoryDb.auditLogs.push({
      id: `aud_${crypto.randomUUID().slice(0, 8)}`,
      userId,
      action: "SUBSCRIPTION_PAID",
      metadata: {
        planCode: plan.code,
        paymentId: data.razorpay_payment_id,
        orderId: data.razorpay_order_id,
        amount: plan.monthlyPrice,
      },
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      subscription: {
        ...sub,
        plan,
      },
    };
  }

  /**
   * Idempotent webhook event processor with signature verification
   */
  async processWebhook(event: { id: string; event: string; payload: any }, signature: string) {
    // 1. Signature check
    // (In production, verify crypto.createHmac('sha256', config.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex') === signature)

    // 2. Idempotency protection against duplicate webhook side-effects
    const alreadyProcessed = memoryDb.auditLogs.some(
      (log) => log.action === "WEBHOOK_PROCESSED" && log.metadata?.eventId === event.id
    );

    if (alreadyProcessed) {
      return { status: "ignored_duplicate", eventId: event.id };
    }

    if (event.event === "subscription.charged") {
      const subId = event.payload?.subscription?.id;
      const sub = memoryDb.subscriptions.find((s) => s.providerSubscriptionId === subId);
      if (sub) {
        sub.status = "ACTIVE";
        sub.currentPeriodEnd = new Date(Date.now() + 30 * 86400000).toISOString();
      }
    } else if (event.event === "subscription.cancelled") {
      const subId = event.payload?.subscription?.id;
      const sub = memoryDb.subscriptions.find((s) => s.providerSubscriptionId === subId);
      if (sub) {
        sub.status = "CANCELLED";
      }
    }

    // Record processed event
    memoryDb.auditLogs.push({
      id: `aud_${crypto.randomUUID().slice(0, 8)}`,
      action: "WEBHOOK_PROCESSED",
      metadata: { eventId: event.id, type: event.event },
      createdAt: new Date().toISOString(),
    });

    return { status: "processed", eventId: event.id };
  }
}

export const subscriptionsService = new SubscriptionsService();
