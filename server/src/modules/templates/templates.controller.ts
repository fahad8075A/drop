import { Request, Response, NextFunction } from "express";
import { templatesService } from "./templates.service.js";
import { updateThemeDraftSchema } from "./templates.validation.js";
import { sendSuccess } from "../../utils/response.js";

export class TemplatesController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await templatesService.listTemplates();
      sendSuccess(res, templates);
    } catch (err) {
      next(err);
    }
  }

  async getStoreTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const theme = await templatesService.getStoreTheme(req.params.storeId);
      sendSuccess(res, theme);
    } catch (err) {
      next(err);
    }
  }

  async saveDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateThemeDraftSchema.parse(req.body);
      const draft = await templatesService.saveDraft(req.params.storeId, validated);
      sendSuccess(res, draft, "Draft theme saved successfully.");
    } catch (err) {
      next(err);
    }
  }

  async publishTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const published = await templatesService.publishTheme(req.params.storeId);
      sendSuccess(res, published, "Theme published to live storefront.");
    } catch (err) {
      next(err);
    }
  }
}

export const templatesController = new TemplatesController();
