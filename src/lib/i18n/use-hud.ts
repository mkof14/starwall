"use client";

import { HUD } from "@/lib/i18n/hud";
import { usePreferences } from "@/lib/i18n/context";

export function useHud() {
  const { locale, t } = usePreferences();
  return { locale, t, hud: HUD[locale] ?? HUD.en };
}
