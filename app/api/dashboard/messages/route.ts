import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactFormEntries } from "@/db/schema";
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
    const { name, email, phoneNumber, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newEntry = await db
      .insert(contactFormEntries)
      .values({
        name,
        email,
        phoneNumber,
        subject,
        message,
      })
      .execute();

    revalidatePath("/dashboard/messages");
    return NextResponse.json(
      { success: true, entry: newEntry[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create contact form entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create contact form entry" },
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
    const { id, name, email, phoneNumber, subject, message } = await req.json();
    if (!id || !name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing id or value in request body",
        },
        { status: 400 },
      );
    }

    const updatedMessage = await db
      .update(contactFormEntries)
      .set({
        name,
        email,
        phoneNumber,
        subject,
        message,
      })
      .where(eq(contactFormEntries.id, id))
      .execute();

    if (!updatedMessage[0].affectedRows) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 400 },
      );
    }

    revalidatePath("/dashboard/messages");
    return NextResponse.json(
      { success: true, contactFormEntries: updatedMessage[0].insertId },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update the contactFormEntries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update the contactFormEntries" },
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

    await db.delete(contactFormEntries).where(eq(contactFormEntries.id, id));
    revalidatePath("/dashboard/messages");
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete contact form entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact form entry" },
      { status: 500 },
    );
  }
}
