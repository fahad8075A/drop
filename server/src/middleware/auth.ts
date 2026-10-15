import { Request, Response, NextFunction } from "express";
import { verifySessionToken, COOKIE_NAME, TokenPayload } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // Check Authorization Bearer header first, then Cookie
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }

  if (!token) {
    sendError(res, "Authentication required. No session token provided.", 401, "UNAUTHORIZED");
    return;
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    sendError(res, "Session has expired or is invalid. Please sign in again.", 401, "INVALID_SESSION");
    return;
  }

  req.user = payload;
  next();
}

export function requirePlatformAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== "PLATFORM_ADMIN") {
      sendError(res, "Forbidden: Platform Administrator privileges required.", 403, "FORBIDDEN");
      return;
    }
    next();
  });
}
