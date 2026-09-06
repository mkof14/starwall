"use client";

import { useEffect, useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { usePreferences } from "@/lib/i18n/context";

const LEVELS = ["attention", "elevated", "critical"] as const;
const CHANNELS = ["email", "sms", "phone", "chat"] as const;
const METHOD_BY_CHANNEL = {
  email: "email",
  sms: "sms",
  phone: "call",
  chat: "messenger",
} as const;

type LevelId = (typeof LEVELS)[number];
type ChannelId = (typeof CHANNELS)[number];

type RouteRow = {
  riskLevel: string;
  method: string;
  contact: string;
  enabled: boolean;
};

type Row = {
  channels: Record<ChannelId, boolean>;
  recipient: string;
};

function emptyRow(): Row {
  return {
    channels: { email: true, sms: false, phone: false, chat: false },
    recipient: "",
  };
}

function rowsFromRoutes(routes: RouteRow[]): Record<LevelId, Row> {
  const next: Record<LevelId, Row> = {
    attention: emptyRow(),
    elevated: emptyRow(),
    critical: emptyRow(),
  };
  for (const level of LEVELS) {
    const matches = routes.filter((route) => route.riskLevel === level);
    if (matches.length === 0) continue;
    const channels = { email: false, sms: false, phone: false, chat: false };
    for (const route of matches) {
      if (route.method === "email") channels.email = route.enabled;
      if (route.method === "sms") channels.sms = route.enabled;
      if (route.method === "call") channels.phone = route.enabled;
      if (route.method === "messenger") channels.chat = route.enabled;
    }
    next[level] = {
      channels,
      recipient: matches.find((route) => route.contact)?.contact ?? "",
    };
  }
  return next;
}

function routesFromRows(rows: Record<LevelId, Row>): RouteRow[] {
  const routes: RouteRow[] = [];
  for (const level of LEVELS) {
    for (const channel of CHANNELS) {
      routes.push({
        riskLevel: level,
        method: METHOD_BY_CHANNEL[channel],
        contact: rows[level].recipient,
        enabled: rows[level].channels[channel],
      });
    }
  }
  return routes;
}

export function NotifyPanel({ canWrite }: { canWrite: boolean }) {
  const { t } = usePreferences();
  const copy = t.backend;
  const [rows, setRows] = useState<Record<LevelId, Row>>({
    attention: emptyRow(),
    elevated: emptyRow(),
    critical: emptyRow(),
  });
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error" | "forbidden">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/notifications", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("load");
        const payload = (await response.json()) as { routes?: RouteRow[] };
        if (cancelled) return;
        setRows(rowsFromRoutes(payload.routes ?? []));
        setStatus("idle");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    if (!canWrite) return;
    setStatus("saving");
    const response = await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routes: routesFromRows(rows) }),
    });
    if (response.status === 403) {
      setStatus("forbidden");
      return;
    }
    if (!response.ok) {
      setStatus("error");
      return;
    }
    const payload = (await response.json()) as { routes?: RouteRow[] };
    setRows(rowsFromRoutes(payload.routes ?? []));
    setStatus("saved");
  }

  const levelLabel: Record<LevelId, string> = {
    attention: copy.notifyAttention,
    elevated: copy.notifyElevated,
    critical: copy.notifyCritical,
  };
  const channelLabel: Record<ChannelId, string> = {
    email: copy.notifyEmail,
    sms: copy.notifySms,
    phone: copy.notifyPhone,
    chat: copy.notifyChat,
  };

  return (
    <HudPanel testId="backend-notify" title={copy.notifyTitle}>
      <p className="mb-4 font-mono text-[11px] leading-relaxed text-bridge-dim">
        {copy.notifyNote}
      </p>
      {!canWrite ? (
        <p className="mb-4 font-mono text-[11px] text-attn">{copy.settingsLocked}</p>
      ) : null}
      <div className="space-y-4">
        {LEVELS.map((level) => (
          <fieldset
            key={level}
            className="border border-bridge-line bg-bridge-bg px-3 py-3"
          >
            <legend className="px-1 font-mono text-[10px] tracking-wider text-orange">
              {levelLabel[level]}
            </legend>
            <div className="flex flex-wrap gap-3 text-xs">
              {CHANNELS.map((channel) => (
                <label key={channel} className="inline-flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    disabled={!canWrite}
                    checked={rows[level].channels[channel]}
                    onChange={(event) =>
                      setRows((current) => ({
                        ...current,
                        [level]: {
                          ...current[level],
                          channels: {
                            ...current[level].channels,
                            [channel]: event.target.checked,
                          },
                        },
                      }))
                    }
                  />
                  {channelLabel[channel]}
                </label>
              ))}
            </div>
            <label className="mt-3 block text-xs">
              <span className="text-bridge-dim">{copy.notifyRecipient}</span>
              <input
                data-testid={`notify-contact-${level}`}
                disabled={!canWrite}
                value={rows[level].recipient}
                onChange={(event) =>
                  setRows((current) => ({
                    ...current,
                    [level]: {
                      ...current[level],
                      recipient: event.target.value,
                    },
                  }))
                }
                className="mt-1 w-full border border-bridge-line bg-bridge-panel px-2 py-1.5 text-sm outline-none focus:border-orange disabled:opacity-60"
              />
            </label>
          </fieldset>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-testid="notify-save"
          disabled={!canWrite || status === "saving" || status === "loading"}
          onClick={() => void save()}
          className="border border-orange px-3 py-1.5 font-ui text-xs text-orange hover:bg-orange/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" ? copy.savingNotify : copy.saveNotify}
        </button>
        {status === "saved" ? (
          <p data-testid="notify-saved" className="font-mono text-[11px] text-ok">
            {copy.notifySaved}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="font-mono text-[11px] text-crit">{copy.notifySaveFailed}</p>
        ) : null}
        {status === "forbidden" ? (
          <p className="font-mono text-[11px] text-attn">{copy.settingsLocked}</p>
        ) : null}
      </div>
    </HudPanel>
  );
}
