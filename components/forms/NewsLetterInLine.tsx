"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";

const NewsLetterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
});

type NewsLetterFormData = z.infer<typeof NewsLetterSchema>;
type FormErrors = Partial<Record<keyof NewsLetterFormData, string>>;

export default function NewsLetterInLine() {
  const [newsLetterFormData, setNewsLetterFormData] = useState<NewsLetterFormData>({
    email: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

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
          const key = error.path[0] as keyof NewsLetterFormData;
          errors[key] = error.message;
        }
      });
      setFormErrors(errors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handlenewsLetterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", newsLetterFormData);
      const { triggerConfetti } = await import("@/lib/confetti");
      triggerConfetti();
      setNewsLetterFormData({ email: "" });
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
      {formErrors.email && (
        <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
      )}
      <Button type="submit" className="">
        Subscribe
      </Button>
    </form>
  );
}
