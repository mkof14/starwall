"use client";

import { PageBody, PageHero, PageShell } from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function FaqView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero kicker={t.faq.kicker} title={t.faq.title} />
      <PageBody>
        <div className="divide-y divide-stroke border-y border-stroke">
          {t.faq.items.map((item, index) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer list-none marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block font-mono text-[11px] text-orange">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-heading text-xl font-bold text-ink">
                      {item.q}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="text-orange transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </PageBody>
    </PageShell>
  );
}
