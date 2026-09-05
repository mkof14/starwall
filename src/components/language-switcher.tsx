"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FlagIcon } from "@/components/flag-icon";
import { usePreferences } from "@/lib/i18n/context";
import { localeMeta, locales, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({
  align = "end",
  tone = "on-light",
}: {
  align?: "start" | "end";
  tone?: "on-light" | "on-dark";
}) {
  const { locale, setLocale, t } = usePreferences();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  const onDark = tone === "on-dark";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={cn(
          "inline-flex h-9 items-center gap-2 px-2 text-sm",
          onDark ? "text-sand/80 hover:text-sand" : "text-ink hover:text-orange",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t.chrome.language}
        onClick={() => setOpen((value) => !value)}
      >
        <FlagIcon locale={locale} />
        <span className="hidden sm:inline">{localeMeta[locale].native}</span>
        <span aria-hidden className="text-[10px]">
          ▾
        </span>
      </button>
      {open ? (
        <ul
          id={menuId}
          role="listbox"
          className={cn(
            "absolute z-50 mt-1 min-w-[13.5rem] border py-1 shadow-lg",
            align === "end" ? "end-0" : "start-0",
            onDark
              ? "border-white/10 bg-navy text-sand"
              : "border-stroke bg-page text-ink",
          )}
        >
          {locales.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-start text-sm",
                  code === locale
                    ? "text-orange"
                    : onDark
                      ? "hover:bg-white/5"
                      : "hover:bg-panel",
                )}
                onClick={() => choose(code)}
              >
                <FlagIcon locale={code} />
                <span>{localeMeta[code].native}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
