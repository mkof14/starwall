"use client";

import Link from "next/link";
import { ContainersBackLink } from "@/components/containers-back-link";
import { LogTable, PageBody, PageHero, PageShell } from "@/components/page-chrome";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersDetectionView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero
        kicker={t.containers.eyebrow}
        title={t.containers.detectionTitle}
        preface={<ContainersBackLink />}
      />
      <PageBody>
        <LogTable
          columns={[t.containers.equipment, t.containers.spec]}
          rows={t.containers.detectionRows.map((row) => ({
            name: row.name,
            value: row.spec,
          }))}
        />
        <p className="text-sm text-muted">
          {t.containers.detectionNote}{" "}
          <Link href="/how-it-works" className="text-orange hover:underline">
            <RtlAwareLabel text={t.containers.howLink} />
          </Link>
        </p>
      </PageBody>
    </PageShell>
  );
}
