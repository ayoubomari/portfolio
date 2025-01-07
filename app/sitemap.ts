import { env } from "@/env";
import { MetadataRoute } from "next";
import { blogPost, project } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  // Get dynamic routes
  const projectSlugs = await getAllProjectSlugs();
  const blogPostSlugs = await getAllBlogPostSlugs();

  // defined the date of deployment
  const deploymentDate = new Date("2025-01-02T00:00:00.000Z");

  // Static routes
  const routes = ["", "/projects", "/blog", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: deploymentDate.toISOString(),
  }));

  // Project routes
  const projectRoutes = projectSlugs.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.startDate || new Date().toISOString(),
  }));

  // Blog post routes
  const blogRoutes = blogPostSlugs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.date || new Date().toISOString(),
  }));

  return [...routes, ...projectRoutes, ...blogRoutes];
}
