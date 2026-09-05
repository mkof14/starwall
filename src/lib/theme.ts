export const themes = ["light", "dark"] as const;
export type Theme = (typeof themes)[number];

export const THEME_KEY = "starwall-theme";
export const LOCALE_KEY = "starwall-locale";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}
