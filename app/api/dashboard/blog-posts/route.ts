import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPost, blogPostTag, blogPostTechnology } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth/validate-request";
import { unlink, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const thumbnail = formData.get("thumbnail") as File | null;
    const status = formData.get("status") as "visible" | "invisible";
    const author = formData.get("author") as string;
    const date = formData.get("date") as string;
    const markdownContent = formData.get("markdownContent") as string;
    const tagsId = JSON.parse(formData.get("tagsId") as string) as number[];
    const technologiesId = JSON.parse(
      formData.get("technologiesId") as string,
    ) as number[];

    console.log("tagsId", tagsId, typeof tagsId);
    console.log("technologiesId", technologiesId);

    if (
      !slug ||
      !title ||
      !summary ||
      !status ||
      !author ||
      !date ||
      !markdownContent
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    let fileName = null;
    if (thumbnail) {
      const bytes = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileName = `${Date.now()}-${thumbnail.name}`;
      const thumbnailPath = `/uploads/blog-posts-thumbnails/${fileName}`;
      const fullPath = path.join(process.cwd(), "public", thumbnailPath);
      await writeFile(fullPath, buffer);
    }

    // Save markdown content
    const markdownFileName = `${slug}.md`;
    const markdownPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "blog-posts-markdowns",
      markdownFileName,
    );
    await writeFile(markdownPath, markdownContent);

    const newBlogPost = await db
      .insert(blogPost)
      .values({
        slug,
        title,
        summary,
        thumbnail: fileName ? fileName : null,
        status,
        author,
        date: new Date(date),
      })
      .execute();

    // add tags
    if (tagsId) {
      await db.insert(blogPostTag).values(
        tagsId.map((tagId) => ({
          blogPostId: newBlogPost[0].insertId,
          tagId,
        })),
      );
    }

    // add technologies
    if (technologiesId) {
      await db.insert(blogPostTechnology).values(
        technologiesId.map((technologyId) => ({
          blogPostId: newBlogPost[0].insertId,
          technologyId,
        })),
      );
    }

    revalidatePath("/dashboard/blog-posts");
    return NextResponse.json(
      { success: true, blogPost: newBlogPost[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id in request body" },
        { status: 400 },
      );
    }

    const blogPostRow = await db
      .select()
      .from(blogPost)
      .where(eq(blogPost.id, id))
      .limit(1);

    if (!blogPostRow.length) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 },
      );
    }

    if (blogPostRow[0].thumbnail) {
      //delete thumbnail
      await unlink(
        path.join(
          process.cwd(),
          "public",
          "uploads/blog-posts-thumbnails",
          blogPostRow[0].thumbnail,
        ),
      );
    }

    //delete markdown file
    await unlink(
      path.join(
        process.cwd(),
        "public",
        "uploads/blog-posts-markdowns",
        blogPostRow[0].slug + ".md",
      ),
    );

    await db.delete(blogPost).where(eq(blogPost.id, id));
    revalidatePath("/dashboard/blog-posts");
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete the blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete the blog post" },
      { status: 500 },
    );
  }
}
