"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { isAuthRoute, isInternalDesk, useAuthSession } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";
import { footerWorkItems, navItems } from "@/lib/nav";

const productHrefs = [
  "/",
  "/how-it-works",
  "/interface",
  "/pricing",
  "/technology",
  "/levels",
  "/containers",
] as const;

const companyHrefs = ["/about", "/contact", "/faq"] as const;

export function SiteFooter() {
  const { t } = usePreferences();
  const pathname = usePathname();
  const { session } = useAuthSession();
  if (isAuthRoute(pathname) || isInternalDesk(pathname)) return null;

  const product = productHrefs
    .map((href) => navItems.find((item) => item.href === href))
    .filter((item): item is (typeof navItems)[number] => Boolean(item));
  const company = companyHrefs
    .map((href) => navItems.find((item) => item.href === href))
    .filter((item): item is (typeof navItems)[number] => Boolean(item));

  return (
    <footer className="w-full bg-navy print:hidden">
      <div className="h-[2px] bg-orange" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="inline-flex shrink-0 items-center">
            <BrandLogo />
          </Link>
          <p className="max-w-xs text-[13px] leading-relaxed text-sand/70">
            {t.chrome.footerBlurb}
          </p>
        </div>
        <nav aria-label={t.chrome.footerProduct} className="space-y-3">
          <p className="font-heading text-lg text-sand">{t.chrome.footerProduct}</p>
          <ul className="space-y-2 text-[13px] text-sand/70">
            {product.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-sand">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t.chrome.footerCompany} className="space-y-3">
          <p className="font-heading text-lg text-sand">{t.chrome.footerCompany}</p>
          <ul className="space-y-2 text-[13px] text-sand/70">
            {company.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-sand">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
            {footerWorkItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-sand">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
            {session ? (
              <li>
                <Link href="/admin/starwall/pricing" className="hover:text-sand">
                  {t.nav.desk}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
        <nav aria-label={t.chrome.footerLegal} className="space-y-3">
          <p className="font-heading text-lg text-sand">{t.chrome.footerLegal}</p>
          <ul className="space-y-2 text-[13px] text-sand/70">
            <li>
              <Link href="/privacy" className="hover:text-sand">
                {t.chrome.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-sand">
                {t.chrome.terms}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-sand/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-[12px] text-sand/60 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p>{t.chrome.rights}</p>
          <div className="flex items-center gap-1">
            <ThemeToggle className="text-sand/80 hover:text-sand" />
            <LanguageSwitcher tone="on-dark" />
          </div>
        </div>
      </div>
    </footer>
  );
}
