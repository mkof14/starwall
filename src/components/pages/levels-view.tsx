"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { usePreferences } from "@/lib/i18n/context";

export function LevelsView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-[13px] text-orange">{t.levels.kicker}</p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {t.levels.title}
          </h1>
        </header>

        <section aria-label={t.levels.tiersLabel}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {t.levels.tiers.map((tier, index) => {
              const highlight = index === 3;
              return (
                <article
                  key={tier.name}
                  className={cn(
                    "border p-5",
                    highlight
                      ? "border-navy bg-navy text-sand"
                      : "border-stroke bg-page text-ink",
                  )}
                >
                  <h2
                    className={cn(
                      "font-heading text-2xl font-bold",
                      highlight ? "text-sand" : "text-ink",
                    )}
                  >
                    {tier.name}
                  </h2>
                  <p
                    className={cn(
                      "mt-1 text-sm italic",
                      highlight ? "text-sand/70" : "text-muted",
                    )}
                  >
                    {tier.subtitle}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {tier.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="text-orange" aria-hidden>
                          —
                        </span>
                        <span className={highlight ? "text-sand/85" : "text-ink"}>
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <p className="max-w-3xl text-sm leading-relaxed text-muted">{t.levels.mapNote}</p>
        <p className="max-w-3xl text-sm leading-relaxed">
          <Link href="/pricing" className="font-medium text-orange underline-offset-2 hover:underline">
            {t.pricing.levelsCta}
          </Link>
        </p>

        <section className="space-y-5" aria-labelledby="honesty-heading">
          <p className="text-sm italic text-muted">{t.levels.honesty}</p>
          <h2 id="honesty-heading" className="sr-only">
            {t.levels.honestySr}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-ok/40 bg-page p-6">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-ok">
                {t.levels.available}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-ink">
                {t.levels.availableNow.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-orange" aria-hidden>
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-stroke bg-panel p-6 text-muted">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-attn">
                {t.levels.developing}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {t.levels.inDevelopment.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
