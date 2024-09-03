import fs from "fs";
import path from "path";
import { projectImage, project } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/validate-request";

// GET Request to Fetch All Images by ProjectId
export async function GET(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { success: false, error: "Project ID is required" },
      { status: 400 },
    );
  }

  try {
    const images = await db
      .select()
      .from(projectImage)
      .where(eq(projectImage.projectId, Number(projectId)));

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: "No images found for this project" },
        { status: 404 },
      );
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error("Failed to fetch images for project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}

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
      projectId: formData.get("projectId"),
      images: formData.getAll("images") as File[],
    };

    const projectExists = await db
      .select()
      .from(project)
      .where(eq(project.id, Number(data.projectId)));

    if (!Array.isArray(projectExists) || projectExists.length === 0) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "projects-images",
    );

    if (data.images === null || data.images.length === 0) {
      return NextResponse.json(
        { success: false, error: "No images provided" },
        { status: 400 },
      );
    }

    const uploadedImages = await Promise.all(
      data.images.map(async (image) => {
        const imageName = `${Date.now()}-${image.name}`;
        const imagePath = path.join(uploadDir, imageName);
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.promises.writeFile(imagePath, buffer);

        const newImage = await db
          .insert(projectImage)
          .values({
            src: imageName,
            alt: image.name.split(".")[0] || image.name,
            projectId: Number(data.projectId),
          })
          .execute();

        return newImage[0].insertId;
      }),
    );

    return NextResponse.json(
      { success: true, uploadedImages },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create project images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project images" },
      { status: 500 },
    );
  }
}

// DELETE Request to Remove an Image by ImageId
export async function DELETE(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const imageId = url.searchParams.get("imageId");

  if (!imageId) {
    return NextResponse.json(
      { success: false, error: "Image ID is required" },
      { status: 400 },
    );
  }

  try {
    const images = await db
      .select()
      .from(projectImage)
      .where(eq(projectImage.id, Number(imageId)));

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 },
      );
    }

    const image = images[0];

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 },
      );
    }

    const imagePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "projects-images",
      image.src,
    );

    // Remove the image file from the filesystem
    await fs.promises.unlink(imagePath);

    // Remove the image record from the database
    await db
      .delete(projectImage)
      .where(eq(projectImage.id, Number(imageId)))
      .execute();

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete project image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
