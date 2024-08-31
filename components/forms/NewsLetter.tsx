"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent, FormEvent } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";


const NewsLetterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email is invalid"),
});

type FormData = z.infer<typeof NewsLetterSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function NewsLetter() {
  const [newsLetterFormData, setNewsLetterFormData] = useState<FormData>({
    email: "",
  });

  const [newsLetterFormError, setNewsLetterFormError] = useState<FormErrors>({});

  const { toast } = useToast();

  const mutation = useMutation<{ message: string }, Error, FormData>({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/news-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      const { triggerConfetti } = await import("@/lib/confetti");
      triggerConfetti();
      setNewsLetterFormData({
        email: "",
      });
      toast({
        title: "Success",
        description: data.message || "Your email has been added successfully!",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while submitting the form.",
        variant: "destructive",
      });
    },
  });


  const handleNewsLetterInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewsLetterFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const result = NewsLetterSchema.safeParse(newsLetterFormData);

    if (!result.success) {
      const errors: FormErrors = {};
      result.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          const key = error.path[0] as keyof FormData;
          errors[key] = error.message;
        }
      });
      setNewsLetterFormError(errors);
      return false;
    }

    setNewsLetterFormError({});
    return true;
  };

  const handlenewsLetterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      mutation.mutate(newsLetterFormData);
    }
  };

  return (
    <form className="flex flex-col space-y-2" onSubmit={handlenewsLetterSubmit}>
      <Input
        className="text-gray-900 dark:text-gray-100"
        type="email"
        name="email"
        value={newsLetterFormData.email}
        placeholder="Enter Your Email"
        onChange={handleNewsLetterInputChange}
        required
      />
      {newsLetterFormError.email && (
        <p className="mt-1 text-sm text-red-500">{newsLetterFormError.email}</p>
      )}
      <Button
        type="submit"
        className="bg-white text-primary hover:bg-gray-200 dark:bg-primary dark:text-white"
        disabled={mutation.isPending}
      >
        Subscribe
      </Button>
    </form>
  );
}
