import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { blogPost } from "@/db/schema";
import { eq , desc } from "drizzle-orm";
import { env } from "@/env";
import { encodeIdWithSecret } from "@/lib/crypto/dataEncoding";

export async function GET(): Promise<Response>  {
  try {
    const posts = await db
      .select()
      .from(blogPost)
      .where(eq(blogPost.status, "visible"))
      .orderBy(desc(blogPost.date));

    // encode posts ids
    posts.map((post) => {
     post.id = encodeIdWithSecret(post.id, env.SECRET_KEY);
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
