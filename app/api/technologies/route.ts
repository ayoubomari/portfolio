import { NextResponse } from "next/server";
import { db } from "@/db";
import { technology } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(): Promise<Response> {
  try {
    const technologies = await db.select().from(technology).orderBy(desc(technology.id));

    console.log("technologies", technologies);

    return NextResponse.json(technologies);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
