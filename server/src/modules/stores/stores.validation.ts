import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  templateId: z.string().optional(),
  currency: z.string().default("USD"),
  locale: z.string().default("en-US"),
});

export const updateStoreSchema = z.object({
  name: z.string().min(2).optional(),
  currency: z.string().length(3).optional(),
  locale: z.string().optional(),
  templateId: z.string().optional(),
});

export const addDomainSchema = z.object({
  domain: z
    .string()
    .min(4)
    .regex(/^([a-z0-9-]+\.)+[a-z]{2,}$/i, "Invalid domain format"),
});
