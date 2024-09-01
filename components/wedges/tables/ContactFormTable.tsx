"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { contactFormEntries } from "@/db/schema";
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
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { useState } from "react";
type ContactFormEntry = typeof contactFormEntries.$inferSelect;

interface ContactFormTableProps {
  entries: ContactFormEntry[];
}

type Credentials = {
  id: number;
};

const deleteMutation = async (
  credentials: Credentials,
): Promise<{ message: string; id: number }> => {
  const response = await fetch("/api/dashboard/messages", {
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

export default function ContactFormTable({ entries }: ContactFormTableProps) {
  const [entriesState, setEntriesState] = useState<ContactFormEntry[]>(entries);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: deleteMutation,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "the message has been deleted!",
        variant: "success",
      });

      setEntriesState(entriesState.filter((entry) => entry.id !== data.id));
    },
    onError: (error: Error) => {
      console.error("delete failed:", error);
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while delteing the message.",
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
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entriesState.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.email}</TableCell>
              <TableCell>{entry.subject}</TableCell>
              <TableCell>{entry.createdAt.toLocaleString()}</TableCell>
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
                      <Link href={`/dashboard/messages/edit/${entry.id}`}>
                        <FontAwesomeIcon
                          icon={faPen}
                          className="mr-2 h-4 w-4"
                        />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => mutation.mutate({ id: entry.id })}
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
