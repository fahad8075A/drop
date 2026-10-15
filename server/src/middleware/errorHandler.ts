import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/response.js";
import { config } from "../config/index.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Handle Zod Schema validation failures
  if (err instanceof ZodError) {
    sendError(
      res,
      "Validation failed. Please verify request parameters.",
      400,
      "VALIDATION_ERROR",
      err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }))
    );
    return;
  }

  // Handle custom status errors
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error occurred.";
  const code = err.code || "INTERNAL_ERROR";

  if (config.NODE_ENV !== "test") {
    console.error(`[Error] ${req.method} ${req.url} - ${statusCode}:`, err);
  }

  // Never leak internal stack traces in production
  sendError(
    res,
    message,
    statusCode,
    code,
    config.NODE_ENV === "development" ? err.stack : undefined
  );
}
