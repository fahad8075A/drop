import { Request, Response, NextFunction } from "express";
import { ordersService } from "./orders.service.js";
import { sendSuccess } from "../../utils/response.js";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "PAID",
    "PROCESSING",
    "PARTIALLY_FULFILLED",
    "FULFILLED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

export class OrdersController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await ordersService.listStoreOrders(req.params.storeId);
      sendSuccess(res, orders);
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await ordersService.getOrderDetails(req.params.storeId, req.params.orderId);
      sendSuccess(res, order);
    } catch (err) {
      next(err);
    }
  }

  async fulfill(req: Request, res: Response, next: NextFunction) {
    try {
      const fulfillment = await ordersService.triggerFulfillment(req.params.storeId, req.params.orderId);
      sendSuccess(res, fulfillment, "Supplier order dispatched and fulfillment tracking updated.");
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateStatusSchema.parse(req.body);
      const updated = await ordersService.updateOrderStatus(
        req.params.storeId,
        req.params.orderId,
        validated.status
      );
      sendSuccess(res, updated, `Order status transitioned to ${validated.status}.`);
    } catch (err) {
      next(err);
    }
  }
}

export const ordersController = new OrdersController();
