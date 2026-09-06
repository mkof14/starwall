import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginView } from "@/components/auth/login-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.login.title,
  description: pageMeta.login.description,
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-page px-4 py-16 text-ink">
          <p className="font-mono text-xs text-muted">…</p>
        </div>
      }
    >
      <LoginView />
    </Suspense>
  );
}
