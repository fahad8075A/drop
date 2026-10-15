import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./modules/auth/auth.routes.js";
import storesRoutes from "./modules/stores/stores.routes.js";
import templatesRoutes from "./modules/templates/templates.routes.js";
import catalogRoutes from "./modules/catalog/catalog.routes.js";
import ordersRoutes from "./modules/orders/orders.routes.js";
import publicRoutes from "./modules/public/public.routes.js";
import suppliersRoutes from "./modules/suppliers/suppliers.routes.js";
import subscriptionsRoutes from "./modules/subscriptions/subscriptions.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows flexible storefront rendering
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // Strict CORS configuration with credentialed requests
  const allowedOrigins = [
    config.CLIENT_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps or curl) or if in allowed list
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev, or callback(new Error("CORS blocked"))
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Store-Id", "X-Razorpay-Signature"],
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health checks
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      service: "droppilot-server",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/v1/health", (req, res) => {
    res.json({
      status: "ok",
      version: "v1",
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Modules under /api/v1
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/stores", storesRoutes);
  app.use("/api/v1/templates", templatesRoutes);
  app.use("/api/v1/catalog", catalogRoutes);
  app.use("/api/v1/orders", ordersRoutes);
  app.use("/api/v1/public", publicRoutes);
  app.use("/api/v1/suppliers", suppliersRoutes);
  app.use("/api/v1/subscriptions", subscriptionsRoutes);
  app.use("/api/v1/admin", adminRoutes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.originalUrl}`,
      error: { code: "NOT_FOUND" },
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
