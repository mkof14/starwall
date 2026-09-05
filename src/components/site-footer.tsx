"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePreferences } from "@/lib/i18n/context";
import { navItems } from "@/lib/nav";

export function SiteFooter() {
  const { t } = usePreferences();

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
        </nav>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>{t.chrome.rights}</p>
          <p>
            <a href="https://agron1.com" className="hover:text-sand">
              agron1.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
