"use client";

import { useRouter } from "next/navigation";
import { TaskList } from "@/components/auth/task-list";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { PageBody, PageHero, PageShell } from "@/components/page-chrome";
import { useAuthSession } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";
import { useAppMode } from "@/lib/mode";

export function TasksView() {
  const router = useRouter();
  const { live } = useAppMode();
  const { t } = usePreferences();
  const { session, signOut } = useAuthSession();
  const copy = t.auth;

  return (
    <PageShell>
      {live ? <LiveModeBanner /> : null}
      <PageHero
        kicker={copy.tasksKicker}
        title={copy.tasksTitle}
        lead={live ? copy.tasksLeadLive : copy.tasksLead}
      >
        {session ? (
          <p className="font-mono text-[11px] text-muted">
            {copy.signedInAs} {session.name} · {session.role}
          </p>
        ) : null}
        <div>
          <button
            type="button"
            data-testid="tasks-sign-out"
            onClick={() => {
              signOut();
              router.push("/login");
            }}
            className="border-s-2 border-stroke px-3 py-1.5 text-sm text-ink hover:border-orange"
          >
            {copy.signOut}
          </button>
        </div>
      </PageHero>
      <PageBody>
        <TaskList signedIn onLocked={() => router.push("/login")} />
      </PageBody>
    </PageShell>
  );
}
