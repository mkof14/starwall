"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { useAuthSession } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";
import { canManageUsers, USER_ROLES, type UserRole } from "@/lib/rbac";

type ManagedUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  pending: boolean;
  lastSignInAt: string | null;
};

export function UsersView() {
  const { session, ready } = useAuthSession();
  const { t } = usePreferences();
  const copy = t.backend;
  const allowed = canManageUsers(session?.role);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("Operator");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/users", { cache: "no-store" });
    if (response.status === 403) return;
    if (!response.ok) return;
    const payload = (await response.json()) as { users?: ManagedUser[] };
    setUsers(payload.users ?? []);
  }

  useEffect(() => {
    if (!ready || !allowed) return;
    void load();
  }, [ready, allowed]);

  async function changeRole(id: string, role: UserRole) {
    setError(null);
    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      setError(copy.notifySaveFailed);
      return;
    }
    const payload = (await response.json()) as { user?: ManagedUser };
    if (payload.user) {
      setUsers((current) =>
        current.map((user) => (user.id === payload.user?.id ? payload.user : user)),
      );
    }
    setMessage(copy.roleChanged);
  }

  async function invite() {
    setError(null);
    setMessage(null);
    const response = await fetch("/api/users/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, role: inviteRole }),
    });
    if (response.status === 409) {
      setError("An account with this email already exists.");
      return;
    }
    if (!response.ok) {
      setError(copy.notifySaveFailed);
      return;
    }
    const payload = (await response.json()) as {
      message?: string;
      user?: ManagedUser;
    };
    setMessage(payload.message ?? copy.invitationCreated);
    setEmail("");
    setName("");
    await load();
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-bridge-bg px-4 py-10 font-ui text-bridge-text">
        <p className="font-mono text-xs text-bridge-dim">{t.auth.loading}</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-bridge-bg px-4 py-10 font-ui text-bridge-text" dir="ltr">
        <div className="mx-auto max-w-3xl border border-bridge-line bg-bridge-panel p-6">
          <p className="font-mono text-sm text-attn">{copy.forbidden}</p>
          <Link href="/backend" className="mt-4 inline-block font-mono text-[11px] text-orange hover:underline">
            ← Backend
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bridge-bg px-4 py-10 font-ui text-bridge-text" dir="ltr">
      <div className="mx-auto max-w-6xl">
        <Link href="/backend" className="font-mono text-[11px] text-orange hover:underline">
          ← Backend
        </Link>
        <h1 className="mt-4 font-ui text-3xl font-bold tracking-wide">{copy.usersTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm text-bridge-dim">{copy.usersLead}</p>

        <div className="mt-8 space-y-4">
          <HudPanel testId="backend-users" title={copy.usersTitle}>
            <form
              className="mb-6 flex flex-wrap gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void invite();
              }}
            >
              <input
                data-testid="invite-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.invitePlaceholder}
                className="min-w-[12rem] flex-1 border border-bridge-line bg-bridge-bg px-2 py-1.5 font-ui text-sm outline-none focus:border-orange"
              />
              <input
                data-testid="invite-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={copy.inviteName}
                className="min-w-[8rem] border border-bridge-line bg-bridge-bg px-2 py-1.5 font-ui text-sm outline-none focus:border-orange"
              />
              <select
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value as UserRole)}
                className="border border-bridge-line bg-bridge-bg px-2 py-1.5 font-mono text-xs outline-none focus:border-orange"
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                data-testid="invite-submit"
                className="border border-orange px-3 py-1.5 font-ui text-xs text-orange hover:bg-orange/10"
              >
                {copy.inviteUser}
              </button>
            </form>
            {message ? (
              <p data-testid="invite-message" className="mb-4 font-mono text-[11px] text-ok">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="mb-4 font-mono text-[11px] text-crit">{error}</p>
            ) : null}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] font-mono text-xs">
                <thead className="text-bridge-dim">
                  <tr className="border-b border-bridge-line">
                    <th className="py-2 pe-3 text-start font-medium">{copy.colName}</th>
                    <th className="py-2 pe-3 text-start font-medium">{copy.colEmail}</th>
                    <th className="py-2 pe-3 text-start font-medium">{copy.colRole}</th>
                    <th className="py-2 text-start font-medium">{copy.colLastSignIn}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-bridge-line/60">
                      <td className="py-2 pe-3">
                        {user.name}
                        {user.pending ? (
                          <span className="ms-2 text-attn">{copy.pendingInvite}</span>
                        ) : null}
                      </td>
                      <td className="py-2 pe-3">{user.email}</td>
                      <td className="py-2 pe-3">
                        <select
                          data-testid={`role-${user.email}`}
                          value={user.role}
                          disabled={user.email === session?.email}
                          onChange={(event) =>
                            void changeRole(user.id, event.target.value as UserRole)
                          }
                          className="border border-bridge-line bg-bridge-bg px-1 py-0.5 disabled:opacity-60"
                        >
                          {USER_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 text-bridge-dim">
                        {user.lastSignInAt
                          ? new Date(user.lastSignInAt).toISOString().slice(0, 16).replace("T", " ")
                          : copy.neverSignedIn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </HudPanel>
        </div>
      </div>
    </div>
  );
}
