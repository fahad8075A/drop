import { Router } from "express";
import { templatesController } from "./templates.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireStoreMembership } from "../../middleware/tenantAuth.js";

const router = Router();

// Publicly list available system templates
router.get("/", (req, res, next) => templatesController.list(req, res, next));

// Tenant-specific theme operations
router.get(
  "/stores/:storeId",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "EDITOR"]),
  (req, res, next) => templatesController.getStoreTheme(req, res, next)
);

router.put(
  "/stores/:storeId/draft",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN", "EDITOR"]),
  (req, res, next) => templatesController.saveDraft(req, res, next)
);

router.post(
  "/stores/:storeId/publish",
  requireAuth,
  requireStoreMembership(["OWNER", "ADMIN"]),
  (req, res, next) => templatesController.publishTheme(req, res, next)
);

export default router;
