"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-heading text-2xl font-bold leading-none">
            <span className="text-navyText">Star</span>
            <span className="text-orange">Wall</span>
          </span>
          <span className="text-sm text-grey">by AGRON</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${active ? "text-navyText" : "text-grey hover:text-navyText"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center text-navyText lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="text-xl leading-none">
            {open ? "×" : "☰"}
          </span>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="w-full border-t border-gray-200 bg-white lg:hidden"
          aria-label="Mobile"
        >
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-gray-100 last:border-b-0">
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-sm text-navyText"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
