import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { requirePlatformAdmin } from "../../middleware/auth.js";

const router = Router();

// All admin routes strictly require PLATFORM_ADMIN authorization
router.use(requirePlatformAdmin);

router.get("/metrics", (req, res, next) => adminController.getMetrics(req, res, next));
router.get("/users", (req, res, next) => adminController.listUsers(req, res, next));
router.get("/stores", (req, res, next) => adminController.listStores(req, res, next));
router.put("/stores/:storeId/status", (req, res, next) =>
  adminController.updateStoreStatus(req, res, next)
);
router.get("/audit-logs", (req, res, next) => adminController.listAuditLogs(req, res, next));

export default router;
