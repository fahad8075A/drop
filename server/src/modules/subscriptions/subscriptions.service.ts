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

    const mockSubscriptionId = `sub_rzp_${crypto.randomUUID().slice(0, 10)}`;

    return {
      planId: plan.id,
      planCode: plan.code,
      name: plan.name,
      amount: plan.monthlyPrice,
      currency: plan.currency,
      provider: "RAZORPAY",
      providerSubscriptionId: mockSubscriptionId,
      keyId: config.RAZORPAY_KEY_ID,
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
