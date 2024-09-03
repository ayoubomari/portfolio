"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

type PageParams = {
  messageId: string;
};

export default function Page({ params }: { params: PageParams }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const fetchTag = async () => {
    const response = await fetch(
      `/api/dashboard/messages/edit?messageId=${params.messageId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch message");
    }
    return response.json();
  };

  const { data: oldMessage } = useQuery({
    queryKey: ["message", params.messageId],
    queryFn: fetchTag,
  });

  useEffect(() => {
    if (oldMessage) {
      setName(oldMessage.name);
      setEmail(oldMessage.email);
      setPhoneNumber(oldMessage.phoneNumber);
      setSubject(oldMessage.subject);
      setMessage(oldMessage.message);
    }
  }, [oldMessage]);

  const updateTag = async (formData: FormData) => {
    const response = await fetch(
      `/api/dashboard/messages?messageId=${params.messageId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.messageId,
          ...Object.fromEntries(formData),
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update message");
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
            altText="Go to messages"
            onClick={() => router.push("/dashboard/messages")}
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
        description: "Failed to update message",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("subject", subject);
    formData.append("message", message);

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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
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
