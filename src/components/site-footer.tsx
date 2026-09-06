"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { isAuthRoute, useAuthSession } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";
import { adminNavItem, authNavItem, navItems, tasksNavItem } from "@/lib/nav";

export function SiteFooter() {
  const { t } = usePreferences();
  const { session } = useAuthSession();
  const pathname = usePathname();
  if (isAuthRoute(pathname)) return null;
  const workItems = [
    ...(session ? [] : [authNavItem]),
    tasksNavItem,
    adminNavItem,
  ];

  return (
    <footer className="w-full bg-navy print:hidden">
      <div className="flex flex-col gap-4 px-4 py-6 text-[13px] text-sand/70 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BrandLogo className="h-10 sm:h-11" />
          <div className="flex items-center gap-1">
            <ThemeToggle className="text-sand/80 hover:text-sand" />
            <LanguageSwitcher tone="on-dark" />
          </div>
        </div>
        <nav aria-label={t.nav.footer} className="flex flex-wrap gap-x-4 gap-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sand">
              {t.nav[item.key]}
            </Link>
          ))}
          {workItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-wider text-sand/80 hover:text-sand"
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/privacy" className="hover:text-sand">
            {t.chrome.privacy}
          </Link>
          <Link href="/terms" className="hover:text-sand">
            {t.chrome.terms}
          </Link>
        </nav>
        <p>{t.chrome.rights}</p>
      </div>
    </footer>
  );
}
