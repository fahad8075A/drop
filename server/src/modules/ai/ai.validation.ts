import { z } from "zod";

export const generateStoreSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters long"),
  storeName: z.string().optional(),
  category: z.string().optional(),
  brandColors: z
    .object({
      primary: z.string().optional(),
      accent: z.string().optional(),
      background: z.string().optional(),
    })
    .optional(),
  typography: z
    .object({
      headingFont: z.string().optional(),
      bodyFont: z.string().optional(),
    })
    .optional(),
});

export const modifyStoreSchema = z.object({
  prompt: z.string().min(3, "Modification prompt must be at least 3 characters long"),
  currentConfig: z.record(z.any()),
  storeId: z.string().optional(),
});

export const saveGeneratedStoreSchema = z.object({
  storeId: z.string().optional(),
  name: z.string().min(2, "Store name is required"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  config: z.record(z.any()),
  products: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        compareAtPrice: z.number().optional().nullable(),
        cost: z.number().optional(),
        category: z.string().optional(),
        sku: z.string().optional(),
        images: z.array(z.string()).optional(),
        badge: z.string().optional(),
      })
    )
    .optional(),
  publishNow: z.boolean().default(false),
});
