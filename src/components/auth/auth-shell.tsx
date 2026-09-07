import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen bg-page text-ink"
      data-testid="auth-shell"
    >
      <div className="chart-grid pointer-events-none absolute inset-0" />
      <div className="relative h-[2px] bg-orange" />
      <Link
        href="/"
        data-testid="auth-back"
        className="absolute start-4 top-6 z-10 inline-flex items-center gap-1 font-ui text-sm text-ink hover:text-orange md:start-6"
      >
        ← Back
      </Link>
      <div className="relative mx-auto w-full max-w-[26rem] px-4 py-20">
        <BrandLogo priority />
        <h1 className="mt-8 font-heading text-[5rem] font-bold leading-[0.95] text-ink">
          {title}
        </h1>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
