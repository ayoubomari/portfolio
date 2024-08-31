"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?(\d{1,4})?\s?(\d{6,14})$/.test(val),
      "Invalid phone number format"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email is invalid"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof ContactFormSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactForm() {
const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const mutation = useMutation<{ message: string }, Error, FormData>({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/contact", {
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
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        subject: "",
        message: "",
      });
      toast({
        title: "Success",
        description: data.message || "Your message has been sent successfully!",
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

  const handleContactInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const result = ContactFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: FormErrors = {};
      result.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          const key = error.path[0] as keyof FormData;
          errors[key] = error.message;
        }
      });
      setFormErrors(errors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  return (
    <form
      onSubmit={handleContactSubmit}
      className="mx-auto grid max-w-3xl gap-4 rounded bg-white p-4 shadow-md dark:bg-gray-800 md:grid-cols-2 md:p-8"
    >
      <div className="mb-4">
        <label
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          htmlFor="name"
        >
          Name
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleContactInputChange}
          placeholder="Enter Your Name"
          required
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleContactInputChange}
          placeholder="Enter Your Email"
          required
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          htmlFor="subject"
        >
          Subject
        </label>
        <Input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleContactInputChange}
          placeholder="Enter Your Subject"
          required
        />
        {formErrors.subject && (
          <p className="mt-1 text-sm text-red-500">{formErrors.subject}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          htmlFor="phoneNumber"
        >
          Phone
        </label>
        <Input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleContactInputChange}
          placeholder="Enter Your Phone"
        />
        {formErrors.phoneNumber && (
          <p className="mt-1 text-sm text-red-500">
            {formErrors.phoneNumber}
          </p>
        )}
      </div>
      <div className="col-span-1 mb-4 sm:col-span-2">
        <label
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          htmlFor="message"
        >
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleContactInputChange}
          placeholder="Enter Your Message"
          required
        />
        {formErrors.message && (
          <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="col-span-1 w-full bg-primary sm:col-span-2"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
