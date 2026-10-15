import { Request, Response, NextFunction } from "express";
import { suppliersService } from "./suppliers.service.js";
import { sendSuccess } from "../../utils/response.js";
import { z } from "zod";

const connectSupplierSchema = z.object({
  supplierId: z.string().min(1),
  credentials: z.record(z.any()),
});

const importProductSchema = z.object({
  supplierType: z.string().min(1),
  externalId: z.string().min(1),
  profitMarkup: z.number().positive().default(2.5),
});

export class SuppliersController {
  async listAvailable(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await suppliersService.listAvailableSuppliers();
      sendSuccess(res, suppliers);
    } catch (err) {
      next(err);
    }
  }

  async getStoreConnections(req: Request, res: Response, next: NextFunction) {
    try {
      const connections = await suppliersService.getStoreConnections(req.params.storeId);
      sendSuccess(res, connections);
    } catch (err) {
      next(err);
    }
  }

  async connect(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = connectSupplierSchema.parse(req.body);
      const result = await suppliersService.connectSupplier(
        req.params.storeId,
        validated.supplierId,
        validated.credentials
      );
      sendSuccess(res, result, "Supplier connected successfully with encrypted credential vault.");
    } catch (err) {
      next(err);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const type = (req.query.type as string) || "SANDBOX_MOCK";
      const q = (req.query.q as string) || "";
      const products = await suppliersService.searchSupplierProducts(type, q);
      sendSuccess(res, products);
    } catch (err) {
      next(err);
    }
  }

  async import(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = importProductSchema.parse(req.body);
      const imported = await suppliersService.importSupplierProduct(
        req.params.storeId,
        validated.supplierType,
        validated.externalId,
        validated.profitMarkup
      );
      sendSuccess(res, imported, "Supplier product imported into store catalog.", 201);
    } catch (err) {
      next(err);
    }
  }
}

export const suppliersController = new SuppliersController();
