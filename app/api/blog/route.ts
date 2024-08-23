import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { blogPost } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  console.log("from api/blog/route.ts");

  try {
    const posts = await db
      .select()
      .from(blogPost)
      .where(eq(blogPost.status, "visible"));
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
