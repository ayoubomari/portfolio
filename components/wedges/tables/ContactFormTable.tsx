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
  faEye,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

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
  const [entry, setEntry] = useState<ContactFormEntry | null>(null);
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openDialog = (entry: ContactFormEntry) => {
    setEntry(entry);
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  const openDeleteDialog = (entry: ContactFormEntry) => {
    setEntry(entry);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  const mutation = useMutation({
    mutationFn: deleteMutation,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "The message has been deleted!",
        variant: "success",
      });

      setEntriesState(entriesState.filter((entry) => entry.id !== data.id));
      closeDeleteDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while deleting the message.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="relative">
      {/* show message dialog */}
      <div
        className={`${isOpen ? "fixed inset-1/2 z-10 flex h-full w-full translate-x-[-50%] translate-y-[-50%] items-center justify-center bg-black/50" : "hidden"}`}
      >
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Message from {entry?.name}</AlertDialogTitle>
              <AlertDialogDescription>{entry?.email}</AlertDialogDescription>
              <p>{entry?.createdAt?.toLocaleString()}</p>
            </AlertDialogHeader>
            <div>
              <p>
                <strong>Subject:</strong> {entry?.subject}
              </p>
              <p>{entry?.message}</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={closeDialog}>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* delete confirmation dialog */}
      <div
        className={`${deleteDialogOpen ? "fixed inset-1/2 z-10 flex h-full w-full translate-x-[-50%] translate-y-[-50%] items-center justify-center bg-black/50" : "hidden"}`}
      >
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                message from {entry?.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => mutation.mutate({ id: entry?.id! })}
              >
                Delete
              </AlertDialogAction>
              <AlertDialogCancel onClick={closeDeleteDialog}>
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

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
            {entriesState.map((entry) => {
              return (
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
                          <button
                            onClick={() => openDialog(entry)}
                            className="flex w-full items-center px-2 py-1.5 text-left text-sm"
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                              className="mr-2 h-4 w-4"
                            />
                            Show
                          </button>
                        </DropdownMenuItem>
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
                          onClick={() => openDeleteDialog(entry)}
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
