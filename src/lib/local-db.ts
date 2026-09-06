"use client";

import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { EventToast } from "@/components/bridge/event-toasts";
import type { SessionEvent } from "@/lib/scenarios";
import type { BlackBoxRecord, StorageLocation } from "@/lib/black-box-types";

const DB_NAME = "starwall-blackbox";
const DB_VERSION = 1;
const SESSION_KEY = "starwall-watch-session";

export type StoredEvent = EventToast & {
  timestamp: string;
  scenarioId?: string;
  category?: string;
  actionText?: string;
};

export type StoredConversation = {
  id: string;
  timestamp: string;
  role: "user" | "assistant" | "error";
  content: string;
  langCode?: string;
};

export type StoredSessionReport = {
  id: string;
  timestamp: string;
  generatedAt: string;
  vesselName: string;
  events: SessionEvent[];
};

export type StoredBlackBox = BlackBoxRecord;

interface StarwallDB extends DBSchema {
  events: { key: string; value: StoredEvent };
  conversations: { key: string; value: StoredConversation };
  sessionReports: { key: string; value: StoredSessionReport };
  blackbox: { key: string; value: StoredBlackBox };
}

let dbPromise: Promise<IDBPDatabase<StarwallDB>> | null = null;

function database() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!dbPromise) {
    dbPromise = openDB<StarwallDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("events")) {
          db.createObjectStore("events", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("conversations")) {
          db.createObjectStore("conversations", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("sessionReports")) {
          db.createObjectStore("sessionReports", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("blackbox")) {
          db.createObjectStore("blackbox", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export function watchSessionId() {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  window.localStorage.setItem(SESSION_KEY, next);
  return next;
}

export async function putEvent(event: StoredEvent) {
  const db = await database();
  await db.put("events", event);
}

export async function putEvents(events: StoredEvent[]) {
  const db = await database();
  const tx = db.transaction("events", "readwrite");
  await Promise.all(events.map((event) => tx.store.put(event)));
  await tx.done;
}

export async function listEvents(): Promise<StoredEvent[]> {
  const db = await database();
  const rows = await db.getAll("events");
  return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp) || b.id.localeCompare(a.id));
}

export async function putConversation(row: StoredConversation) {
  const db = await database();
  await db.put("conversations", row);
}

export async function listConversations(): Promise<StoredConversation[]> {
  const db = await database();
  const rows = await db.getAll("conversations");
  return rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp) || a.id.localeCompare(b.id));
}

export async function putSessionReport(row: StoredSessionReport) {
  const db = await database();
  await db.put("sessionReports", row);
}

export async function listSessionReports(): Promise<StoredSessionReport[]> {
  const db = await database();
  const rows = await db.getAll("sessionReports");
  return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function putBlackBox(row: StoredBlackBox) {
  const db = await database();
  await db.put("blackbox", row);
}

export async function listBlackBox(): Promise<StoredBlackBox[]> {
  const db = await database();
  const rows = await db.getAll("blackbox");
  return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function markBlackBoxLocation(id: string, storageLocation: StorageLocation) {
  const db = await database();
  const current = await db.get("blackbox", id);
  if (!current) return;
  await db.put("blackbox", { ...current, storageLocation });
}

export async function clearDemoLocalData() {
  const db = await database();
  const tx = db.transaction(
    ["events", "conversations", "sessionReports", "blackbox"],
    "readwrite",
  );
  await Promise.all([
    tx.objectStore("events").clear(),
    tx.objectStore("conversations").clear(),
    tx.objectStore("sessionReports").clear(),
    tx.objectStore("blackbox").clear(),
  ]);
  await tx.done;
}
