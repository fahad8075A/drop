import { Router } from "express";
import { ordersController } from "./orders.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireStoreMembership } from "../../middleware/tenantAuth.js";

const router = Router();

router.get(
  "/:storeId/orders",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "EDITOR", "FULFILLMENT"]),
  (req, res, next) => ordersController.list(req, res, next)
);

router.get(
  "/:storeId/orders/:orderId",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "EDITOR", "FULFILLMENT"]),
  (req, res, next) => ordersController.get(req, res, next)
);

router.post(
  "/:storeId/orders/:orderId/fulfill",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "FULFILLMENT"]),
  (req, res, next) => ordersController.fulfill(req, res, next)
);

router.put(
  "/:storeId/orders/:orderId/status",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN"]),
  (req, res, next) => ordersController.updateStatus(req, res, next)
);

export default router;
