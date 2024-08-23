"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent, FormEvent } from "react";

type FormErrors = {
  email?: string;
};

export default function NewsLetter() {
  const [newsLetterFormData, setNewsLetterFormData] = useState({
    email: "",
  });

  const [newsLetterFormError, setNewsLetterFormError] = useState<FormErrors>({
    email: "",
  });

  const handleNewsLetterInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewsLetterFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors: FormErrors = {};
    let isValid: boolean = true;

    if (!newsLetterFormData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newsLetterFormData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    setNewsLetterFormError(errors);
    return isValid;
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
