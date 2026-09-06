import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

type AssistantBody = {
  message?: unknown;
  context?: {
    scenarioName?: unknown;
    riskLevel?: unknown;
    vessel?: unknown;
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

  const system = `You are the StarWall Assistant, an experienced, calm, knowledgeable maritime security assistant built into the AGRON Bridge interface aboard ${vessel}. You help the captain or security officer understand the current situation and make fast decisions. You are not the decision-maker — you inform and advise, the human decides. Current situation: scenario is '${scenarioName}', risk level is '${riskLevel}'. Respond concisely — 2-4 sentences unless genuinely more detail is needed. IMPORTANT: Respond in the exact same language the user's message is written in, matching their language naturally. At the very start of your response, output a language code in this exact format on its own first line: [LANG:xx] where xx is the ISO 639-1 code of the language you're responding in (e.g. [LANG:en], [LANG:ru], [LANG:fr]) — then a newline, then your actual response.`;

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
