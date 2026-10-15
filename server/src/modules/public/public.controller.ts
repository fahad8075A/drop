import { Request, Response, NextFunction } from "express";
import { publicStorefrontService } from "./public.service.js";
import { checkoutSchema, verifyPaymentSchema } from "./public.validation.js";
import { sendSuccess } from "../../utils/response.js";

export class PublicStorefrontController {
  async resolveStore(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await publicStorefrontService.resolveStoreBySlug(req.params.slug);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await publicStorefrontService.getProductBySlug(
        req.params.slug,
        req.params.productSlug
      );
      sendSuccess(res, product);
    } catch (err) {
      next(err);
    }
  }

  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = checkoutSchema.parse(req.body);
      const result = await publicStorefrontService.processCheckout(req.params.slug, validated);
      sendSuccess(res, result, "Checkout initiated. Pending order generated.", 201);
    } catch (err) {
      next(err);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = verifyPaymentSchema.parse(req.body);
      const result = await publicStorefrontService.verifyPayment(
        validated.orderId,
        validated.paymentId,
        validated.provider
      );
      sendSuccess(res, result, "Payment verified successfully. Order confirmed!");
    } catch (err) {
      next(err);
    }
  }
}

export const publicStorefrontController = new PublicStorefrontController();
