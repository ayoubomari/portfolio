"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const [tagValue, setTagValue] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const createTag = async (value: string) => {
    const response = await fetch("/api/dashboard/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });

    if (!response.ok) {
      throw new Error("Failed to create tag");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tag created successfully",
        variant: "success",
        action: (
          <ToastAction
            altText="Go to tags"
            onClick={() => router.push("/dashboard/tags")}
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
        description: "Failed to create tag",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(tagValue);
  };

  return (
    <div className="container mx-auto min-h-screen py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tagValue">Tag Value</Label>
              <Input
                id="tagValue"
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
                placeholder="Enter tag value"
                required
              />
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Tag"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
