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
  technologyId: string;
};

export default function Page({ params }: { params: PageParams }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const fetchTechnology = async () => {
    const response = await fetch(
      `/api/dashboard/technologies/edit?technologyId=${params.technologyId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch technologies");
    }
    return response.json();
  };

  const { data: technologies, isLoading } = useQuery({
    queryKey: ["technologies", params.technologyId],
    queryFn: fetchTechnology,
  });

  useEffect(() => {
    if (technologies) {
      setName(technologies.name);
      setLink(technologies.link);
    }
  }, [technologies]);

  const updateTechnology = async (formData: FormData) => {
    const response = await fetch(
      `/api/dashboard/technologies?technologyId=${params.technologyId}`,
      {
        method: "PUT",
        body: formData,
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update technology");
    }
    return response.json();
  };

  const mutation = useMutation({
    mutationFn: updateTechnology,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Technology updated successfully",
        variant: "success",
        action: (
          <ToastAction
            altText="Go to technologies"
            onClick={() => router.push("/dashboard/technologies")}
          >
            View Technologies
          </ToastAction>
        ),
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update technology",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    if (icon) formData.append("icon", icon);
    formData.append("link", link);

    mutation.mutate(formData);
  };

  return (
    <div className="container mx-auto min-h-screen py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Technology</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter technology name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (1:1 aspect ratio)</Label>
              <Input
                id="icon"
                type="file"
                onChange={(e) => setIcon(e.target.files?.[0] || null)}
                accept="image/*"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter technology link"
              />
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Technology"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
