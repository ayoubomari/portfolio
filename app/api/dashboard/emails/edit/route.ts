import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { newsLetterFormEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/validate-request";

type newsLetterFormEntriesAPIResponse =
  typeof newsLetterFormEntries.$inferSelect;

export async function GET(req: NextRequest): Promise<Response> {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const emailId = url.searchParams.get("emailId");

  if (!emailId) {
    return NextResponse.json(
      { success: false, error: "newsLetterFormEntries ID is required" },
      { status: 400 },
    );
  }

  try {
    const newsLetterFormEntriesResponse =
      await db.query.newsLetterFormEntries.findFirst({
        where: eq(newsLetterFormEntries.id, parseInt(emailId)),
      });

    if (!newsLetterFormEntriesResponse) {
      return NextResponse.json(
        { success: false, error: "newsLetterFormEntries not found" },
        { status: 404 },
      );
    }

    const formattedResponse: newsLetterFormEntriesAPIResponse =
      newsLetterFormEntriesResponse;

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Failed to fetch newsLetterFormEntries:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsLetterFormEntries" },
      { status: 500 },
    );
  }
}
