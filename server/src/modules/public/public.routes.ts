import { Router } from "express";
import { publicStorefrontController } from "./public.controller.js";

const router = Router();

// Store resolution by slug
router.get("/store/:slug", (req, res, next) =>
  publicStorefrontController.resolveStore(req, res, next)
);

// Product details
router.get("/store/:slug/products/:productSlug", (req, res, next) =>
  publicStorefrontController.getProduct(req, res, next)
);

// Cart checkout (calculates price on server)
router.post("/store/:slug/checkout", (req, res, next) =>
  publicStorefrontController.checkout(req, res, next)
);

// Payment confirmation
router.post("/store/:slug/checkout/verify-payment", (req, res, next) =>
  publicStorefrontController.verifyPayment(req, res, next)
);

export default router;
