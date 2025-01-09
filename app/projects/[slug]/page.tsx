import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogContent from "@/components/ui/BlogContent";
import ProjectCard2 from "@/components/wedges/ProjectCard2";
import { project, technology } from "@/db/schema";
import { ApiResponse } from "@/types/api";
import { db } from "@/db";
import { and, desc, eq, lte, not } from "drizzle-orm";
import { env } from "@/env";
import { JsonLd } from 'react-schemaorg'
import { NewsArticle } from 'schema-dts'
import { encodeIdWithSecret } from "@/lib/crypto/dataEncoding";
import TechnologiesList from "@/components/wedges/TechnologiesList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCalendarDays, faEarth } from '@fortawesome/free-solid-svg-icons';
library.add(faGithub, faCalendarDays, faEarth);

// export const revalidate = 10; // Revalidate every 10 seconds

type ProjectParams = {
  slug: string;
};

async function fetchProjectBySlugWithRelevantProjects(slug: string): Promise<
  ApiResponse<{
    mainProject: typeof project.$inferSelect & { tags: string[] } & {
      technologies: (typeof technology.$inferSelect)[];
    };
    relevantProjects: (typeof project.$inferSelect & { technologies: string[] })[];
  }>
> {
  try {
    // Fetch the main project with its tags
    const mainProjectWithTagsAndTechnologies = await db.query.project.findFirst({
      where: eq(project.slug, slug),
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
        technologies: {
          columns: {
          },
          with: {
            technology: {
              columns: {
                id: true,
                name: true,
                icon: true,
                link: true,
              },
            },
          },
        },
      },
    });

    if (!mainProjectWithTagsAndTechnologies) {
      return { ok: false, error: "Project not found" };
    }

    // Transform the tags to the desired format
    const mainProject = {
      ...mainProjectWithTagsAndTechnologies,
      tags: mainProjectWithTagsAndTechnologies.tags.map(t => t.tag.value),
      technologies: mainProjectWithTagsAndTechnologies.technologies.map((t) => ({
        ...t.technology,
        id: encodeIdWithSecret(t.technology.id, env.SECRET_KEY),
      })),
    };

    // Fetch relevant projects with their technologies
    const relevantProjectsWithTechnologies = await db.query.project.findMany({
      where: and(
        not(eq(project.slug, slug)),
        lte(project.createdAt, mainProject.createdAt),
        eq(project.status, "visible"),
      ),
      orderBy: [desc(project.endDate)],
      limit: 3,
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

    // Transform the technologies for relevant projects names
    const relevantProjects = relevantProjectsWithTechnologies.map(project => ({
      ...project,
      technologies: project.technologies.map(t => t.technology.name),
    }));

    return { ok: true, data: { mainProject, relevantProjects } };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { ok: false, error: String(error) };
  }
}

export async function generateMetadata({
  params,
}: {
  params: ProjectParams;
}): Promise<Metadata> {
  const projectsResponse = await fetchProjectBySlugWithRelevantProjects(
    params.slug,
  );
  if (!projectsResponse.ok) {
    return notFound();
  }
  const project = projectsResponse.data.mainProject;
  const tags = projectsResponse.data.mainProject.tags;

  const projectUrl = `${env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`;
  const imageUrl = project.thumbnail
    ? `${env.NEXT_PUBLIC_SITE_URL}/uploads/projects-thumbnails/${project.thumbnail}`
    : `${env.NEXT_PUBLIC_SITE_URL}/assets/images/contents/thumbnail1.webp`;

  return {
    title: project.title,
    description: project.summary,
    keywords: tags.map((tag) => tag),
    openGraph: {
      title: project.title,
      description: project.summary,
      url: projectUrl,
      siteName: "Ayoub Omari Portfolio",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: project.startDate || undefined,
      authors: ["Ayoub Omari"],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [imageUrl],
    },
    authors: [{ name: "Ayoub Omari" }],
    alternates: {
      canonical: projectUrl,
    },
    other: {
      "news_keywords": tags.map((tag) => tag).join(", "),
      "googlebot-news": "index,follow",
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  };
}

export default async function ProjectPage({ params }: { params: ProjectParams }) {
  const projectsResponse = await fetchProjectBySlugWithRelevantProjects(
    params.slug,
  );

  if (!projectsResponse.ok) {
    return notFound();
  }

  const project = projectsResponse.data.mainProject;
  const relevantProjects = projectsResponse.data.relevantProjects;

  const filePath = path.join(
    process.cwd(),
    "public/uploads/projects-markdowns",
    `${project.slug}.md`,
  );
  const fileContent = await fs.promises.readFile(filePath, "utf8");

  return (
    <>
      {/* JSON-LD */}
      <JsonLd<NewsArticle>
        item={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: project.title,
          image: [
            `${env.NEXT_PUBLIC_SITE_URL}/uploads/projects-thumbnails/${project.thumbnail}` ||
            `${env.NEXT_PUBLIC_SITE_URL}/assets/images/contents/thumbnail1.webp`
          ],
          datePublished: project.startDate || undefined,
          dateModified: project.startDate || undefined,
          author: [{
            "@type": "Person",
            name: "Ayoub Omari",
            url: `${env.NEXT_PUBLIC_SITE_URL}`
          }],
          publisher: {
            "@type": "Organization",
            name: "Ayoub Omari Portfolio",
            logo: {
              "@type": "ImageObject",
              url: `${env.NEXT_PUBLIC_SITE_URL}/assets/images/icons/logo.webp`,
            }
          },
          description: project.summary,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`
          }
        }}
      />

      <Header />
      <main className="">
        {/* Hero Section */}
        <section
          className="w-full min-h-[60vh] bg-project-hero-light  dark:bg-project-hero-dark text-white flex flex-col justify-center content-start"
        >
          <div className="container px-4 py-24">
            <div className="max-w-xl">
            <h1
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              {project.title}
            </h1>
            <p
              className="text-lg md:text-xl mb-6"
            >
              {project.summary}
            </p>
            <div
              className="flex flex-wrap gap-6 text-sm mb-8"
            >
              <div className="flex items-center">
                <FontAwesomeIcon className="mr-2 w-4 h-4" icon={faCalendarDays} />
                <span>{(project.startDate && project.startDate != "1970-01-01") ? new Date(project.startDate).toLocaleDateString() : " " } - {(project.endDate && project.endDate != "1970-01-01") ? new Date(project.endDate).toLocaleDateString() : 'Present'}</span>
              </div>
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <FontAwesomeIcon icon={faGithub} className="mr-2" size="lg" />
                  <span>GitHub</span>
                </a>
              )}
              {project.websiteLink && (
                <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <FontAwesomeIcon className="mr-2 w-4 h-4" icon={faEarth} />
                  <span>Website</span>
                </a>
              )}
            </div>
            <div
              className="text-xs"
            >
              Posted on: {new Date(project.createdAt).toLocaleDateString()}
              {project.updatedAt.toLocaleDateString() !== project.createdAt.toLocaleDateString() && ` | Edited on: ${new Date(project.updatedAt).toLocaleDateString()}`}
            </div>
          </div>
          </div>
        </section>

        <section className="container mx-auto flex flex-col items-center px-4 pb-16">
          {/* Project Content */}
          <div className="mt-16 w-full max-w-4xl text-lg leading-7 md:text-xl md:leading-8">
            <BlogContent content={fileContent} />
          </div>

          {/* Project technologies */}
          <div className="w-full max-w-4xl py-20">
            {project.technologies.length > 0 && (
              <p className="mb-5 text-xl font-bold">Technologies used</p>
            )}
            <TechnologiesList technologies={project.technologies} />
          </div>

          {/* Projects list Section */}
          <div className="w-full max-w-4xl py-20">
            {relevantProjects.length > 0 && (
              <p className="mb-5 text-xl font-bold">Read Also</p>
            )}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* relevant projects  Cards */}
              {relevantProjects.map((post, i) => (
                <ProjectCard2 key={i} {...post}  />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
