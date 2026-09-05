"use client";

import Link from "next/link";
import { ContainersBackLink } from "@/components/containers-back-link";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersDetectionView() {
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
            {t.containers.detectionTitle}
          </h1>
        </header>

        <div className="overflow-x-auto border border-stroke">
          <table className="w-full min-w-[32rem] text-start text-sm">
            <thead className="bg-navy text-sand">
              <tr>
                <th className="px-4 py-3 font-heading text-base font-bold">
                  {t.containers.equipment}
                </th>
                <th className="px-4 py-3 font-heading text-base font-bold">
                  {t.containers.spec}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.containers.detectionRows.map((row) => (
                <tr key={row.name} className="border-t border-stroke align-top">
                  <th className="px-4 py-3 font-bold text-ink">{row.name}</th>
                  <td className="px-4 py-3 text-muted">{row.spec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted">
          {t.containers.detectionNote}{" "}
          <Link href="/how-it-works" className="text-orange hover:underline">
            {t.containers.howLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
