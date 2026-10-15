import { Router } from "express";
import { suppliersController } from "./suppliers.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireStoreMembership } from "../../middleware/tenantAuth.js";

const router = Router();

// List global system supplier adapters
router.get("/", requireAuth, (req, res, next) => suppliersController.listAvailable(req, res, next));
router.get("/search", requireAuth, (req, res, next) => suppliersController.search(req, res, next));

// Tenant-scoped supplier connections
router.get(
  "/:storeId/connections",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN"]),
  (req, res, next) => suppliersController.getStoreConnections(req, res, next)
);

router.post(
  "/:storeId/connect",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN"]),
  (req, res, next) => suppliersController.connect(req, res, next)
);

router.post(
  "/:storeId/import",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "EDITOR"]),
  (req, res, next) => suppliersController.import(req, res, next)
);

export default router;
