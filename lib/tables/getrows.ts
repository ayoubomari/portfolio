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

export const getRowsFromTableWithLimit = async function (
  table:
    | typeof project
    | typeof blogPost
    | typeof contactFormEntries
    | typeof newsLetterFormEntries
    | typeof tag
    | typeof technology,
  limitReturn?: number | undefined,
) {
  if (!limitReturn) {
    return await db.select().from(table).orderBy(desc(table.id));
  }

  return await db
    .select()
    .from(table)
    .orderBy(desc(table.id))
    .limit(limitReturn);
};
