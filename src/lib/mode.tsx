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
import { wipeDemoLocalData } from "@/lib/demo-storage";

export const modes = ["demo", "live"] as const;
export type AppMode = (typeof modes)[number];

export const MODE_KEY = "starwall-mode";
export const defaultMode: AppMode = "demo";

export function isAppMode(value: string | null | undefined): value is AppMode {
  return value === "demo" || value === "live";
}

type ModeContextValue = {
  mode: AppMode;
  live: boolean;
  setMode: (mode: AppMode) => void;
};

const ModeContext = createContext<ModeContextValue>({
  mode: defaultMode,
  live: false,
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(defaultMode);

  useEffect(() => {
    const stored = window.localStorage.getItem(MODE_KEY);
    if (isAppMode(stored)) setModeState(stored);
    if (stored === "live") void wipeDemoLocalData();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const setMode = useCallback((next: AppMode) => {
    setModeState((previous) => {
      if (next === previous) return previous;
      if (next === "live") {
        void wipeDemoLocalData();
      }
      void fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mode_switch",
          details: `${previous.toUpperCase()} → ${next.toUpperCase()}`,
        }),
      }).catch(() => undefined);
      return next;
    });
  }, []);

  const value = useMemo<ModeContextValue>(
    () => ({
      mode,
      live: mode === "live",
      setMode,
    }),
    [mode, setMode],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useAppMode() {
  return useContext(ModeContext);
}
