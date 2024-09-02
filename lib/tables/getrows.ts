import { db } from "@/db";
import {
  blogPost,
  contactFormEntries,
  newsLetterFormEntries,
  project,
  tag,
  technology,
} from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getRowsFromTableWithLimit<
  T extends
    | typeof project
    | typeof blogPost
    | typeof contactFormEntries
    | typeof newsLetterFormEntries
    | typeof tag
    | typeof technology,
>(table: T, limitReturn?: number | undefined) {
  if (!limitReturn) {
    return await db.select().from(table).orderBy(desc(table.id));
  }

  return await db
    .select()
    .from(table)
    .orderBy(desc(table.id))
    .limit(limitReturn);
}
