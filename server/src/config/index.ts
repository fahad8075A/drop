import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/droppilot?schema=public"),
  AUTH_SECRET: z.string().min(16).default("super-secret-auth-key-change-this-in-production-min-32-chars-long"),
  ENCRYPTION_KEY: z.string().min(32).default("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
  CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  RAZORPAY_KEY_ID: z.string().default("rzp_test_mock_saas_key"),
  RAZORPAY_KEY_SECRET: z.string().default("mock_saas_secret"),
  RAZORPAY_WEBHOOK_SECRET: z.string().default("mock_webhook_secret_key"),
  SUPPLIER_API_BASE_URL: z.string().default("https://api-sg.aliexpress.com/sync"),
  SUPPLIER_CLIENT_ID: z.string().default("mock_supplier_client_id"),
  SUPPLIER_CLIENT_SECRET: z.string().default("mock_supplier_client_secret"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables configuration:", parsedEnv.error.format());
  throw new Error("Invalid environment configuration.");
}

export const config = parsedEnv.data;
