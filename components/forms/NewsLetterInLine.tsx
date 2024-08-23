"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function NewsLetterInLine() {
  const [newsLetterFormData, setNewsLetterFormData] = useState({
    email: "",
  });

  const handleNewsLetterInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewsLetterFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlenewsLetterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted:", newsLetterFormData);
    const { triggerConfetti } = await import("@/lib/confetti");
    triggerConfetti();
    setNewsLetterFormData({ email: "" });
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
      <Button type="submit" className="">
        Subscribe
      </Button>
    </form>
  );
}
