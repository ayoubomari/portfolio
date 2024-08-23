import type { Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: env.DATABASE_HOST!,
    user: env.DATABASE_USERNAME!,
    password: env.DATABASE_PASSWORD!,
    database: env.DATABASE_NAME!,
  },
} satisfies Config;
