import { Router } from "express";
import { subscriptionsController } from "./subscriptions.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

// Public plan catalog
router.get("/plans", (req, res, next) => subscriptionsController.listPlans(req, res, next));

// User active subscription
router.get("/current", requireAuth, (req, res, next) =>
  subscriptionsController.getMySubscription(req, res, next)
);

router.post("/checkout", requireAuth, (req, res, next) =>
  subscriptionsController.createCheckout(req, res, next)
);

// Signed provider webhook endpoint
router.post("/webhook", (req, res, next) => subscriptionsController.webhook(req, res, next));

export default router;
