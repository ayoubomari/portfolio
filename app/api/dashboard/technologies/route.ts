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

    let fileName = "";
    if (icon) {
      const bytes = await icon.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileName = `${Date.now()}-${icon.name}`;
      const iconPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "technologies-icons",
        fileName,
      );
      await writeFile(iconPath, buffer);
    }

    const newTechnology = await db
      .insert(technology)
      .values({
        name,
        icon: fileName,
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
    const id = Number(url.searchParams.get("technologyId"));
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id in request search params" },
        { status: 400 },
      );
    }

    const data = {
      name: formData.get("name") as string,
      icon: formData.get("icon") as File | null,
      link: formData.get("link") as string,
    };

    if (!data.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing id or value in request body",
        },
        { status: 400 },
      );
    }

    const oldTechnology = await db.query.technology.findFirst({
      where: eq(technology.id, id),
    });

    if (!oldTechnology) {
      return NextResponse.json(
        { success: false, error: "Technology not found" },
        { status: 404 },
      );
    }

    let iconName = oldTechnology.icon;
    if (data.icon) {
      // delete old icon if it exists
      if (oldTechnology.icon) {
        // delete old icon
        await unlink(
          path.join(
            process.cwd(),
            "public",
            "uploads",
            "technologies-icons",
            oldTechnology.icon,
          ),
        );
      }

      const bytes = await data.icon.arrayBuffer();
      const buffer = Buffer.from(bytes);
      iconName = `${Date.now()}-${data.icon.name}`;
      const iconPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "technologies-icons",
        iconName,
      );
      await writeFile(iconPath, buffer);
      await db
        .update(technology)
        .set({ icon: iconPath })
        .where(eq(technology.id, id))
        .execute();
    }

    const updatedTechnology = await db
      .update(technology)
      .set({
        name: data.name,
        icon: iconName,
        link: data.link,
      })
      .where(eq(technology.id, id))
      .returning({ id: technology.id })

    const newUpdatedTechnologyId = updatedTechnology[0]?.id; // Access the returned `id`

    if (!newUpdatedTechnologyId) {
      return NextResponse.json(
        { success: false, error: "Technology not found" },
        { status: 400 },
      );
    }

    revalidatePath("/dashboard/technologies");
    return NextResponse.json(
      { success: true, technology: newUpdatedTechnologyId },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update the technology:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update the technology" },
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
