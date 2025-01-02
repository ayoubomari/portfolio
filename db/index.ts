import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";
import * as schema from "./schema";
import { env } from "@/env";

// Optionally, include DATABASE_PORT in your .env file if it's different from the default 5432
const pool = new Pool({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  port: env.DATABASE_PORT ? Number(env.DATABASE_PORT) : 5432, // Default PostgreSQL port
});

export const db = drizzle(pool, {
  schema,
});