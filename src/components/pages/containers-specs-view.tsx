"use client";

import { ContainersBackLink } from "@/components/containers-back-link";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersSpecsView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-14 md:px-6 lg:py-20">
        <ContainersBackLink />

        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {t.containers.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {t.containers.specsTitle}
          </h1>
        </header>

        <dl className="border border-stroke">
          {t.containers.specs.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 border-t border-stroke first:border-t-0 sm:grid-cols-2"
            >
              <dt className="px-4 py-3 text-sm font-bold text-ink">{row.label}</dt>
              <dd className="px-4 py-3 text-sm text-muted sm:text-end">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="border-s-4 border-orange bg-callout px-4 py-4 font-heading text-xl font-bold text-ink">
          {t.containers.rapid}
        </p>
      </div>
    </div>
  );
}
