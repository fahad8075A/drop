import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { setSessionCookie, clearSessionCookie } from "../../utils/jwt.js";
import { sendSuccess } from "../../utils/response.js";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await authService.register(validated);
      setSessionCookie(res, result.token);
      sendSuccess(res, result, "Account registered successfully.", 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await authService.login(validated);
      setSessionCookie(res, result.token);
      sendSuccess(res, result, "Signed in successfully.");
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      clearSessionCookie(res);
      sendSuccess(res, null, "Signed out successfully.");
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error("Unauthorized");
      }
      const data = await authService.getCurrentUser(req.user.userId);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
