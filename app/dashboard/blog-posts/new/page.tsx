"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faMicrochip,
  faUpDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { tag, technology } from "@/db/schema";
import { DialogTitle } from "@/components/ui/dialog";

type Tag = typeof tag.$inferSelect;
type Technology = typeof technology.$inferSelect;

const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/tags`);
  return response.json();
};

const fetchTechnologies = async (): Promise<Technology[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL!}/technologies`,
  );
  return response.json();
};

export default function Page() {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [status, setStatus] = useState<"visible" | "invisible">("visible");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(
    new Date(Date.now()).toISOString().split("T")[0],
  );
  const [markdownContent, setMarkdownContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const [selectTagDialog, setSelectTagDialog] = useState(false);
  const [selectTechDialog, setSelectTechDialog] = useState(false);

  const createBlogPost = async (formData: FormData) => {
    const response = await fetch("/api/dashboard/blog-posts", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to create blog post");
    }
    return response.json();
  };

  const { data: tagOptions } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });
  const { data: techOptions } = useQuery({
    queryKey: ["te hnologies"],
    queryFn: fetchTechnologies,
  });

  const mutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
        variant: "success",
        action: (
          <ToastAction
            altText="Go to blog posts"
            onClick={() => router.push("/dashboard/blog-posts")}
          >
            View Blog Posts
          </ToastAction>
        ),
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog post",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    setSlug(slug.toLowerCase().replace(/\s/g, "-"));
    formData.append("slug", slug.toLowerCase().replace(/\s/g, "-"));

    formData.append("title", title);
    formData.append("summary", summary);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("status", status);
    formData.append("author", author);
    formData.append("date", date);
    formData.append("markdownContent", markdownContent);

    const tagsId = tagOptions
      ?.filter((tag) => tags.includes(tag.value))
      ?.map((tag) => tag.id);
    formData.append("tagsId", JSON.stringify(tagsId));

    const technologiesId = techOptions
      ?.filter((tech) => technologies.includes(tech.name))
      ?.map((tech) => tech.id);
    formData.append("technologiesId", JSON.stringify(technologiesId));

    mutation.mutate(formData);
  };

  const toggleSelection = (
    value: string,
    currentSelection: string[],
    setSelection: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelection((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  return (
    <>
      {/*select tags dialog*/}
      <CommandDialog open={selectTagDialog} onOpenChange={setSelectTagDialog}>
        <div className="hidden">
          <DialogTitle>Select a Tags</DialogTitle>
        </div>
        <CommandInput placeholder="Search for a tag..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {tagOptions?.map((tag) => (
              <CommandItem key={tag.value}>
                <div className="flex items-center">
                  <Checkbox
                    id={`tag-${tag.value}`}
                    checked={tags.includes(tag.value)}
                    onCheckedChange={() =>
                      toggleSelection(tag.value, tags, setTags)
                    }
                  />
                  <label
                    htmlFor={`tag-${tag.value}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag.value}
                  </label>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/*select technologies dialog*/}
      <CommandDialog open={selectTechDialog} onOpenChange={setSelectTechDialog}>
        <div className="hidden">
          <DialogTitle>Select a Technologies</DialogTitle>
        </div>
        <CommandInput placeholder="Search for a technology..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {techOptions?.map((technology) => (
              <CommandItem key={technology.name}>
                <div className="flex items-center">
                  <Checkbox
                    id={`technology-${technology.name}`}
                    checked={technologies.includes(technology.name)}
                    onCheckedChange={() =>
                      toggleSelection(
                        technology.name,
                        technologies,
                        setTechnologies,
                      )
                    }
                  />
                  <label
                    htmlFor={`technology-${technology.name}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {technology.name}
                  </label>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="container mx-auto min-h-screen py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/\s/g, "-"))
                  }
                  placeholder="Enter slug"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Input
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Enter summary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail (16:9 aspect ratio)</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value: "visible" | "invisible") =>
                    setStatus(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visible">Visible</SelectItem>
                    <SelectItem value="invisible">Invisible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="markdownContent">Markdown Content</Label>
                <Textarea
                  id="markdownContent"
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder="Enter markdown content"
                  rows={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">
                  <FontAwesomeIcon icon={faTag} className="mr-2" />
                  Tags
                </Label>
                <div>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectTagDialog(true);
                    }}
                  >
                    {tags.length > 0
                      ? `${tags.length} selected`
                      : "Select tags"}
                    <FontAwesomeIcon
                      icon={faUpDown}
                      className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tagOptions?.find((t) => t.value === tag)?.value}
                      <button
                        type="button"
                        className="ml-1 text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          setTags(tags.filter((t) => t !== tag));
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">
                  <FontAwesomeIcon icon={faMicrochip} className="mr-2" />
                  Technologies
                </Label>
                <div>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectTechDialog(true);
                    }}
                  >
                    {technologies.length > 0
                      ? `${technologies.length} selected`
                      : "Select technologies"}
                    <FontAwesomeIcon
                      icon={faUpDown}
                      className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <Badge
                      key={technology}
                      variant="secondary"
                      className="text-sm"
                    >
                      {techOptions?.find((t) => t.name === technology)?.name}
                      <button
                        type="button"
                        className="ml-1 text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          setTechnologies(
                            technologies.filter((t) => t !== technology),
                          );
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create Blog Post"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
