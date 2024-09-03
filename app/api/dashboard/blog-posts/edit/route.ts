import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { blogPost, tag, technology } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/validate-request";
import fs from "fs";
import path from "path";

type BlogPostAPIResponse = typeof blogPost.$inferSelect & {
  tags: (typeof tag.$inferSelect)[];
  technologies: (typeof technology.$inferSelect)[];
  markdownContent: string;
};

export async function GET(req: NextRequest): Promise<Response> {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const blogPostId = url.searchParams.get("blogPostId");

  if (!blogPostId) {
    return NextResponse.json(
      { success: false, error: "Blog post ID is required" },
      { status: 400 },
    );
  }

  try {
    const blogPostResponse = await db.query.blogPost.findFirst({
      where: eq(blogPost.id, parseInt(blogPostId)),
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
        technologies: {
          with: {
            technology: true,
          },
        },
      },
    });

    if (!blogPostResponse) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 },
      );
    }

    // add mardown
    const markdownContent = await fs.promises.readFile(
      path.join(
        process.cwd(),
        "public",
        "uploads",
        "blog-posts-markdowns",
        blogPostResponse.slug + ".md",
      ),
      "utf-8",
    );

    const formattedResponse: BlogPostAPIResponse = {
      ...blogPostResponse,
      tags: blogPostResponse.tags.map((bt) => bt.tag),
      technologies: blogPostResponse.technologies.map((bt) => bt.technology),
      markdownContent,
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}
