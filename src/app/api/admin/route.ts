import { NextResponse } from "next/server";

const ACTIONS = [
  "heartbeat",
  "cloud-backup",
  "local-backup",
  "request-config",
  "diagnostic",
  "acknowledge",
  "add-user",
  "set-role",
  "set-user-enabled",
  "test-integration",
  "toggle-integration",
  "export-audit",
] as const;

type AdminAction = (typeof ACTIONS)[number];

function isAction(value: unknown): value is AdminAction {
  return typeof value === "string" && (ACTIONS as readonly string[]).includes(value);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    at: new Date().toISOString(),
    host: process.env.VERCEL ? "vercel" : "local",
    helm: Boolean(process.env.ANTHROPIC_API_KEY),
    region: process.env.VERCEL_REGION ?? "local",
  });
}

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

  const { action, target } = body as { action?: unknown; target?: unknown };
  if (!isAction(action)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    action,
    target: typeof target === "string" ? target : null,
    at: new Date().toISOString(),
  });
}
