import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

type AssistantBody = {
  message?: unknown;
  context?: {
    scenarioName?: unknown;
    riskLevel?: unknown;
    vessel?: unknown;
    mode?: unknown;
  };
};

function asText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function parseLangTag(raw: string) {
  const match = raw.match(/^\[LANG:([a-z]{2})\]\s*/i);
  const langCode = match?.[1]?.toLowerCase() ?? "en";
  const reply = raw.replace(/^\[LANG:[a-z]{2}\]\s*/i, "").trim();
  return { reply, langCode };
}

export async function POST(request: Request) {
  let body: AssistantBody;
  try {
    body = (await request.json()) as AssistantBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const message = asText(body.message, "");
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const scenarioName = asText(body.context?.scenarioName, "Normal watch");
  const riskLevel = asText(body.context?.riskLevel, "NORMAL");
  const vessel = asText(body.context?.vessel, "M/Y AURELIA");
  const live = body.context?.mode === "live";

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Assistant is not configured. Add ANTHROPIC_API_KEY to .env.local and restart the server.",
      },
      { status: 503 },
    );
  }

  const situation = live
    ? "Current mode is LIVE. There is no live scenario or sensor data. This deployment is not connected to any radar, AIS, camera, or other equipment. If asked about current status, say you do not have live sensor data yet — this vessel is not connected to any equipment. They can ask about StarWall in general, or switch to DEMO mode to see a simulated scenario. Do not invent contacts, risk levels, equipment status, or events."
    : `Current situation: scenario is '${scenarioName}', risk level is '${riskLevel}', aboard ${vessel}.`;

  const system = `You are Helm, the watch advisor for StarWall on the AGRON Bridge. You are experienced, calm, and concise. You help the captain or security officer understand the current situation. You are not the decision-maker — you inform and advise, the human decides. ${situation} Respond in 2-4 sentences unless more detail is needed. IMPORTANT: Respond in the exact same language the user's message is written in. At the very start of your response, output a language code in this exact format on its own first line: [LANG:xx] where xx is the ISO 639-1 code (e.g. [LANG:en], [LANG:ru], [LANG:fr]) — then a newline, then your actual response.`;

  try {
    const client = new Anthropic({ apiKey });
    const result = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system,
      messages: [{ role: "user", content: message }],
    });

    const raw = result.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!raw) {
      return NextResponse.json(
        { error: "The assistant returned an empty reply." },
        { status: 502 },
      );
    }

    return NextResponse.json(parseLangTag(raw));
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Assistant request failed.";
    const rateLimited = /rate.?limit|429/i.test(detail);
    return NextResponse.json(
      {
        error: rateLimited
          ? "The assistant is rate-limited. Wait a moment and try again."
          : detail,
      },
      { status: rateLimited ? 429 : 502 },
    );
  }
}
