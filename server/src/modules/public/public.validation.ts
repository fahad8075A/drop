import { z } from "zod";

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    name: z.string().min(2),
    addressLine1: z.string().min(3),
    addressLine2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().min(2),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional(),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      })
    )
    .min(1, "Cart cannot be empty"),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1),
  provider: z.string().default("SANDBOX"),
  paymentId: z.string().min(1),
});
