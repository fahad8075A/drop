import { Router } from "express";
import { storesController } from "./stores.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireStoreMembership } from "../../middleware/tenantAuth.js";

const router = Router();

// Store listing and creation require active session
router.get("/", requireAuth, (req, res, next) => storesController.list(req, res, next));
router.post("/", requireAuth, (req, res, next) => storesController.create(req, res, next));

// Tenant-scoped routes require verified store membership
router.get("/:storeId", requireAuth, requireStoreMembership(["OWNER", "ADMIN", "EDITOR", "FULFILLMENT"]), (req, res, next) =>
  storesController.get(req, res, next)
);

router.put("/:storeId", requireAuth, requireStoreMembership(["OWNER", "ADMIN"]), (req, res, next) =>
  storesController.update(req, res, next)
);

router.post("/:storeId/publish", requireAuth, requireStoreMembership(["OWNER", "ADMIN"]), (req, res, next) =>
  storesController.publish(req, res, next)
);

export default router;
