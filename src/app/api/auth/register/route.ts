import { NextResponse } from "next/server";
import { createUser } from "@/lib/user-store";

// TODO: replace with a real database (e.g. Postgres via Prisma) before production use.

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, organization, email, password } = body as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const result = await createUser({
    name,
    organization: typeof organization === "string" ? organization : "",
    email,
    password,
  });

  if (!result.ok) {
    if (result.error === "unavailable") {
      return NextResponse.json({ error: "Account store unavailable." }, { status: 503 });
    }
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  return NextResponse.json({
    ok: true,
    user: { name: result.user.name, email: result.user.email },
  });
}
