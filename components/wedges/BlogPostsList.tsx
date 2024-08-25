"use client";
import { domAnimation, LazyMotion, m } from "framer-motion";
import BlogPostCard from "@/components/wedges/BlogPostCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { blogPost } from "@/db/schema";

type BlogPostsAPIResponse = typeof blogPost.$inferSelect & {
  date: string;
  createdAt: string;
  updatedAt: string;
};

const fetchBlogPosts = async (): Promise<BlogPostsAPIResponse[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/blog`);
  return response.json();
};

export default function BlogPostList() {
  const { toast } = useToast();

  const {
    data: blogPosts,
    isLoading,
    error,
  } = useQuery<BlogPostsAPIResponse[]>({
    queryKey: ["blogPosts"],
    queryFn: fetchBlogPosts,
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch blog posts",
      variant: "destructive",
    });
  }

  return (
    <LazyMotion features={domAnimation}>
      <section className="container mx-auto px-4 pb-20">
        <p className="mb-5 text-xl font-bold">Recent blog posts</p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full bg-gray-300 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700" />
                </div>
              ))
            : // Render blog posts when data is available
              Array.isArray(blogPosts) &&
              blogPosts.map((post, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <BlogPostCard {...post} />
                </m.div>
              ))
          }
        </div>
      </section>
    </LazyMotion>
  );
}
