import { db } from "@/db";
import { contactFormEntries } from "@/db/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import { env } from "@/env";

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

// Create email transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  secure: parseInt(env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

async function sendNotificationEmail(formData: {
  name: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
}) {
  const emailHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    ${formData.phoneNumber ? `<p><strong>Phone:</strong> ${formData.phoneNumber}</p>` : ''}
    <p><strong>Subject:</strong> ${formData.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${formData.message}</p>
  `;

  await transporter.sendMail({
    from: env.SMTP_EMAIL,
    to: env.RECEIVER_EMAIL,
    subject: `New Contact Form Submission: ${formData.subject}`,
    html: emailHtml,
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.json();
    const result = ContactFormSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.format();
      return Response.json({ errors }, { status: 400 });
    }

    const { name, phoneNumber, email, subject, message } = result.data;

    // Insert into database
    await db
      .insert(contactFormEntries)
      .values({
        name,
        email,
        phoneNumber,
        subject,
        message,
      })
      .execute();

    // Start sending the email notification without waiting for it
    sendNotificationEmail({
      name,
      email,
      phoneNumber,
      subject,
      message,
    }).catch(error => {
      console.error('Background email sending failed:', error);
    });

    return Response.json(
      { message: "Your message has been sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}