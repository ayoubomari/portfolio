import { NextRequest, NextResponse } from 'next/server';
import { verify } from "@node-rs/argon2";
import { lucia } from "@/lib/auth/auth";
import { db } from "@/db";
import { admin } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return NextResponse.json({ success: false, error: "Invalid username" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 400 });
  }

  const existingUser = await db
    .query.admin.findFirst({ where: eq(admin.username, username.toLowerCase()) });

  if (!existingUser) {
    return NextResponse.json({ success: false, error: "Incorrect username or password" }, { status: 401 });
  }

  const validPassword = await verify(existingUser.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  if (!validPassword) {
    return NextResponse.json({ success: false, error: "Incorrect username or password" }, { status: 401 });
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return response;
}