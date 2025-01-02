// drizzle.config.ts
import type { Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql", // Changed from "mysql" to "pg" for PostgreSQL
  dbCredentials: {
    host: env.DATABASE_HOST!,
    user: env.DATABASE_USERNAME!,
    password: env.DATABASE_PASSWORD!,
    database: env.DATABASE_NAME!,
    port: env.DATABASE_PORT ? Number(env.DATABASE_PORT) : 5432, // Default PostgreSQL port
    ssl: false, // Optional SSL configuration
  },
} satisfies Config;