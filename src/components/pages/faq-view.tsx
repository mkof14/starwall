"use client";

import { usePreferences } from "@/lib/i18n/context";

export function FaqView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {t.faq.kicker}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {t.faq.title}
          </h1>
        </header>

        <div className="divide-y divide-stroke border-y border-stroke">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer list-none font-heading text-xl font-bold text-ink marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="text-orange transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
