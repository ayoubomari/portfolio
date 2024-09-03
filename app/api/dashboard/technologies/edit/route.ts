import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { technology } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/validate-request";

type technologyAPIResponse = typeof technology.$inferSelect;

export async function GET(req: NextRequest): Promise<Response> {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const technologyId = url.searchParams.get("technologyId");

  if (!technologyId) {
    return NextResponse.json(
      { success: false, error: "technology ID is required" },
      { status: 400 },
    );
  }

  try {
    const technologyResponse = await db.query.technology.findFirst({
      where: eq(technology.id, parseInt(technologyId)),
    });

    if (!technologyResponse) {
      return NextResponse.json(
        { success: false, error: "technology not found" },
        { status: 404 },
      );
    }

    const formattedResponse: technologyAPIResponse = technologyResponse;

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Failed to fetch technology:", error);
    return NextResponse.json(
      { error: "Failed to fetch technology" },
      { status: 500 },
    );
  }
}
