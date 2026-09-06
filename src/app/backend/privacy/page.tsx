import type { Metadata } from "next";
import Link from "next/link";
import { AuthGate } from "@/components/auth/auth-gate";
import { PrivacyView } from "@/components/pages/privacy-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.privacy.title,
  description: pageMeta.privacy.description,
};

export default function BackendPrivacyPage() {
  return (
    <AuthGate next="/backend/privacy">
      <div className="min-h-screen bg-bridge-bg px-4 py-10 md:px-6">
        <div className="mx-auto max-w-6xl border border-bridge-line bg-bridge-panel p-6 md:p-10">
          <p className="mb-6">
            <Link href="/backend" className="font-mono text-[11px] text-orange hover:underline">
              ← Backend
            </Link>
          </p>
          <PrivacyView framed />
        </div>
      </div>
    </AuthGate>
  );
}
