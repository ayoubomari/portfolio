import { env } from "@/env";
import { blogPost, project } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Fetch all project slugs and startDate from the database
async function getAllProjectSlugs(): Promise<
  { slug: string; startDate: Date | null }[]
> {
  const projects = await db
    .select({
      slug: project.slug,
      startDate: project.startDate,
    })
    .from(project)
    .where(eq(project.status, "visible"));
  return projects;
}

// Fetch all blog post slugs and dates from the database
async function getAllBlogPostSlugs(): Promise<
  { slug: string; date: Date | null }[]
> {
  const blogPosts = await db
    .select({
      slug: blogPost.slug,
      date: blogPost.date,
    })
    .from(blogPost)
    .where(eq(blogPost.status, "visible"));
  return blogPosts;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  // Get dynamic routes
  const projectSlugs = await getAllProjectSlugs();
  const blogPostSlugs = await getAllBlogPostSlugs();

  // Static routes
  const routes = ["", "/projects", "/blog", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Project routes
  const projectRoutes = projectSlugs.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.startDate?.toISOString() || new Date().toISOString(),
  }));

  // Blog post routes
  const blogRoutes = blogPostSlugs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.date?.toISOString() || new Date().toISOString(),
  }));

  const allRoutes = [...routes, ...projectRoutes, ...blogRoutes];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(
      (route) => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
  </url>`,
    )
    .join("")}
</urlset>`;

  // Return the XML response
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
