import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { project, tag, technology } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/validate-request";
import fs from "fs";
import path from "path";

type ProjectAPIResponse = typeof project.$inferSelect & {
  tags: (typeof tag.$inferSelect)[];
  technologies: (typeof technology.$inferSelect)[];
  markdownContent: string;
};

export async function GET(req: NextRequest): Promise<Response> {
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
    const projectResponse = await db.query.project.findFirst({
      where: eq(project.id, parseInt(projectId)),
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
        technologies: {
          with: {
            technology: true,
          },
        },
      },
    });

    if (!projectResponse) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    // add mardown
    const markdownContent = await fs.promises.readFile(
      path.join(
        process.cwd(),
        "public",
        "uploads",
        "projects-markdowns",
        projectResponse.slug + ".md",
      ),
      "utf-8",
    );

    const formattedResponse: ProjectAPIResponse = {
      ...projectResponse,
      tags: projectResponse.tags.map((bt) => bt.tag),
      technologies: projectResponse.technologies.map((bt) => bt.technology),
      markdownContent,
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}
