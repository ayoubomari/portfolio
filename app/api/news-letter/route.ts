import { db } from "@/db";
import { z } from "zod";
import { newsLetterFormEntries } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const NewsLetterFormEntries = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
});

export async function POST(request: Request): Promise<Response> {
  const formData = await request.json();
  const result = NewsLetterFormEntries.safeParse(formData);

  if (!result.success) {
    const errors = result.error.format();
    return Response.json({ errors }, { status: 400 });
  }

  const { email } = result.data;

  try {
    const emails = await db
      .select({ email: sql`email` })
      .from(newsLetterFormEntries)
      .where(eq(newsLetterFormEntries.email, email));

    if (emails.length > 0) {
      return Response.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    await db
      .insert(newsLetterFormEntries)
      .values({
        email,
      })
      .execute();

    return Response.json(
      { message: "Your email has been added successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
