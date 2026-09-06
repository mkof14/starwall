"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ADMIN_ROLES, type AdminRole } from "@/lib/admin";

export const AUTH_KEY = "starwall-auth";

export type AuthSession = {
  name: string;
  email: string;
  role: AdminRole;
  at: string;
};

type AuthContextValue = {
  ready: boolean;
  session: AuthSession | null;
  error: boolean;
  signIn: (input: { name: string; email?: string; role: AdminRole }) => void;
  signOut: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isRole(value: unknown): value is AdminRole {
  return typeof value === "string" && ADMIN_ROLES.includes(value as AdminRole);
}

function parseSession(raw: string | null): {
  session: AuthSession | null;
  error: boolean;
} {
  if (!raw) return { session: null, error: false };
  try {
    const data = JSON.parse(raw) as Partial<AuthSession>;
    if (typeof data.name !== "string" || !data.name.trim() || !isRole(data.role)) {
      return { session: null, error: true };
    }
    return {
      session: {
        name: data.name.trim(),
        email: typeof data.email === "string" ? data.email.trim() : "",
        role: data.role,
        at: typeof data.at === "string" ? data.at : new Date().toISOString(),
      },
      error: false,
    };
  } catch {
    return { session: null, error: true };
  }
}

export function safeNextPath(value: string | null | undefined): string {
  if (!value) return "/tasks";
  if (!value.startsWith("/") || value.startsWith("//")) return "/tasks";
  return value;
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const parsed = parseSession(window.sessionStorage.getItem(AUTH_KEY));
    setSession(parsed.session);
    setError(parsed.error);
    setReady(true);
  }, []);

  const signIn = useCallback(
    (input: { name: string; email?: string; role: AdminRole }) => {
      const next: AuthSession = {
        name: input.name.trim(),
        email: (input.email ?? "").trim(),
        role: input.role,
        at: new Date().toISOString(),
      };
      window.sessionStorage.setItem(AUTH_KEY, JSON.stringify(next));
      setSession(next);
      setError(false);
    },
    [],
  );

  const signOut = useCallback(() => {
    window.sessionStorage.removeItem(AUTH_KEY);
    setSession(null);
    setError(false);
  }, []);

  const clearError = useCallback(() => {
    window.sessionStorage.removeItem(AUTH_KEY);
    setSession(null);
    setError(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ready, session, error, signIn, signOut, clearError }),
    [ready, session, error, signIn, signOut, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return context;
}
