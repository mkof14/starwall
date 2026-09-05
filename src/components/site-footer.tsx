import Link from "next/link";
import { navItems } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="w-full bg-navy">
      <div className="flex flex-col gap-4 px-4 py-6 text-[13px] text-sand/70 md:px-6">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-sand"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© AGRON Inc. 2026 · All rights reserved</p>
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
