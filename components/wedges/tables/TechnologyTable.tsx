"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { technology } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

type Technology = typeof technology.$inferSelect;

interface TechnologyTableProps {
  technologies: Technology[];
}

type Credentials = {
  id: number;
};

const deleteMutation = async (
  credentials: Credentials,
): Promise<{ message: string; id: number }> => {
  const response = await fetch("/api/dashboard/technologies", {
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

export default function TechnologyTable({
  technologies,
}: TechnologyTableProps) {
  const [technologiesState, setTechnologiesState] =
    useState<Technology[]>(technologies);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: deleteMutation,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "the technology has been deleted!",
        variant: "success",
      });

      setTechnologiesState(
        technologiesState.filter((technology) => technology.id !== data.id),
      );
    },
    onError: (error: Error) => {
      console.error("delete failed:", error);
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while delteing the technology.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technologies.map((technology) => (
            <TableRow key={technology.id}>
              <TableCell>{technology.name}</TableCell>
              <TableCell>{technology.icon || "N/A"}</TableCell>
              <TableCell>
                {technology.link ? (
                  <Link
                    href={technology.link}
                    className="text-blue-500 hover:underline"
                  >
                    {technology.link}
                  </Link>
                ) : (
                  "N/A"
                )}
              </TableCell>
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
                      <Link
                        href={`/dashboard/blog-posts/edit/${technology.id}`}
                      >
                        <FontAwesomeIcon
                          icon={faPen}
                          className="mr-2 h-4 w-4"
                        />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => mutation.mutate({ id: technology.id })}
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
