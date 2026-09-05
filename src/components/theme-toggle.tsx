"use client";

import { usePreferences } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, t } = usePreferences();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center hover:text-orange",
        className ?? "text-ink",
      )}
      aria-label={dark ? t.chrome.themeToLight : t.chrome.themeToDark}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M16.5 13.2A7 7 0 0 1 10.8 4.2 7.2 7.2 0 1 0 16.5 13.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.8 19.2l1.6-1.6M17.6 6.4l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
