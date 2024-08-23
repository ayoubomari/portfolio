import { drizzle, MySql2DrizzleConfig } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { env } from "@/env";

const connection = await mysql.createConnection({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
});

export const db = drizzle(connection, {
  schema,
  mode: "default",
} as MySql2DrizzleConfig<typeof schema>);
