"use client";

import { usePreferences } from "@/lib/i18n/context";

export function LiveModeBanner() {
  const { t } = usePreferences();

  return (
    <p
      data-testid="live-mode-banner"
      className="border-b border-attn/35 bg-callout px-4 py-2.5 font-mono text-[11px] leading-relaxed text-ink md:px-6"
    >
      {t.surface.liveBanner}
    </p>
  );
}
