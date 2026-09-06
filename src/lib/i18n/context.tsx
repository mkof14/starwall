"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  defaultLocale,
  isLocale,
  rtlLocales,
  type Locale,
} from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/dictionaries";
import type { Messages } from "@/lib/i18n/messages";
import { isTheme, LOCALE_KEY, THEME_KEY, type Theme } from "@/lib/theme";

type Preferences = {
  locale: Locale;
  theme: Theme;
  t: Messages;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const PreferencesContext = createContext<Preferences | null>(null);

const titleByPath: Record<string, keyof Messages["seo"]> = {
  "/": "home",
  "/how-it-works": "howItWorks",
  "/interface": "interface",
  "/levels": "levels",
  "/technology": "technology",
  "/faq": "faq",
  "/containers": "containers",
  "/containers/detection": "containersDetection",
  "/containers/specs": "containersSpecs",
  "/containers/countermeasures": "containersCountermeasures",
  "/containers/tiers": "containersTiers",
  "/containers/deployment": "containersDeployment",
  "/contact": "contact",
  "/backend": "backend",
  "/interface/connections": "connections",
  "/login": "login",
  "/tasks": "tasks",
};

function applyDocument(locale: Locale, theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.lang = locale;
  root.dir = rtlLocales.has(locale) ? "rtl" : "ltr";
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(LOCALE_KEY);
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    const nextLocale = isLocale(storedLocale) ? storedLocale : defaultLocale;
    const nextTheme = isTheme(storedTheme) ? storedTheme : "light";
    setLocaleState(nextLocale);
    setThemeState(nextTheme);
    applyDocument(nextLocale, nextTheme);
  }, []);

  useEffect(() => {
    applyDocument(locale, theme);
    window.localStorage.setItem(LOCALE_KEY, locale);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [locale, theme]);

  useEffect(() => {
    const key = titleByPath[pathname] ?? "home";
    document.title = dictionaries[locale].seo[key];
  }, [locale, pathname]);

  const value = useMemo<Preferences>(
    () => ({
      locale,
      theme,
      t: dictionaries[locale],
      setLocale: setLocaleState,
      setTheme: setThemeState,
      toggleTheme: () =>
        setThemeState((current) => (current === "dark" ? "light" : "dark")),
    }),
    [locale, theme],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
