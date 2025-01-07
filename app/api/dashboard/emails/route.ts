import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsLetterFormEntries } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
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
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const emails = await db
      .select({ email: sql`email` })
      .from(newsLetterFormEntries)
      .where(eq(newsLetterFormEntries.email, email));

    if (emails.length > 0) {
      return Response.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    await db
      .insert(newsLetterFormEntries)
      .values({
        email,
      })
      .execute();

    return Response.json(
      { message: "Your email has been added successfully" },
      { status: 200 },
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
    const { id, email } = await req.json();
    if (!id || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing id or value in request body",
        },
        { status: 400 },
      );
    }

    const updatedEmail = await db
      .update(newsLetterFormEntries)
      .set({
        email,
        updatedAt: new Date(),
      })
      .where(eq(newsLetterFormEntries.id, id))
      .returning({ id: newsLetterFormEntries.id })

    const newupdatedEmailId = updatedEmail[0]?.id; // Access the returned `id`

    if (!newupdatedEmailId) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 400 },
      );
    }

    revalidatePath("/dashboard/messages");
    return NextResponse.json(
      { success: true, newsLetterFormEntries: newupdatedEmailId },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update the newsLetterFormEntries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update the newsLetterFormEntries" },
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

    await db
      .delete(newsLetterFormEntries)
      .where(eq(newsLetterFormEntries.id, id));
    revalidatePath("/dashboard/emails");

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete the news letter form entries:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete the news letter form entries",
      },
      { status: 500 },
    );
  }
}
