"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
  }, []);

  useEffect(() => {
    window.localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const value = useMemo<ModeContextValue>(
    () => ({
      mode,
      live: mode === "live",
      setMode: setModeState,
    }),
    [mode],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useAppMode() {
  return useContext(ModeContext);
}
