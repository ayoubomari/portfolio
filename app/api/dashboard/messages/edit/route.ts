import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { contactFormEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/validate-request";

type contactFormEntriesAPIResponse = typeof contactFormEntries.$inferSelect;

export async function GET(req: NextRequest): Promise<Response> {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const messageId = url.searchParams.get("messageId");

  if (!messageId) {
    return NextResponse.json(
      { success: false, error: "contactFormEntries ID is required" },
      { status: 400 },
    );
  }

  try {
    const contactFormEntriesResponse =
      await db.query.contactFormEntries.findFirst({
        where: eq(contactFormEntries.id, parseInt(messageId)),
      });

    if (!contactFormEntriesResponse) {
      return NextResponse.json(
        { success: false, error: "contactFormEntries not found" },
        { status: 404 },
      );
    }

    const formattedResponse: contactFormEntriesAPIResponse =
      contactFormEntriesResponse;

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Failed to fetch contactFormEntries:", error);
    return NextResponse.json(
      { error: "Failed to fetch contactFormEntries" },
      { status: 500 },
    );
  }
}
