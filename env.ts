import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  SECRET_KEY: z.string(),
  NEXT_PUBLIC_SITE_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_EMAIL: z.string().email(),
  SMTP_PASSWORD: z.string(),
  RECEIVER_EMAIL: z.string().email(),
});

export const env = envSchema.parse(process.env);