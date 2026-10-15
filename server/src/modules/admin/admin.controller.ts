import { Request, Response, NextFunction } from "express";
import { memoryDb } from "../../services/db.js";
import { sendSuccess } from "../../utils/response.js";
import crypto from "crypto";

export class AdminController {
  async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const totalUsers = memoryDb.users.length;
      const totalStores = memoryDb.stores.length;
      const activeStores = memoryDb.stores.filter((s) => s.status === "PUBLISHED").length;
      const totalOrders = memoryDb.orders.length;
      const grossMerchandiseValue = memoryDb.orders
        .filter((o) => o.status !== "CANCELLED")
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const activeSubscriptions = memoryDb.subscriptions.filter((s) => s.status === "ACTIVE").length;

      sendSuccess(res, {
        totalUsers,
        totalStores,
        activeStores,
        totalOrders,
        grossMerchandiseValue: Number(grossMerchandiseValue.toFixed(2)),
        activeSubscriptions,
        platformUptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = memoryDb.users.map((u) => {
        const storeCount = memoryDb.memberships.filter((m) => m.userId === u.id).length;
        const sub = memoryDb.subscriptions.find((s) => s.userId === u.id);
        const plan = sub ? memoryDb.plans.find((p) => p.id === sub.planId) : null;
        return {
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          emailVerified: u.emailVerified,
          storeCount,
          planName: plan?.name || "Free Trial",
          createdAt: u.createdAt,
        };
      });
      sendSuccess(res, users);
    } catch (err) {
      next(err);
    }
  }

  async listStores(req: Request, res: Response, next: NextFunction) {
    try {
      const stores = memoryDb.stores.map((s) => {
        const ownerMembership = memoryDb.memberships.find((m) => m.storeId === s.id && m.role === "OWNER");
        const owner = ownerMembership ? memoryDb.users.find((u) => u.id === ownerMembership.userId) : null;
        const productCount = memoryDb.products.filter((p) => p.storeId === s.id).length;
        const orderCount = memoryDb.orders.filter((o) => o.storeId === s.id).length;

        return {
          ...s,
          ownerName: owner?.name || "Unknown",
          ownerEmail: owner?.email || "Unknown",
          productCount,
          orderCount,
        };
      });
      sendSuccess(res, stores);
    } catch (err) {
      next(err);
    }
  }

  async updateStoreStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const { status } = req.body; // e.g. "SUSPENDED" or "PUBLISHED"

      const store = memoryDb.stores.find((s) => s.id === storeId);
      if (!store) {
        throw new Error("Store not found.");
      }

      const prevStatus = store.status;
      store.status = status;
      store.updatedAt = new Date().toISOString();

      // Record audit log
      memoryDb.auditLogs.push({
        id: `aud_${crypto.randomUUID().slice(0, 8)}`,
        userId: req.user!.userId,
        storeId: store.id,
        action: "STORE_STATUS_OVERRIDE",
        metadata: { from: prevStatus, to: status },
        createdAt: new Date().toISOString(),
      });

      sendSuccess(res, store, `Store status updated to ${status}.`);
    } catch (err) {
      next(err);
    }
  }

  async listAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      sendSuccess(res, memoryDb.auditLogs.slice(-50).reverse());
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
