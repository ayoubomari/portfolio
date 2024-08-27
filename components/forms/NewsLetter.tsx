"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent, FormEvent } from "react";
import { z } from "zod";

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

  const handlenewsLetterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted:", newsLetterFormData);

    if (validateForm()) {
      const { triggerConfetti } = await import("@/lib/confetti");
      triggerConfetti();
      setNewsLetterFormData({ email: "" });
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
      >
        Subscribe
      </Button>
    </form>
  );
}
