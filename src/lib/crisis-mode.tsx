"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type CrisisModeContextValue = {
  crisis: boolean;
  setCrisis: (value: boolean) => void;
};

const CrisisModeContext = createContext<CrisisModeContextValue>({
  crisis: false,
  setCrisis: () => {},
});

export function CrisisModeProvider({ children }: { children: ReactNode }) {
  const [crisis, setCrisis] = useState(false);
  const value = useMemo(() => ({ crisis, setCrisis }), [crisis]);
  return (
    <CrisisModeContext.Provider value={value}>{children}</CrisisModeContext.Provider>
  );
}

export function useCrisisMode() {
  return useContext(CrisisModeContext);
}
