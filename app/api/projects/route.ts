import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { project } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { env } from "@/env";
import { encodeIdWithSecret } from "@/lib/crypto/dataEncoding";

type ProjectsAPIResponse = typeof project.$inferSelect & {
  tags: string[];
};

export async function GET() {
  try {
    const projects = await db.query.project.findMany({
      where: eq(project.status, "visible"),
      orderBy: [desc(project.endDate)],
      with: {
        tags: {
          columns: {
            id: false,
          },
          with: {
            tag: {
              columns: {
                value: true,
              },
            },
          },
        },
      },
    });

    const projectResponse: ProjectsAPIResponse[] = projects.map((project) => ({
      ...project,
      id: encodeIdWithSecret(project.id, env.SECRET_KEY),
      tags: project.tags.map((tag) => tag.tag.value),
    }));

    return NextResponse.json(projectResponse);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}