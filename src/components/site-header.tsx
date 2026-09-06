"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePreferences } from "@/lib/i18n/context";
import { adminNavItem, navItems } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = usePreferences();

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-stroke bg-header print:hidden">
      <div className="flex h-full items-center justify-between gap-3 px-4 md:px-6">
        <Link
          href="/"
          className="flex h-full shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
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
          <Link
            href={adminNavItem.href}
            className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
              pathname.startsWith(adminNavItem.href)
                ? "border-orange text-orange"
                : "border-stroke text-muted hover:text-ink"
            }`}
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
              <path
                fill="currentColor"
                d="M8 1.4 2.2 4.2v3.4C2.2 11 5 13.8 8 14.6 11 13.8 13.8 11 13.8 7.6V4.2L8 1.4Zm0 2.3 4.4 2.1v2.1c0 2.3-1.9 4.3-4.4 5-2.5-.7-4.4-2.7-4.4-5V5.8L8 3.7Z"
              />
            </svg>
            {t.nav[adminNavItem.key]}
          </Link>
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
            <li className="border-b border-stroke last:border-b-0">
              <Link
                href={adminNavItem.href}
                className="flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider text-ink"
                onClick={() => setOpen(false)}
              >
                {t.nav[adminNavItem.key]}
              </Link>
            </li>
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
