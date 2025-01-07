import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  blogPost,
  blogPostImage,
  blogPostTag,
  blogPostTechnology,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth/validate-request";
import { unlink, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";

export const blogPostSchema = z.object({
  id: z.number().optional(), // Since `id` is auto-incremented, it can be optional
  slug: z.string().max(255),
  title: z.string().max(255),
  summary: z.string().max(255),
  thumbnail: z.any().optional(),
  status: z.enum(["visible", "invisible"]),
  author: z.string().max(255),
  date: z.string(),
  createdAt: z.string().optional(), // Optional if you want to infer during insert
  updatedAt: z.string().optional(), // Optional if you want to infer during insert
});

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
    const data = {
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      thumbnail: formData.get("thumbnail") as File | null,
      status: formData.get("status") as "visible" | "invisible",
      author: formData.get("author") as string,
      date: formData.get("date") as string,
      markdownContent: formData.get("markdownContent") as string,
      tagsId: JSON.parse(formData.get("tagsId") as string) as number[],
      technologiesId: JSON.parse(
        formData.get("technologiesId") as string,
      ) as number[],
    };

    // Validate the data using the Zod schema
    const validation = blogPostSchema.safeParse(data);
    if (!validation.success || data.markdownContent === "") {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    let fileName = null;
    if (data.thumbnail) {
      fileName = `${Date.now()}-${data.thumbnail.name}`;
    }

    const newBlogPost = await db
      .insert(blogPost)
      .values({
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        thumbnail: fileName ? fileName : null,
        status: data.status,
        author: data.author,
        date: new Date(data.date),
      })
      .returning({ id: blogPost.id })

    const newBlogPostId = newBlogPost[0].id; // Access the returned `id`

    // add tags
    if (Array.isArray(data.tagsId) && data.tagsId.length > 0) {
      await db.insert(blogPostTag).values(
        data.tagsId.map((tagId) => ({
          blogPostId: newBlogPostId,
          tagId,
        })),
      );
    }

    // add technologies
    if (Array.isArray(data.technologiesId) && data.technologiesId.length > 0) {
      await db.insert(blogPostTechnology).values(
        data.technologiesId.map((technologyId) => ({
          blogPostId: newBlogPostId,
          technologyId,
        })),
      );
    }

    // Save thumbnail
    if (data.thumbnail) {
      const bytes = await data.thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const thumbnailPath = `/uploads/blog-posts-thumbnails/${fileName}`;
      const fullPath = path.join(process.cwd(), "public", thumbnailPath);
      await writeFile(fullPath, buffer);
    }

    // Save markdown content
    const markdownFileName = `${data.slug}.md`;
    const markdownPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "blog-posts-markdowns",
      markdownFileName,
    );
    await writeFile(markdownPath, data.markdownContent);

    revalidatePath("/dashboard/blog-posts");
    revalidatePath("/blog");
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

export async function PUT(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const formData = await req.formData();

    const url = new URL(req.url);
    const blogPostId = url.searchParams.get("blogPostId");

    if (!blogPostId) {
      return NextResponse.json(
        { success: false, error: "Missing blog post ID" },
        { status: 400 },
      );
    }

    const data = {
      id: parseInt(blogPostId),
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      thumbnail: formData.get("thumbnail") as File | null,
      status: formData.get("status") as "visible" | "invisible",
      author: formData.get("author") as string,
      date: formData.get("date") as string,
      markdownContent: formData.get("markdownContent") as string,
      tagsId: JSON.parse(formData.get("tagsId") as string) as number[],
      technologiesId: JSON.parse(
        formData.get("technologiesId") as string,
      ) as number[],
    };

    // Validate the data using the Zod schema
    const validation = blogPostSchema.safeParse(data);
    if (!validation.success || data.markdownContent === "") {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    const existingBlogPost = await db.query.blogPost.findFirst({
      where: eq(blogPost.id, data.id),
    });

    if (!existingBlogPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 },
      );
    }

    let fileName = existingBlogPost.thumbnail;
    if (data.thumbnail) {
      // Delete old thumbnail if it exists
      if (existingBlogPost.thumbnail) {
        const oldThumbnailPath = path.join(
          process.cwd(),
          "public",
          "uploads/blog-posts-thumbnails",
          existingBlogPost.thumbnail,
        );
        await unlink(oldThumbnailPath);
      }

      // Save new thumbnail
      const bytes = await data.thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileName = `${Date.now()}-${data.thumbnail.name}`;
      const thumbnailPath = `/uploads/blog-posts-thumbnails/${fileName}`;
      const fullPath = path.join(process.cwd(), "public", thumbnailPath);
      await writeFile(fullPath, buffer);
    }

    // Update blog post
    await db
      .update(blogPost)
      .set({
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        thumbnail: fileName,
        status: data.status,
        author: data.author,
        date: new Date(data.date),
        updatedAt: new Date(),
      })
      .where(eq(blogPost.id, data.id));

    // Update tags
    await db.delete(blogPostTag).where(eq(blogPostTag.blogPostId, data.id));
    if (Array.isArray(data.tagsId) && data.tagsId.length > 0) {
      await db.insert(blogPostTag).values(
        data.tagsId.map((tagId) => ({
          blogPostId: data.id,
          tagId,
        })),
      );
    }

    // Update technologies
    await db
      .delete(blogPostTechnology)
      .where(eq(blogPostTechnology.blogPostId, data.id));
    if (Array.isArray(data.technologiesId) && data.technologiesId.length > 0) {
      await db.insert(blogPostTechnology).values(
        data.technologiesId.map((technologyId) => ({
          blogPostId: data.id,
          technologyId,
        })),
      );
    }

    // Update markdown content
    const markdownFileName = `${data.slug}.md`;
    const markdownPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "blog-posts-markdowns",
      markdownFileName,
    );
    await writeFile(markdownPath, data.markdownContent);

    revalidatePath("/dashboard/blog-posts");
    revalidatePath("/blog");
    return NextResponse.json(
      { success: true, blogPost: { id: data.id } },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
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

    //get all blog post images
    const blogPostImages = await db
      .select()
      .from(blogPostImage)
      .where(eq(blogPostImage.blogPostId, id));

    if (blogPostImages.length > 0) {
      //delete all blog post images file
      await Promise.all(
        blogPostImages.map(async (image) => {
          await unlink(
            path.join(
              process.cwd(),
              "public",
              "uploads/blog-posts-images",
              image.src,
            ),
          );
        }),
      );
    }

    await db.delete(blogPost).where(eq(blogPost.id, id));
    revalidatePath("/dashboard/blog-posts");
    revalidatePath("/blog");
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete the blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete the blog post" },
      { status: 500 },
    );
  }
}
