import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogContent from "@/components/ui/BlogContent";
import BlogPostCard from "@/components/wedges/BlogPostCard";
import { formatDateToSQL, fromFullStringDateTo_DD_month_YYYY } from "@/lib/converters/date";
import { blogPost } from "@/db/schema";
import { ApiResponse } from "@/types/api";
import { db } from "@/db";
import { and, desc, eq, lte, not } from "drizzle-orm";
import { env } from "@/env";
import { JsonLd } from 'react-schemaorg'
import { NewsArticle } from 'schema-dts'

// export const revalidate = 10; // Revalidate every 10 seconds

type BlogParams = {
  slug: string;
};

async function fetchBlogPostBySlugWithRelevantPosts(slug: string): Promise<
  ApiResponse<{
    mainPost: typeof blogPost.$inferSelect & { tags: string[] };
    relevantPosts: (typeof blogPost.$inferSelect)[];
  }>
> {
  try {
    // Fetch the main blog post with its tags
    const mainPostWithTags = await db.query.blogPost.findFirst({
      where: eq(blogPost.slug, slug),
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

    if (!mainPostWithTags) {
      return { ok: false, error: "Blog post not found" };
    }

    // Transform the tags to the desired format
    const mainPost = {
      ...mainPostWithTags,
      tags: mainPostWithTags.tags.map(t => t.tag.value),
    };

    // Fetch relevant posts
    const relevantPosts = await db.query.blogPost.findMany({
      where: and(
        not(eq(blogPost.slug, slug)),
        lte(blogPost.date, mainPost.date)
      ),
      orderBy: [desc(blogPost.date)],
      limit: 3,
    });

    return { ok: true, data: { mainPost, relevantPosts } };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return { ok: false, error: String(error) };
  }
}

export async function generateMetadata({
  params,
}: {
  params: BlogParams;
}): Promise<Metadata> {
  const blogPostsResponse = await fetchBlogPostBySlugWithRelevantPosts(
    params.slug,
  );
  if (!blogPostsResponse.ok) {
    return notFound();
  }
  const blogPost = blogPostsResponse.data.mainPost;
  const tags = blogPostsResponse.data.mainPost.tags;

  const postUrl = `${env.NEXT_PUBLIC_SITE_URL}/blog/${blogPost.slug}`;
  const imageUrl = blogPost.thumbnail
    ? `${env.NEXT_PUBLIC_SITE_URL}/uploads/blog-posts-thumbnails/${blogPost.thumbnail}`
    : `${env.NEXT_PUBLIC_SITE_URL}/assets/images/contents/thumbnail1.webp`;

  return {
    title: blogPost.title,
    description: blogPost.summary,
    keywords: tags.map((tag) => tag),
    openGraph: {
      title: blogPost.title,
      description: blogPost.summary,
      url: postUrl,
      siteName: "Ayoub Omari Portfolio",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blogPost.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: blogPost.date.toISOString(),
      authors: [blogPost.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blogPost.title,
      description: blogPost.summary,
      images: [imageUrl],
    },
    authors: [{ name: blogPost.author }],
    alternates: {
      canonical: postUrl,
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

export default async function BlogPostPage({ params }: { params: BlogParams }) {
  const blogPostsResponse = await fetchBlogPostBySlugWithRelevantPosts(
    params.slug,
  );

  if (!blogPostsResponse.ok) {
    return notFound();
  }

  const blogPost = blogPostsResponse.data.mainPost;
  const relevantPosts = blogPostsResponse.data.relevantPosts;

  const filePath = path.join(
    process.cwd(),
    "public/uploads/blog-posts-markdowns",
    `${blogPost.slug}.md`,
  );
  const fileContent = await fs.promises.readFile(filePath, "utf8");

  return (
    <>
      {/* JSON-LD */}
      <JsonLd<NewsArticle>
        item={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: blogPost.title,
          image: [
            `${env.NEXT_PUBLIC_SITE_URL}/uploads/blog-posts-thumbnails/${blogPost.thumbnail}` ||
            `${env.NEXT_PUBLIC_SITE_URL}/assets/images/contents/thumbnail1.webp`
          ],
          datePublished: blogPost.date.toISOString(),
          dateModified: blogPost.date.toISOString(),
          author: [{
            "@type": "Person",
            name: blogPost.author,
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
          description: blogPost.summary,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${env.NEXT_PUBLIC_SITE_URL}/blog/${blogPost.slug}`
          }
        }}
      />

      <Header />
      <main className="">
        <section className="container mx-auto flex flex-col items-center px-4 py-16">
          {/* Blog post title */}
          <div className="relative w-full max-w-4xl grow overflow-hidden rounded-lg bg-primary p-8 shadow">
            <Image
              width={376}
              height={400}
              src="/assets/images/contents/wood-pattern1.png"
              alt="blog image"
              className="absolute right-0 top-0 hidden w-auto opacity-30 sm:block"
            />
            <Image
              width={376}
              height={400}
              src="/assets/images/contents/wood-pattern1.png"
              alt="blog image"
              className="absolute bottom-0 left-9 w-auto opacity-30 sm:bottom-0 sm:left-0"
            />
            <div className="text-white">
              <div className="flex flex-row items-baseline justify-between gap-2">
                <span className="hidden font-medium sm:block">
                  {blogPost.author}
                </span>
                <span className="text-lg font-bold">The Dig</span>
                <span className="hidden font-medium sm:block">
                  {fromFullStringDateTo_DD_month_YYYY(blogPost.date.toString())}
                </span>
              </div>
              <h1 className="py-6 text-2xl font-bold sm:py-8 sm:text-center md:py-12 md:text-3xl lg:text-4xl">
                {blogPost.title}
              </h1>
              <div className="flex justify-center">
                <Image
                  src="/assets/images/icons/white-logo.webp"
                  alt="logo"
                  width={25}
                  height={25}
                  className="hidden sm:block"
                />
              </div>
              <div>
                <span className="block font-medium sm:hidden">
                  {blogPost.author}
                </span>
                <span className="block font-medium sm:hidden">
                  {fromFullStringDateTo_DD_month_YYYY(blogPost.date.toString())}
                </span>
              </div>
            </div>
          </div>

          {/* Blog post Content */}
          <div className="mt-16 w-full max-w-4xl text-lg leading-7 md:text-xl md:leading-8">
            <BlogContent content={fileContent} />
          </div>

          {/* Blog list Section */}
          <div className="w-full max-w-4xl py-20">
            {relevantPosts.length > 0 && (
              <p className="mb-5 text-xl font-bold">Read Also</p>
            )}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* relevant blog posts  Cards */}
              {relevantPosts.map((post, i) => (
                <BlogPostCard key={i} {...post} date={formatDateToSQL(post.date)} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
