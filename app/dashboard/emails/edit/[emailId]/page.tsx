"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

type PageParams = {
  emailId: string;
};

export default function Page({ params }: { params: PageParams }) {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const fetchTag = async () => {
    const response = await fetch(
      `/api/dashboard/emails/edit?emailId=${params.emailId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch email");
    }
    return response.json();
  };

  const { data: oldEmail } = useQuery({
    queryKey: ["email", params.emailId],
    queryFn: fetchTag,
  });

  useEffect(() => {
    if (oldEmail) {
      setEmail(oldEmail.email);
    }
  }, [oldEmail]);

  const updateTag = async (formData: FormData) => {
    const response = await fetch(
      `/api/dashboard/emails?emailId=${params.emailId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.emailId,
          ...Object.fromEntries(formData),
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update email");
    }
    return response.json();
  };

  const mutation = useMutation({
    mutationFn: updateTag,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tag updated successfully",
        variant: "success",
        action: (
          <ToastAction
            altText="Go to emails"
            onClick={() => router.push("/dashboard/emails")}
          >
            View Tags
          </ToastAction>
        ),
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update email",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);

    mutation.mutate(formData);
  };

  return (
    <div className="container mx-auto min-h-screen py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Contact Form Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Contact Form Entry"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
