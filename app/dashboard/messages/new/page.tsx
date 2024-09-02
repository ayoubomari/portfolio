"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const createContactFormEntry = async (formData: {
    name: string;
    email: string;
    phoneNumber: string;
    subject: string;
    message: string;
  }) => {
    const response = await fetch("/api/dashboard/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error("Failed to create contact form entry");
    }
    return response.json();
  };

  const mutation = useMutation({
    mutationFn: createContactFormEntry,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact form entry created successfully",
        variant: "success",
        action: (
          <ToastAction
            altText="Go to messages"
            onClick={() => router.push("/dashboard/messages")}
          >
            View Messages
          </ToastAction>
        ),
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create contact form entry",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email, phoneNumber, subject, message });
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
