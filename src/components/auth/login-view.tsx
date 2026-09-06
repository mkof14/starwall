"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { TaskList } from "@/components/auth/task-list";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { ModeToggle } from "@/components/mode-toggle";
import { ADMIN_ROLES, SEEDED_USERS, type AdminRole } from "@/lib/admin";
import { safeNextPath, useAuthSession } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";
import { useAppMode } from "@/lib/mode";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { live } = useAppMode();
  const { t } = usePreferences();
  const { ready, session, error, signIn, signOut, clearError } = useAuthSession();
  const copy = t.auth;
  const nextPath = safeNextPath(searchParams.get("next"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("Operator");
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingNext, setPendingNext] = useState<string | null>(null);

  const roleLabels = useMemo(
    () => ({
      "Super Admin": t.backend.roleSuper,
      Admin: t.backend.roleAdmin,
      Operator: t.backend.roleOperator,
      Viewer: t.backend.roleViewer,
    }),
    [t.backend],
  );

  function applyAccount(accountName: string, accountRole: AdminRole) {
    setName(accountName);
    setEmail("");
    setRole(accountRole);
    setFormError(null);
  }

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setFormError(copy.nameRequired);
      return;
    }
    const trimmedEmail = email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError(copy.emailInvalid);
      return;
    }
    signIn({ name: trimmed, email: trimmedEmail, role });
    router.push(safeNextPath(pendingNext ?? nextPath));
  }

  if (!ready) {
    return (
      <div className="bg-page text-ink" data-testid="auth-loading">
        <div className="mx-auto max-w-xl px-4 py-16">
          <p className="font-mono text-xs text-muted">{copy.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-page text-ink" data-testid="auth-error">
        <div className="mx-auto max-w-xl px-4 py-16">
          <h1 className="font-heading text-3xl font-bold">{copy.error}</h1>
          <button
            type="button"
            onClick={clearError}
            className="mt-6 border border-orange px-3 py-2 text-sm text-orange hover:bg-orange/10"
          >
            {copy.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      {live ? <LiveModeBanner /> : null}
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted">
              {copy.kicker}
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold text-ink">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              {live ? copy.leadLive : copy.lead}
            </p>
          </div>
          <ModeToggle />
        </header>

        <p className="mt-6 border border-stroke bg-panel px-3 py-2 font-mono text-[11px] text-muted">
          {live ? copy.sessionNoticeLive : copy.sessionNotice}
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
          <section
            aria-labelledby="auth-form-title"
            className="border border-stroke bg-panel p-4 md:p-5"
          >
            {session ? (
              <div data-testid="auth-signed-in">
                <h2 id="auth-form-title" className="font-ui text-lg font-semibold">
                  {copy.signedInAs}
                </h2>
                <p className="mt-2 text-sm text-ink">{session.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">
                  {roleLabels[session.role]}
                  {session.email ? ` · ${session.email}` : ""}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    data-testid="auth-continue"
                    onClick={() => router.push(safeNextPath(pendingNext ?? nextPath))}
                    className="bg-orange px-3 py-2 text-sm font-medium text-white hover:bg-orange/90"
                  >
                    {t.nav.tasks}
                  </button>
                  <button
                    type="button"
                    data-testid="auth-sign-out"
                    onClick={signOut}
                    className="border border-stroke px-3 py-2 text-sm text-ink hover:border-orange"
                  >
                    {copy.signOut}
                  </button>
                </div>
              </div>
            ) : (
              <form
                data-testid="auth-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
              >
                <h2 id="auth-form-title" className="font-ui text-lg font-semibold">
                  {copy.signIn}
                </h2>
                <label className="mt-4 block text-sm">
                  <span className="text-muted">{copy.nameLabel}</span>
                  <input
                    data-testid="auth-name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setFormError(null);
                    }}
                    placeholder={copy.namePlaceholder}
                    autoComplete="name"
                    className="mt-1 w-full border border-stroke bg-page px-3 py-2 text-ink outline-none focus:border-orange"
                  />
                </label>
                <label className="mt-3 block text-sm">
                  <span className="text-muted">{copy.emailLabel}</span>
                  <input
                    data-testid="auth-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setFormError(null);
                    }}
                    placeholder={copy.emailPlaceholder}
                    autoComplete="email"
                    className="mt-1 w-full border border-stroke bg-page px-3 py-2 text-ink outline-none focus:border-orange"
                  />
                </label>
                <label className="mt-3 block text-sm">
                  <span className="text-muted">{copy.roleLabel}</span>
                  <select
                    data-testid="auth-role"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as AdminRole)
                    }
                    className="mt-1 w-full border border-stroke bg-page px-3 py-2 font-mono text-xs text-ink outline-none focus:border-orange"
                  >
                    {ADMIN_ROLES.map((item) => (
                      <option key={item} value={item}>
                        {roleLabels[item]}
                      </option>
                    ))}
                  </select>
                </label>
                {formError ? (
                  <p
                    data-testid="auth-form-error"
                    className="mt-3 font-mono text-[11px] text-crit"
                  >
                    {formError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  data-testid="auth-submit"
                  className="mt-5 w-full bg-orange px-3 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
                >
                  {copy.signIn}
                </button>
              </form>
            )}

            <div className="mt-6 border-t border-stroke pt-4">
              <p className="font-mono text-[10px] tracking-wider text-muted">
                {live ? copy.liveEmptyAccounts : copy.demoAccounts}
              </p>
              {live ? (
                <p
                  data-testid="auth-live-empty"
                  className="mt-2 text-sm text-muted"
                >
                  {copy.leadLive}
                </p>
              ) : (
                <ul className="mt-2 space-y-2" data-testid="auth-demo-accounts">
                  {SEEDED_USERS.map((user) => (
                    <li key={user.id}>
                      <button
                        type="button"
                        data-testid={`auth-account-${user.id}`}
                        onClick={() => applyAccount(user.name, user.role)}
                        className="w-full border border-stroke bg-page px-3 py-2 text-start hover:border-orange"
                      >
                        <span className="block text-sm text-ink">{user.name}</span>
                        <span className="block font-mono text-[10px] text-muted">
                          {roleLabels[user.role]} · {copy.useAccount}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section aria-labelledby="auth-tasks-title">
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted">
              {copy.tasksKicker}
            </p>
            <h2
              id="auth-tasks-title"
              className="mt-2 font-heading text-3xl font-bold"
            >
              {copy.tasksTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              {live ? copy.tasksLeadLive : copy.tasksLead}
            </p>
            <div className="mt-6">
              <TaskList
                signedIn={Boolean(session)}
                onLocked={(href) => {
                  setPendingNext(href);
                  router.replace(`/login?next=${encodeURIComponent(href)}`);
                  document.getElementById("auth-form-title")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  setFormError(copy.lockedHint);
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
