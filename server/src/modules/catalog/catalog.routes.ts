import { Router } from "express";
import { catalogController } from "./catalog.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireStoreMembership } from "../../middleware/tenantAuth.js";

const router = Router();

// All catalog operations within dashboard require membership of that store
router.get(
  "/:storeId/products",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "EDITOR", "FULFILLMENT"]),
  (req, res, next) => catalogController.list(req, res, next)
);

router.get(
  "/:storeId/products/:productId",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "EDITOR", "FULFILLMENT"]),
  (req, res, next) => catalogController.get(req, res, next)
);

router.post(
  "/:storeId/products",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "EDITOR"]),
  (req, res, next) => catalogController.create(req, res, next)
);

router.put(
  "/:storeId/products/:productId",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "EDITOR"]),
  (req, res, next) => catalogController.update(req, res, next)
);

router.delete(
  "/:storeId/products/:productId",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN"]),
  (req, res, next) => catalogController.delete(req, res, next)
);

export default router;
