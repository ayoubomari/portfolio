import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { technology } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth/validate-request";
import { writeFile, unlink } from "fs/promises";
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
    const name = formData.get("name") as string;
    const icon = formData.get("icon") as File | null;
    const link = formData.get("link") as string;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 },
      );
    }

    let iconPath = null;
    if (icon) {
      const bytes = await icon.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${icon.name}`;
      iconPath = `${fileName}`;
      await writeFile(iconPath, buffer);
    }

    const newTechnology = await db
      .insert(technology)
      .values({
        name,
        icon: iconPath,
        link: link || null,
      })
      .execute();

    revalidatePath("/dashboard/technologies");
    return NextResponse.json(
      { success: true, technology: newTechnology[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create the technology:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create the technology" },
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

    const technologyRow = await db
      .select()
      .from(technology)
      .where(eq(technology.id, id))
      .limit(1);

    if (!technologyRow.length) {
      return NextResponse.json(
        { success: false, error: "Technology not found" },
        { status: 404 },
      );
    }

    if (technologyRow[0].icon) {
      //delete icon
      await unlink(
        path.join(
          process.cwd(),
          "public",
          "uploads/technologies-icons",
          technologyRow[0].icon,
        ),
      );
    }

    await db.delete(technology).where(eq(technology.id, id));

    revalidatePath("/dashboard/technologies");
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete the technology:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete the technology" },
      { status: 500 },
    );
  }
}
