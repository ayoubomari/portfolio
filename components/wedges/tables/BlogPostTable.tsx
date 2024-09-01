"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { blogPost } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  faEllipsisVertical,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

type BlogPost = typeof blogPost.$inferSelect;

interface BlogPostTableProps {
  blogPosts: BlogPost[];
}

type Credentials = {
  id: number;
};

const deleteMutation = async (
  credentials: Credentials,
): Promise<{ message: string; id: number }> => {
  const response = await fetch("/api/dashboard/blog-posts", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  console.log(response);
  console.log(response.status);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      JSON.stringify({
        message: errorData.error,
        status: response.status,
      }),
    );
  }

  return response.json();
};

export default function BlogPostTable({ blogPosts }: BlogPostTableProps) {
  const [blogPostsState, setBlogPostsState] = useState<BlogPost[]>(blogPosts);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: deleteMutation,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "the blog post has been deleted!",
        variant: "success",
      });

      setBlogPostsState(
        blogPostsState.filter((blogPost) => blogPost.id !== data.id),
      );
    },
    onError: (error: Error) => {
      console.error("delete failed:", error);
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while delteing the blog post.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>
                <Badge
                  variant={post.status === "visible" ? "default" : "secondary"}
                >
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell>{post.date.toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        className="h-4 w-4"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/blog-posts/edit/${post.id}`}>
                        <FontAwesomeIcon
                          icon={faPen}
                          className="mr-2 h-4 w-4"
                        />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => mutation.mutate({ id: post.id })}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="mr-2 h-4 w-4"
                      />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
