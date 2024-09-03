import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { project } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { env } from "@/env";
import { encodeIdWithSecret } from "@/lib/crypto/dataEncoding";

export const dynamic = "force-dynamic";

type ProjectsAPIResponse = typeof project.$inferSelect & {
  technologies: string[];
};

export async function GET(): Promise<Response> {
  try {
    const projects = await db.query.project.findMany({
      where: eq(project.status, "visible"),
      orderBy: [desc(project.endDate)],
      with: {
        technologies: {
          columns: {
            id: false,
          },
          with: {
            technology: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    });

    const projectResponse: ProjectsAPIResponse[] = projects.map((project) => ({
      ...project,
      id: encodeIdWithSecret(project.id, env.SECRET_KEY),
      technologies: project.technologies.map(
        (technology) => technology.technology.name,
      ),
    }));

    return NextResponse.json(projectResponse);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
