export const locales = [
  "en",
  "es",
  "fr",
  "de",
  "ru",
  "uk",
  "ar",
  "zh",
  "ja",
  "he",
] as const;

export type Locale = (typeof locales)[number];

/** Languages offered in the public header/footer switcher. */
export const siteLocales = ["en", "ru", "fr", "ar"] as const;

export type SiteLocale = (typeof siteLocales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales = new Set<Locale>(["ar", "he"]);

export const localeMeta: Record<
  Locale,
  { native: string; english: string; dir: "ltr" | "rtl" }
> = {
  en: { native: "English", english: "English", dir: "ltr" },
  es: { native: "Español", english: "Spanish", dir: "ltr" },
  fr: { native: "Français", english: "French", dir: "ltr" },
  de: { native: "Deutsch", english: "German", dir: "ltr" },
  ru: { native: "Русский", english: "Russian", dir: "ltr" },
  uk: { native: "Українська", english: "Ukrainian", dir: "ltr" },
  ar: { native: "العربية", english: "Arabic", dir: "rtl" },
  zh: { native: "中文", english: "Chinese", dir: "ltr" },
  ja: { native: "日本語", english: "Japanese", dir: "ltr" },
  he: { native: "עברית", english: "Hebrew", dir: "rtl" },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function isSiteLocale(value: string | null | undefined): value is SiteLocale {
  return siteLocales.includes(value as SiteLocale);
}
