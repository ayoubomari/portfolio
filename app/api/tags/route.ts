import { NextResponse } from "next/server";
import { db } from "@/db";
import { tag } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(): Promise<Response> {
  try {
    const tags = await db.select().from(tag).orderBy(desc(tag.id));

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
