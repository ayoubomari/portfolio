import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  project,
  projectImage,
  projectTag,
  projectTechnology,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth/validate-request";
import { unlink, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";

export const projectSchema = z.object({
  id: z.number().optional(), // Since `id` is auto-incremented, it can be optional
  title: z.string().max(255),
  slug: z.string().max(255),
  thumbnail: z.any().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().max(255),
  githubLink: z.string().optional(),
  websiteLink: z.string().optional(),
  status: z.enum(["visible", "invisible"]),
  isFeatured: z.boolean(),
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
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      thumbnail: formData.get("thumbnail") as File | null,
      startDate: formData.get("startDate") as string | null,
      endDate: formData.get("endDate") as string | null,
      summary: formData.get("summary") as string,
      githubLink: formData.get("githubLink") as string | null,
      websiteLink: formData.get("websiteLink") as string | null,
      status: formData.get("status") as "visible" | "invisible",
      isFeatured: formData.get("isFeatured") === "true",
      markdownContent: formData.get("markdownContent") as string,
      tagsId: JSON.parse(formData.get("tagsId") as string) as number[],
      technologiesId: JSON.parse(
        formData.get("technologiesId") as string,
      ) as number[],
    };

    // Validate the data using the Zod schema
    const validation = projectSchema.safeParse(data);
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

    const newProject = await db
      .insert(project)
      .values({
        slug: data.slug,
        title: data.title,
        thumbnail: fileName ? fileName : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        summary: data.summary,
        githubLink: data.githubLink || null,
        websiteLink: data.githubLink || null,
        status: data.status,
        isFeatured: data.isFeatured,
      })
      .returning({ id: project.id })

    const newProjectId = newProject[0].id; // Access the returned `id`

    // add tags
    if (Array.isArray(data.tagsId) && data.tagsId.length > 0) {
      await db.insert(projectTag).values(
        data.tagsId.map((tagId) => ({
          projectId: newProjectId,
          tagId,
        })),
      );
    }

    // add technologies
    if (Array.isArray(data.technologiesId) && data.technologiesId.length > 0) {
      await db.insert(projectTechnology).values(
        data.technologiesId.map((technologyId) => ({
          projectId: newProjectId,
          technologyId,
        })),
      );
    }

    // Save thumbnail
    if (data.thumbnail) {
      const bytes = await data.thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const thumbnailPath = `/uploads/projects-thumbnails/${fileName}`;
      const fullPath = path.join(process.cwd(), "public", thumbnailPath);
      await writeFile(fullPath, buffer);
    }

    // Save markdown content
    const markdownFileName = `${data.slug}.md`;
    const markdownPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "projects-markdowns",
      markdownFileName,
    );
    await writeFile(markdownPath, data.markdownContent);

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    return NextResponse.json(
      { success: true, project: newProject[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
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
    const projectId = url.searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Missing project ID" },
        { status: 400 },
      );
    }

    const data = {
      id: parseInt(projectId),
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      thumbnail: formData.get("thumbnail") as File | null,
      startDate: formData.get("startDate") as string | null,
      endDate: formData.get("endDate") as string | null,
      summary: formData.get("summary") as string,
      githubLink: formData.get("githubLink") as string | null,
      websiteLink: formData.get("websiteLink") as string | null,
      status: formData.get("status") as "visible" | "invisible",
      isFeatured: formData.get("isFeatured") === "true",
      markdownContent: formData.get("markdownContent") as string,
      tagsId: JSON.parse(formData.get("tagsId") as string) as number[],
      technologiesId: JSON.parse(
        formData.get("technologiesId") as string,
      ) as number[],
    };

    // Validate the data using the Zod schema
    const validation = projectSchema.safeParse(data);
    if (!validation.success || data.markdownContent === "") {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    const existingProject = await db.query.project.findFirst({
      where: eq(project.id, data.id),
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    let fileName = existingProject.thumbnail;
    if (data.thumbnail) {
      // Delete old thumbnail if it exists
      if (existingProject.thumbnail) {
        const oldThumbnailPath = path.join(
          process.cwd(),
          "public",
          "uploads/projects-thumbnails",
          existingProject.thumbnail,
        );
        await unlink(oldThumbnailPath);
      }

      // Save new thumbnail
      const bytes = await data.thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileName = `${Date.now()}-${data.thumbnail.name}`;
      const thumbnailPath = `/uploads/projects-thumbnails/${fileName}`;
      const fullPath = path.join(process.cwd(), "public", thumbnailPath);
      await writeFile(fullPath, buffer);
    }

    // Update project
    await db
      .update(project)
      .set({
        slug: data.slug,
        title: data.title,
        thumbnail: fileName,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        summary: data.summary,
        githubLink: data.githubLink || null,
        websiteLink: data.githubLink || null,
        status: data.status,
        isFeatured: data.isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(project.id, data.id));

    // Update tags
    await db.delete(projectTag).where(eq(projectTag.projectId, data.id));
    if (Array.isArray(data.tagsId) && data.tagsId.length > 0) {
      await db.insert(projectTag).values(
        data.tagsId.map((tagId) => ({
          projectId: data.id,
          tagId,
        })),
      );
    }

    // Update technologies
    await db
      .delete(projectTechnology)
      .where(eq(projectTechnology.projectId, data.id));
    if (Array.isArray(data.technologiesId) && data.technologiesId.length > 0) {
      await db.insert(projectTechnology).values(
        data.technologiesId.map((technologyId) => ({
          projectId: data.id,
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
      "projects-markdowns",
      markdownFileName,
    );
    await writeFile(markdownPath, data.markdownContent);

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    return NextResponse.json(
      { success: true, project: { id: data.id } },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
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

    const projectRow = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .limit(1);

    if (!projectRow.length) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    if (projectRow[0].thumbnail) {
      //delete thumbnail
      await unlink(
        path.join(
          process.cwd(),
          "public",
          "uploads/projects-thumbnails",
          projectRow[0].thumbnail,
        ),
      );
    }

    //delete markdown file
    await unlink(
      path.join(
        process.cwd(),
        "public",
        "uploads/projects-markdowns",
        projectRow[0].slug + ".md",
      ),
    );

    //get all project images
    const projectImages = await db
      .select()
      .from(projectImage)
      .where(eq(projectImage.projectId, id));

    if (projectImages.length > 0) {
      //delete all project images file
      await Promise.all(
        projectImages.map(async (image) => {
          await unlink(
            path.join(
              process.cwd(),
              "public",
              "uploads/projects-images",
              image.src,
            ),
          );
        }),
      );
    }

    await db.delete(project).where(eq(project.id, id));
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete the project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete the project" },
      { status: 500 },
    );
  }
}
