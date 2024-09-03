"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

type PageParams = {
  tagId: string;
};

export default function EditTagPage({ params }: { params: PageParams }) {
  const [tagValue, setTagValue] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const fetchTag = async () => {
    const response = await fetch(
      `/api/dashboard/tags/edit?tagId=${params.tagId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tag");
    }
    return response.json();
  };

  const { data: tag, isLoading } = useQuery({
    queryKey: ["tag", params.tagId],
    queryFn: fetchTag,
  });

  useEffect(() => {
    if (tag) {
      setTagValue(tag.value);
    }
  }, [tag]);

  const updateTag = async (value: string) => {
    const response = await fetch(`/api/dashboard/tags?tagId=${params.tagId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: params.tagId, value }),
    });
    if (!response.ok) {
      throw new Error("Failed to update tag");
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
        description: "Failed to update tag",
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
          <CardTitle>Edit Tag</CardTitle>
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
              {mutation.isPending ? "Updating..." : "Update Tag"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
