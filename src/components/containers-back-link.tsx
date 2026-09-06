"use client";

import Link from "next/link";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersBackLink() {
  const { t } = usePreferences();

  return (
    <p>
      <Link href="/containers" className="text-sm text-muted hover:text-orange">
        <RtlAwareLabel text={t.containers.back} />
      </Link>
    </p>
  );
}
