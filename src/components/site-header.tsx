"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccountMenu } from "@/components/auth/account-menu";
import { isAuthRoute, isInternalDesk, useAuthSession } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";
import { headerNavItems, headerWorkItems } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = usePreferences();
  const { session } = useAuthSession();
  const showMode =
    pathname.startsWith("/interface") ||
    pathname.startsWith("/backend") ||
    pathname.startsWith("/tasks");
  const workItems = session ? [] : [...headerWorkItems];

  if (isAuthRoute(pathname) || isInternalDesk(pathname)) return null;

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-stroke bg-header/92 shadow-[inset_0_2px_0_0_#F15A00] backdrop-blur-md print:hidden">
      <div className="flex h-full items-center justify-between gap-2 px-4 md:gap-3 md:px-6">
        <Link
          href="/"
          className="flex h-full shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <BrandLogo priority />
        </Link>

        <nav
          className="hidden items-center gap-4 lg:flex xl:gap-5"
          aria-label={t.nav.primary}
        >
          {headerNavItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-ui text-[13px] ${
                  active
                    ? "text-ink after:absolute after:-bottom-1 after:start-0 after:h-px after:w-full after:bg-orange"
                    : "text-muted hover:text-ink"
                }`}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
          {workItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  active
                    ? "border-orange text-orange"
                    : "border-stroke text-muted hover:text-ink"
                }`}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <AccountMenu />
          {showMode ? <ModeToggle /> : null}
          <div className="hidden lg:flex lg:items-center">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            data-testid="mobile-nav-toggle"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-stroke text-ink lg:hidden"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path
                  fill="currentColor"
                  d="M3.2 2.3 8 7.1l4.8-4.8 1.1 1.1L9.1 8.2l4.8 4.8-1.1 1.1L8 9.3l-4.8 4.8-1.1-1.1 4.8-4.8-4.8-4.8 1.1-1.1Z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path
                  fill="currentColor"
                  d="M2 3.2h12v1.5H2V3.2Zm0 4.05h12v1.5H2V7.25Zm0 4.05h12V12.8H2v-1.5Z"
                />
              </svg>
            )}
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
            {headerNavItems.map((item) => (
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
            {workItems.map((item) => (
              <li key={item.href} className="border-b border-stroke last:border-b-0">
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider text-ink"
                  onClick={() => setOpen(false)}
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
            <AccountMenu />
            {showMode ? <ModeToggle /> : null}
            <ThemeToggle />
            <LanguageSwitcher align="end" />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
