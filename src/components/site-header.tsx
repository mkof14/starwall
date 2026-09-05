"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePreferences } from "@/lib/i18n/context";
import { navItems } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = usePreferences();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stroke bg-header">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <BrandLogo priority />
        </Link>

        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label={t.nav.primary}
        >
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${active ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden lg:flex lg:items-center">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">
              {open ? t.nav.closeMenu : t.nav.openMenu}
            </span>
            <span aria-hidden className="text-xl leading-none">
              {open ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="w-full border-t border-stroke bg-header lg:hidden"
          aria-label={t.nav.mobile}
        >
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-stroke last:border-b-0">
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-sm text-ink"
                  onClick={() => setOpen(false)}
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-3 py-2">
            <ThemeToggle />
            <LanguageSwitcher align="end" />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
