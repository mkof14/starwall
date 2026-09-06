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
      className="relative min-h-screen bg-[#E0EDF6] px-4 py-10 text-navyText"
      data-testid="auth-shell"
    >
      <Link
        href="/"
        data-testid="auth-back"
        className="absolute start-4 top-4 inline-flex items-center gap-1 font-ui text-sm text-navyText hover:text-orange md:start-6 md:top-6"
      >
        ← Back
      </Link>
      <div className="mx-auto w-full max-w-[26rem]">
        <div className="border border-[#B7C9D8] bg-white px-6 py-8 shadow-[0_12px_40px_rgb(15_25_34/0.08)] sm:px-8">
          <div className="flex justify-center">
            <BrandLogo className="h-9 sm:h-10" priority />
          </div>
          <h1 className="mt-6 text-center font-heading text-3xl font-bold text-navyText">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}
