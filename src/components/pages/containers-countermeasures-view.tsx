"use client";

import { ContainersBackLink } from "@/components/containers-back-link";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersCountermeasuresView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-14 md:px-6 lg:py-20">
        <ContainersBackLink />

        <aside className="border-s-4 border-orange bg-callout px-4 py-4 text-sm leading-relaxed text-ink">
          {t.containers.cmLegal}
        </aside>

        <header>
          <p className="font-ui text-[12px] tracking-wide text-orange">
            {t.containers.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {t.containers.cmTitle}
          </h1>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {t.containers.cmItems.map((item) => (
            <article key={item.name} className="border border-stroke bg-page p-5">
              <h2 className="font-heading text-xl font-bold text-ink">{item.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
