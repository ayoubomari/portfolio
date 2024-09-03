import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { tag } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/validate-request";

type tagAPIResponse = typeof tag.$inferSelect;

export async function GET(req: NextRequest): Promise<Response> {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const tagId = url.searchParams.get("tagId");

  if (!tagId) {
    return NextResponse.json(
      { success: false, error: "tag ID is required" },
      { status: 400 },
    );
  }

  try {
    const tagResponse = await db.query.tag.findFirst({
      where: eq(tag.id, parseInt(tagId)),
    });

    if (!tagResponse) {
      return NextResponse.json(
        { success: false, error: "tag not found" },
        { status: 404 },
      );
    }

    const formattedResponse: tagAPIResponse = tagResponse;

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Failed to fetch tag:", error);
    return NextResponse.json({ error: "Failed to fetch tag" }, { status: 500 });
  }
}
