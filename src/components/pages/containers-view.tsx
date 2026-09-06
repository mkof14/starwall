"use client";

import Link from "next/link";
import { ContainerConnectionDiagram } from "@/components/container-connection-diagram";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { usePreferences } from "@/lib/i18n/context";

const zoneHrefs = [
  "/containers/detection",
  "/containers/countermeasures",
  null,
  null,
] as const;

const subHrefs = [
  "/containers/tiers",
  "/containers/specs",
  "/containers/countermeasures",
  "/containers/deployment",
] as const;

export function ContainersView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-6 lg:py-20">
        <header className="max-w-3xl space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {t.containers.kicker}
          </p>
          <h1 className="font-heading text-4xl font-bold text-ink text-balance sm:text-5xl">
            {t.containers.title}
          </h1>
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            {t.containers.lead}
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.containers.zones.map((zone, index) => {
            const href = zoneHrefs[index];
            const inner = (
              <>
                <h2 className="font-heading text-xl font-bold text-ink">{zone.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{zone.body}</p>
              </>
            );
            return href ? (
              <Link
                key={zone.title}
                href={href}
                className="border border-stroke bg-page p-5 hover:border-orange"
              >
                {inner}
              </Link>
            ) : (
              <article key={zone.title} className="border border-stroke bg-page p-5">
                {inner}
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {t.containers.subpages.map((title, index) => (
            <Link
              key={subHrefs[index]}
              href={subHrefs[index]}
              className="border border-stroke bg-page px-4 py-3 text-center font-heading text-lg font-bold text-ink hover:border-orange"
            >
              {title}
            </Link>
          ))}
        </section>

        <section className="space-y-5" data-testid="container-connection">
          <p className="text-sm text-muted">
            {t.containers.detectionLink}{" "}
            <Link href="/how-it-works" className="text-orange hover:underline">
              <RtlAwareLabel text={t.containers.howLink} />
            </Link>
          </p>
          <ContainerConnectionDiagram />
        </section>

        <Link
          href="/contact"
          className="inline-flex bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
        >
          {t.containers.contact}
        </Link>
      </div>
    </div>
  );
}
