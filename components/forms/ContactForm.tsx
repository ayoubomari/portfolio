"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormErrors = {
  name?: string;
  phoneNumber?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    phoneNumber: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleContactInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors: FormErrors = {};
    let isValid: boolean = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
      isValid = false;
    }

    if (formData.phoneNumber) {
      const phoneRegex = /^\+?(\d{1,4})?\s?(\d{6,14})$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        errors.phoneNumber = "Invalid phone number format";
        isValid = false;
      }
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formData);
      const { triggerConfetti } = await import("@/lib/confetti");
      triggerConfetti();
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        subject: "",
        message: "",
      });
      setFormErrors({});
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
          <p className="mt-1 text-sm text-red-500">{formErrors.phoneNumber}</p>
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
      >
        Send Message
      </Button>
    </form>
  );
}
