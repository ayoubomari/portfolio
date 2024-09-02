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
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const createTechnology = async (formData: FormData) => {
    const response = await fetch("/api/dashboard/technologies", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create technology");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: createTechnology,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Technology created successfully",
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
        description: "Failed to create technology",
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
              <Label htmlFor="icon">Icon</Label>
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
