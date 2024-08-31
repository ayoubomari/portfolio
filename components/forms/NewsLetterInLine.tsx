"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";


const NewsLetterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
});

type FormData = z.infer<typeof NewsLetterSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function NewsLetterInLine() {
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
    <form
      onSubmit={handlenewsLetterSubmit}
      className="flex w-full max-w-md flex-col gap-2 md:flex-row md:rounded-lg md:border md:border-gray-300 md:p-1 md:dark:border-gray-700"
    >
      <Input
        type="email"
        name="email"
        value={newsLetterFormData.email}
        onChange={handleNewsLetterInputChange}
        placeholder="Enter Your Email"
        className="md:flex-grow md:border-none md:bg-transparent md:focus-visible:ring-0 md:focus-visible:ring-offset-0"
        required
      />
      {newsLetterFormError.email && (
        <p className="mt-1 text-sm text-red-500">{newsLetterFormError.email}</p>
      )}
      <Button  
        type="submit"
        className=""
        disabled={mutation.isPending}
      >
        Subscribe
      </Button>
    </form>
  );
}
