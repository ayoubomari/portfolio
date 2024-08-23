import NewsLetterInLine from "@/components/forms/NewsLetterInLine";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { Metadata } from "next";
import BlogPostList from "@/components/wedges/BlogPostList";

export const metadata: Metadata = {
  title: "Blog - Ayoub Omari Portfolio",
  description: "Descover Ayoub Omari's blog posts",
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
