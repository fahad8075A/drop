import { Request, Response, NextFunction } from "express";
import { memoryDb } from "../services/db.js";
import { sendError } from "../utils/response.js";

// Extend Express Request interface with tenant context
declare global {
  namespace Express {
    interface Request {
      store?: any;
      membership?: any;
    }
  }
}

export type AllowedStoreRole = "OWNER" | "ADMIN" | "EDITOR" | "FULFILLMENT";

/**
 * Tenant Authorization Middleware
 * Ensures:
 * 1. Store exists.
 * 2. Authenticated user has an active membership for this specific store.
 * 3. User's role matches required role hierarchy.
 */
export function requireStoreMembership(allowedRoles: AllowedStoreRole[] = ["OWNER", "ADMIN", "EDITOR", "FULFILLMENT"]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.userId;
    const isPlatformAdmin = req.user?.role === "PLATFORM_ADMIN";

    // Extract storeId from route params or body or headers
    const storeId = req.params.storeId || req.body?.storeId || (req.headers["x-store-id"] as string);

    if (!storeId) {
      sendError(res, "Tenant identifier (storeId) is required.", 400, "MISSING_TENANT_ID");
      return;
    }

    // Lookup store
    const store = memoryDb.stores.find((s) => s.id === storeId);
    if (!store) {
      sendError(res, "Store not found.", 404, "STORE_NOT_FOUND");
      return;
    }

    // Platform Admins have override access for platform governance
    if (isPlatformAdmin) {
      req.store = store;
      req.membership = { userId, storeId, role: "OWNER" };
      next();
      return;
    }

    // Lookup user's membership for this store
    const membership = memoryDb.memberships.find(
      (m) => m.storeId === storeId && m.userId === userId
    );

    if (!membership) {
      sendError(
        res,
        "Access denied: You do not have permission to access or modify this store's data.",
        403,
        "TENANT_ACCESS_DENIED"
      );
      return;
    }

    // Check store role permissions
    if (!allowedRoles.includes(membership.role)) {
      sendError(
        res,
        `Permission denied: Operation requires one of [${allowedRoles.join(", ")}], but your role is ${membership.role}.`,
        403,
        "INSUFFICIENT_STORE_PERMISSIONS"
      );
      return;
    }

    // Check if store is suspended
    if (store.status === "SUSPENDED") {
      sendError(
        res,
        "This store is currently suspended by platform administration. Contact support.",
        403,
        "STORE_SUSPENDED"
      );
      return;
    }

    req.store = store;
    req.membership = membership;
    next();
  };
}
