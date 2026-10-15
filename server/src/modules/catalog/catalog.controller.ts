import { Request, Response, NextFunction } from "express";
import { catalogService } from "./catalog.service.js";
import { createProductSchema, updateProductSchema } from "./catalog.validation.js";
import { sendSuccess } from "../../utils/response.js";

export class CatalogController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await catalogService.listProducts(req.params.storeId, {
        search: req.query.search as string,
        status: req.query.status as string,
      });
      sendSuccess(res, products);
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await catalogService.getProduct(req.params.storeId, req.params.productId);
      sendSuccess(res, product);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createProductSchema.parse(req.body);
      const product = await catalogService.createProduct(req.params.storeId, validated);
      sendSuccess(res, product, "Product added to catalog.", 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateProductSchema.parse(req.body);
      const product = await catalogService.updateProduct(req.params.storeId, req.params.productId, validated);
      sendSuccess(res, product, "Product updated successfully.");
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const removed = await catalogService.deleteProduct(req.params.storeId, req.params.productId);
      sendSuccess(res, removed, "Product removed from store catalog.");
    } catch (err) {
      next(err);
    }
  }
}

export const catalogController = new CatalogController();
