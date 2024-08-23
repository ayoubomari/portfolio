import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import BlogContent from "@/components/ui/BlogContent";
import BlogPostCard from "@/components/wedges/BlogPostCard";
import { fromFullStringDateTo_month_DD_YYYY } from "@/lib/converters/date";
import { blogPost } from "@/db/schema";
import { ApiResponse } from "@/types/api";
import { db } from "@/db";
import { and, eq, lte, not } from "drizzle-orm";

export const revalidate = 10; // Revalidate every 10 seconds

type BlogParams = {
  slug: string;
};

async function fetchBlogPostBySlugWithRelevantPosts(slug: string): Promise<
  ApiResponse<{
    mainPost: typeof blogPost.$inferSelect;
    relevantPosts: (typeof blogPost.$inferSelect)[];
  }>
> {
  try {
    // Fetch the main blog post based on the slug
    const posts = await db
      .select()
      .from(blogPost)
      .where(eq(blogPost.slug, slug));

    if (!Array.isArray(posts) || posts.length === 0) {
      return { ok: false, error: "Blog post not found" };
    }

    const mainPost = posts[0];

    // Fetch relevant posts (only the ones before after the main post)
    const relevantPosts = await db
      .select()
      .from(blogPost)
      .where(
        and(
          not(eq(blogPost.slug, slug)),
          lte(blogPost.createdAt, mainPost.createdAt),
        ),
      );

    return { ok: true, data: { mainPost, relevantPosts } };
  } catch (error) {
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

  return {
    title: blogPost.title,
    description: blogPost.summary,
    openGraph: {
      title: blogPost.title,
      description: blogPost.summary,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blogPost.slug}`,
      siteName: "Ayoub Omari Portfolio",
      images: [
        {
          url:
            `${process.env.NEXT_PUBLIC_SITE_URL}/uploads/blog-posts-thumbnails/${blogPost.thumbnail}` ||
            `${process.env.NEXT_PUBLIC_SITE_URL}/assets/images/contents/thumbnail1.webp`,
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
      images: [
        blogPost.thumbnail || "https://yourdomain.com/default-og-image.jpg",
      ],
    },
    authors: [{ name: blogPost.author }],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blogPost.slug}`,
    title: blogPost.title,
    thumbnail: blogPost.thumbnail ? `${process.env.NEXT_PUBLIC_SITE_URL}/uploads/blog-posts-thumbnails/${blogPost.thumbnail}` : `${process.env.NEXT_PUBLIC_SITE_URL}/assets/images/contents/thumbnail1.webp`,
    datePublished: blogPost.createdAt.toISOString(),
    authorName: blogPost.author,
    description: blogPost.summary,
    image: blogPost.thumbnail ? `${process.env.NEXT_PUBLIC_SITE_URL}/uploads/blog-posts-thumbnails/${blogPost.thumbnail}` : `${process.env.NEXT_PUBLIC_SITE_URL}/assets/images/contents/thumbnail1.webp`,
  };

  const filePath = path.join(
    process.cwd(),
    "public/uploads/posts",
    `${blogPost.slug}.md`,
  );
  const fileContent = await fs.promises.readFile(filePath, "utf8");

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
      />

      <Header />
      <main className="">
        <section className="container mx-auto flex flex-col items-center px-4 py-16">
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
                  {fromFullStringDateTo_month_DD_YYYY(blogPost.date.toString())}
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
                  {fromFullStringDateTo_month_DD_YYYY(blogPost.date.toString())}
                </span>
              </div>
            </div>
          </div>

          {/* Blog Content */}
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
              {relevantPosts.map((_, i) => (
                <BlogPostCard
                  key={i}
                  title="Full Stack Frontiers: Web, Mobile, and Web3 Insights"
                  summary="Subscribe for cutting-edge dev tips, project showcases, and blockchain innovations"
                  date="2022-12-22"
                  slug="full-stack-frontiers"
                  thumbnail="/assets/images/contents/thumbnail1.webp"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
