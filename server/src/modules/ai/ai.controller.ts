import { Request, Response, NextFunction } from "express";
import { aiStoreService } from "./ai.service.js";
import {
  generateStoreSchema,
  modifyStoreSchema,
  saveGeneratedStoreSchema,
} from "./ai.validation.js";
import { sendSuccess } from "../../utils/response.js";

export class AiStoreController {
  async generateStore(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = generateStoreSchema.parse(req.body);
      const generated = await aiStoreService.generateStoreFromPrompt(validated);
      sendSuccess(res, generated, "AI store configuration generated successfully.", 200);
    } catch (err) {
      next(err);
    }
  }

  async modifyStore(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = modifyStoreSchema.parse(req.body);
      const result = await aiStoreService.modifyStoreConfig({
        prompt: validated.prompt,
        currentConfig: validated.currentConfig as any,
      });
      sendSuccess(res, result, "Store configuration updated successfully.", 200);
    } catch (err) {
      next(err);
    }
  }

  async saveOrPublish(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = saveGeneratedStoreSchema.parse(req.body);
      const userId = req.user!.userId;
      const result = await aiStoreService.saveOrPublishStore(userId, {
        storeId: validated.storeId,
        name: validated.name,
        slug: validated.slug,
        config: validated.config as any,
        products: validated.products,
        publishNow: validated.publishNow,
      });
      sendSuccess(
        res,
        result,
        result.isPublished
          ? "Store published live! Customers can now checkout at your store URL."
          : "Store draft saved successfully.",
        200
      );
    } catch (err) {
      next(err);
    }
  }
}

export const aiStoreController = new AiStoreController();
