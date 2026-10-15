import { Request, Response, NextFunction } from "express";
import { storesService } from "./stores.service.js";
import { createStoreSchema, updateStoreSchema } from "./stores.validation.js";
import { sendSuccess } from "../../utils/response.js";

export class StoresController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const stores = await storesService.listUserStores(req.user!.userId);
      sendSuccess(res, stores);
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const store = await storesService.getStoreById(req.params.storeId);
      sendSuccess(res, store);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createStoreSchema.parse(req.body);
      const store = await storesService.createStore(req.user!.userId, validated);
      sendSuccess(res, store, "Store created successfully.", 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateStoreSchema.parse(req.body);
      const store = await storesService.updateStore(req.params.storeId, validated);
      sendSuccess(res, store, "Store configuration updated.");
    } catch (err) {
      next(err);
    }
  }

  async publish(req: Request, res: Response, next: NextFunction) {
    try {
      const store = await storesService.publishStore(req.params.storeId);
      sendSuccess(res, store, "Store published successfully! Live storefront is now active.");
    } catch (err) {
      next(err);
    }
  }
}

export const storesController = new StoresController();
