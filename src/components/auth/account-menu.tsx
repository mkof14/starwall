"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useAuthSession } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";

export function AccountMenu() {
  const { session, signOut } = useAuthSession();
  const { t } = usePreferences();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  if (!session) return null;

  const initial = (session.name.trim()[0] || session.email[0] || "S").toUpperCase();

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        data-testid="account-menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2"
        title={session.email || session.name}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange font-ui text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[9rem] truncate font-mono text-[10px] text-muted xl:inline">
          {session.name}
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          className="absolute end-0 z-30 mt-2 min-w-[12rem] border border-stroke bg-panel py-2 shadow-lg"
        >
          <p className="px-3 pb-2 text-sm text-ink">{session.name}</p>
          {session.email ? (
            <p className="px-3 pb-2 font-mono text-[10px] text-muted">
              {session.email}
            </p>
          ) : null}
          <p className="px-3 pb-2 font-mono text-[10px] text-orange">
            {session.role}
          </p>
          <Link
            href="/admin/starwall/pricing"
            data-testid="account-desk"
            onClick={() => setOpen(false)}
            className="block w-full px-3 py-1.5 text-start text-sm text-ink hover:bg-page"
          >
            {t.nav.desk}
          </Link>
          <button
            type="button"
            data-testid="account-sign-out"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full px-3 py-1.5 text-start text-sm text-ink hover:bg-page"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
