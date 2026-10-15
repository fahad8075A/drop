import { Request, Response, NextFunction } from "express";
import { subscriptionsService } from "./subscriptions.service.js";
import { sendSuccess } from "../../utils/response.js";
import { z } from "zod";

const createCheckoutSchema = z.object({
  planCode: z.enum(["STARTER", "PRO", "ENTERPRISE"]),
});

export class SubscriptionsController {
  async listPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await subscriptionsService.listPlans();
      sendSuccess(res, plans);
    } catch (err) {
      next(err);
    }
  }

  async getMySubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const sub = await subscriptionsService.getUserSubscription(req.user!.userId);
      sendSuccess(res, sub);
    } catch (err) {
      next(err);
    }
  }

  async createCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createCheckoutSchema.parse(req.body);
      const session = await subscriptionsService.createCheckoutSession(
        req.user!.userId,
        validated.planCode
      );
      sendSuccess(res, session, "Subscription session generated.");
    } catch (err) {
      next(err);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await subscriptionsService.verifyPayment(req.user!.userId, req.body);
      sendSuccess(res, result, "Subscription payment verified and activated.");
    } catch (err) {
      next(err);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = (req.headers["x-razorpay-signature"] as string) || "mock_signature";
      const result = await subscriptionsService.processWebhook(req.body, signature);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export const subscriptionsController = new SubscriptionsController();
