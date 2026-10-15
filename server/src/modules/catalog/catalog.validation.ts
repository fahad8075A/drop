import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(2, "Product title must be at least 2 characters"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().positive("Price must be greater than 0"),
  compareAtPrice: z.number().positive().optional(),
  supplierCost: z.number().nonnegative().optional(),
  sku: z.string().optional(),
  inventoryCount: z.number().int().nonnegative().default(0),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  variants: z
    .array(
      z.object({
        title: z.string().min(1),
        sku: z.string().optional(),
        price: z.number().positive(),
        supplierCost: z.number().nonnegative().optional(),
        inventoryCount: z.number().int().nonnegative(),
        options: z.record(z.string()).optional(),
      })
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();
