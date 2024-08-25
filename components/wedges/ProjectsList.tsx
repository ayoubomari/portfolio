"use client";
import { domAnimation, LazyMotion, m } from "framer-motion";
import ProjectCard2 from "@/components/wedges/ProjectCard2";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { project } from "@/db/schema";

type ProjectsAPIResponse = typeof project.$inferSelect & {
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  
  tags: string[];
};


const fetchProjects = async (): Promise<ProjectsAPIResponse[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/projects`);
  return response.json();
};

export default function ProjectsList() {
  const { toast } = useToast();

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<ProjectsAPIResponse[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch projects",
      variant: "destructive",
    });
  }


  return (
    <LazyMotion features={domAnimation}>
        <section className="container mx-auto px-4 pb-20">
          <p className="mb-5 text-xl font-bold">Projects</p>
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
            : // Render projects when data is available
              Array.isArray(projects) &&
              projects.map((project, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ProjectCard2 {...project} />
                </m.div>
              ))
          }
          </div>
        </section>
    </LazyMotion>
    );
}