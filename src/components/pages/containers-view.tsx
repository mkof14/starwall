"use client";

import Link from "next/link";
import { ContainerConnectionDiagram } from "@/components/container-connection-diagram";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageHero,
  PageShell,
} from "@/components/page-chrome";
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
    <PageShell>
      <PageHero kicker={t.containers.kicker} title={t.containers.title} lead={t.containers.lead} />
      <PageBody>
        <NumberedGrid>
          {t.containers.zones.map((zone, index) => (
            <NumberedItem
              key={zone.title}
              index={index + 1}
              title={zone.title}
              body={zone.body}
              href={zoneHrefs[index] ?? undefined}
            />
          ))}
        </NumberedGrid>

        <NumberedGrid>
          {t.containers.subpages.map((title, index) => (
            <NumberedItem
              key={subHrefs[index]}
              index={index + 1}
              title={title}
              href={subHrefs[index]}
            />
          ))}
        </NumberedGrid>

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
      </PageBody>
    </PageShell>
  );
}
