"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { isUserRole, type UserRole } from "@/lib/rbac";

export type AuthSession = {
  name: string;
  email: string;
  role: UserRole;
  at: string;
};

type AuthContextValue = {
  ready: boolean;
  session: AuthSession | null;
  error: boolean;
  signOut: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function safeNextPath(value: string | null | undefined): string {
  if (!value) return "/interface";
  let path = value;
  if (path.startsWith("http")) {
    try {
      const url = new URL(path);
      path = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return "/interface";
    }
  }
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/login")) {
    return "/interface";
  }
  return path;
}

export function isAuthRoute(pathname: string | null | undefined) {
  return (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
  );
}

export function isInternalDesk(pathname: string | null | undefined) {
  return Boolean(pathname?.startsWith("/admin"));
}

function AuthSessionInner({ children }: { children: ReactNode }) {
  const { data, status } = useSession();
  const ready = status !== "loading";
  const session = useMemo<AuthSession | null>(() => {
    if (!data?.user) return null;
    const name = data.user.name?.trim() || data.user.email?.split("@")[0] || "Officer";
    return {
      name,
      email: data.user.email?.trim() ?? "",
      role: isUserRole(data.user.role) ? data.user.role : "Operator",
      at: new Date().toISOString(),
    };
  }, [data]);

  const leave = useCallback(() => {
    void signOut({ callbackUrl: "/" });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      session,
      error: false,
      signOut: leave,
      clearError: leave,
    }),
    [ready, session, leave],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthSessionInner>{children}</AuthSessionInner>
    </SessionProvider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return context;
}
