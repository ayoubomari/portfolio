import { db } from "@/db";
import { contactFormEntries } from "@/db/schema";
import { z } from "zod";

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

export async function POST(request: Request): Promise<Response>  {
  try {
    const formData = await request.json();
    const result = ContactFormSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.format();
      return Response.json({ errors }, { status: 400 });
    }

    const { name, phoneNumber, email, subject, message } = result.data;

    await db.insert(contactFormEntries).values({
      name,
      email,
      phoneNumber,
      subject,
      message,
    }).execute();

    return Response.json({ message: "Your message has been sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}