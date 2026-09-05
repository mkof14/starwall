"use client";

import { ContainersBackLink } from "@/components/containers-back-link";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersDeploymentView() {
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
            {t.containers.deployTitle}
          </h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {t.containers.cases.map((item) => (
            <article key={item.name} className="border border-stroke bg-page">
              <div
                className="flex aspect-[16/10] items-center justify-center bg-panel px-4 text-center"
                aria-hidden
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
                  {t.containers.photo} {item.name}
                </p>
              </div>
              <div className="p-5">
                <h2 className="font-heading text-xl font-bold text-ink">{item.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
