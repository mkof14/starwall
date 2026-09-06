"use client";

import { useRouter } from "next/navigation";
import { TaskList } from "@/components/auth/task-list";
import { LiveModeBanner } from "@/components/live-mode-banner";
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
    <div className="min-h-screen bg-page text-ink">
      {live ? <LiveModeBanner /> : null}
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted">
              {copy.tasksKicker}
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold">{copy.tasksTitle}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              {live ? copy.tasksLeadLive : copy.tasksLead}
            </p>
            {session ? (
              <p className="mt-3 font-mono text-[11px] text-muted">
                {copy.signedInAs} {session.name} · {session.role}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="tasks-sign-out"
              onClick={() => {
                signOut();
                router.push("/login");
              }}
              className="border border-stroke px-3 py-1.5 text-sm text-ink hover:border-orange"
            >
              {copy.signOut}
            </button>
          </div>
        </header>

        <div className="mt-8">
          <TaskList signedIn onLocked={() => router.push("/login")} />
        </div>
      </div>
    </div>
  );
}
