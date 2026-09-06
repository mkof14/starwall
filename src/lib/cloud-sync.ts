"use client";

import type { BlackBoxRecord } from "@/lib/black-box";
import type { StoredConversation, StoredEvent } from "@/lib/local-db";
import { watchSessionId } from "@/lib/local-db";

export type CloudWriteResult = { ok: true } | { ok: false; reason: string };

async function postJson(url: string, body: unknown): Promise<CloudWriteResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      return { ok: false, reason: "signed_out" };
    }
    if (!response.ok) {
      return { ok: false, reason: "unavailable" };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export function cloudVesselName(live: boolean) {
  return live ? "Unconnected deployment" : "M/Y AURELIA";
}

export async function syncEventToCloud(event: StoredEvent, vesselName: string) {
  return postJson("/api/events", {
    sessionId: watchSessionId(),
    vesselName,
    event: {
      id: event.id,
      timestamp: event.timestamp,
      scenarioId: event.scenarioId ?? null,
      category: event.category ?? null,
      riskLevel: event.level,
      logText: event.text,
      actionText: event.actionText ?? null,
    },
  });
}

export async function syncConversationToCloud(row: StoredConversation, vesselName: string) {
  if (row.role === "error") {
    return { ok: false as const, reason: "skip" };
  }
  return postJson("/api/conversations", {
    sessionId: watchSessionId(),
    vesselName,
    conversation: {
      id: row.id,
      timestamp: row.timestamp,
      role: row.role,
      content: row.content,
      langCode: row.langCode ?? null,
    },
  });
}

export async function syncBlackBoxToCloud(record: BlackBoxRecord, vesselName: string) {
  return postJson("/api/blackbox", {
    sessionId: watchSessionId(),
    vesselName,
    record: {
      id: record.id,
      type: record.type,
      timestamp: record.timestamp,
      summary: record.summary,
      fullContent: record.fullContent,
      storageLocation: "both",
    },
  });
}

export async function fetchCloudBlackBox() {
  try {
    const response = await fetch("/api/blackbox");
    if (!response.ok) return [];
    const data = (await response.json()) as { records?: BlackBoxRecord[] };
    return data.records ?? [];
  } catch {
    return [];
  }
}
