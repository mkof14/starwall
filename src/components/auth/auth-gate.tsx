"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthSession } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";

type AuthGateProps = {
  children: ReactNode;
  next: string;
};

export function AuthGate({ children, next }: AuthGateProps) {
  const router = useRouter();
  const { ready, session, error, clearError } = useAuthSession();
  const { t } = usePreferences();
  const fallbackHref = `/login?next=${encodeURIComponent(next)}`;

  useEffect(() => {
    if (!ready || error || session) return;
    const current = `${window.location.pathname}${window.location.hash}`;
    router.replace(`/login?next=${encodeURIComponent(current || next)}`);
  }, [ready, error, session, router, next]);

  if (!ready) {
    return (
      <StatusPanel
        testId="auth-loading"
        kicker={t.auth.kicker}
        title={t.auth.loading}
      />
    );
  }

  if (error) {
    return (
      <StatusPanel
        testId="auth-error"
        kicker={t.auth.kicker}
        title={t.auth.error}
        action={
          <button
            type="button"
            onClick={clearError}
            className="border border-orange px-3 py-2 text-sm text-orange hover:bg-orange/10"
          >
            {t.auth.retry}
          </button>
        }
      />
    );
  }

  if (!session) {
    return (
      <StatusPanel
        testId="auth-redirect"
        kicker={t.auth.kicker}
        title={t.auth.gateTitle}
        body={t.auth.gateLead}
        action={
          <Link
            href={fallbackHref}
            className="inline-flex border border-orange px-3 py-2 text-sm text-orange hover:bg-orange/10"
          >
            {t.nav.auth}
          </Link>
        }
      />
    );
  }

  return <>{children}</>;
}

function StatusPanel({
  testId,
  kicker,
  title,
  body,
  action,
}: {
  testId: string;
  kicker: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="bg-page text-ink" data-testid={testId}>
      <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted">
          {kicker}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold">{title}</h1>
        {body ? <p className="mt-3 text-sm text-muted">{body}</p> : null}
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}
