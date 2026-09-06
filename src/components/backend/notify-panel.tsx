"use client";

import { useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { usePreferences } from "@/lib/i18n/context";

const LEVELS = ["attention", "elevated", "critical"] as const;
const CHANNELS = ["email", "sms", "phone", "chat"] as const;

type LevelId = (typeof LEVELS)[number];
type ChannelId = (typeof CHANNELS)[number];

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

export function NotifyPanel() {
  const { t } = usePreferences();
  const copy = t.backend;
  const [rows, setRows] = useState<Record<LevelId, Row>>({
    attention: emptyRow(),
    elevated: { channels: { email: true, sms: true, phone: false, chat: false }, recipient: "" },
    critical: { channels: { email: true, sms: true, phone: true, chat: true }, recipient: "" },
  });

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
                value={rows[level].recipient}
                onChange={(event) =>
                  setRows((current) => ({
                    ...current,
                    [level]: { ...current[level], recipient: event.target.value },
                  }))
                }
                className="mt-1 w-full border border-bridge-line bg-bridge-panel px-2 py-1.5 text-sm outline-none focus:border-orange"
              />
            </label>
          </fieldset>
        ))}
      </div>
    </HudPanel>
  );
}
