"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { ContainersBackLink } from "@/components/containers-back-link";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersTiersView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-14 md:px-6 lg:py-20">
        <ContainersBackLink />

        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {t.containers.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {t.containers.tiersTitle}
          </h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.containers.tiers.map((tier, index) => {
            const exclusive = index === 3;
            return (
              <article
                key={tier.name}
                className={cn(
                  "p-5",
                  exclusive
                    ? "border border-dashed border-ink bg-ink/5"
                    : "border border-stroke bg-page",
                )}
              >
                {exclusive ? (
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-orange">
                    {t.containers.customBadge}
                  </p>
                ) : null}
                <h2 className="font-heading text-2xl font-bold text-ink">{tier.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{tier.body}</p>
              </article>
            );
          })}
        </section>

        <p className="max-w-3xl text-sm leading-relaxed">
          <Link href="/pricing" className="font-medium text-orange underline-offset-2 hover:underline">
            {t.pricing.levelsCta}
          </Link>
        </p>
      </div>
    </div>
  );
}
