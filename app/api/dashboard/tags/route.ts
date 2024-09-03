import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tag } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth/validate-request";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { value } = await req.json();
    if (!value || typeof value !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing tag value in request body",
        },
        { status: 400 },
      );
    }

    const newTag = await db.insert(tag).values({ value }).execute();
    revalidatePath("/dashboard/tags");
    return NextResponse.json(
      { success: true, tag: newTag[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create the tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create the tag" },
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
    const { id, value } = await req.json();
    if (!id || !value) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing id or value in request body",
        },
        { status: 400 },
      );
    }

    const updatedTag = await db
      .update(tag)
      .set({ value })
      .where(eq(tag.id, id))
      .execute();

    if (!updatedTag[0].affectedRows) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 400 },
      );
    }

    revalidatePath("/dashboard/tags");
    return NextResponse.json(
      { success: true, tag: updatedTag[0].insertId },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update the tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update the tag" },
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

    await db.delete(tag).where(eq(tag.id, id));
    revalidatePath("/dashboard/tags");
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete the tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete the tag" },
      { status: 500 },
    );
  }
}
