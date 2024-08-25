import NewsLetterInLine from "@/components/forms/NewsLetterInLine";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { Metadata } from "next";
import BlogPostList from "@/components/wedges/BlogPostsList";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Blog - Ayoub Omari Portfolio",
  description: "Discover Ayoub Omari's insightful blog posts on web development, technology trends, and software engineering best practices.",
  keywords: ["web development", "software engineering", "tech blog", "Ayoub Omari", "programming tips"],
  authors: [{ name: "Ayoub Omari" }],
  openGraph: {
    title: "Blog - Ayoub Omari Portfolio",
    description: "Discover Ayoub Omari's insightful blog posts on web development, technology trends, and software engineering best practices.",
    url: `${env.NEXT_PUBLIC_SITE_URL}/blog`,
    siteName: "Ayoub Omari Portfolio",
    images: [
      {
        url: `${env.NEXT_PUBLIC_SITE_URL}/images/icons/icon.webp`,
        width: 1200,
        height: 630,
        alt: "Ayoub Omari's Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Ayoub Omari Portfolio",
    description: "Discover Ayoub Omari's insightful blog posts on web development, technology trends, and software engineering best practices.",
    images: [`${env.NEXT_PUBLIC_SITE_URL}/images/icons/icon.webp`],
    creator: "@AyoubOmari01",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/blog`,
  },
};

export default function Blog() {
  return (
    <>
      <Header mainPageIndex={2} />
      <main className="bg-light-gradient bg-fixed dark:bg-dark-gradient">
        {/* Hero Section */}
        <section className="flex flex-col items-center px-4 py-16">
          <h1 className="mb:mb-6 mb-4 text-center text-3xl font-bold md:text-4xl">
            Full Stack Frontiers: Web, Mobile, and Web3 Insights
          </h1>
          <p className="mb-6 text-center text-lg md:mb-8 md:text-xl">
            Subscribe for cutting-edge dev tips, project showcases, and
            blockchain innovations
          </p>
          <NewsLetterInLine />
        </section>
        {/* Blog list Section */}
        <BlogPostList />
      </main>
      <Footer />
    </>
  );
}
