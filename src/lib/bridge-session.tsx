"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type BridgeSessionValue = {
  scenarioName: string;
  riskLevel: string;
  vessel: string;
};

type BridgeSessionContextValue = BridgeSessionValue & {
  setSession: (next: Partial<BridgeSessionValue>) => void;
};

const DEFAULT_SESSION: BridgeSessionValue = {
  scenarioName: "Normal watch",
  riskLevel: "NORMAL",
  vessel: "M/Y AURELIA",
};

const BridgeSessionContext = createContext<BridgeSessionContextValue>({
  ...DEFAULT_SESSION,
  setSession: () => {},
});

export function BridgeSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<BridgeSessionValue>(DEFAULT_SESSION);
  const setSession = useCallback((next: Partial<BridgeSessionValue>) => {
    setSessionState((current) => ({ ...current, ...next }));
  }, []);
  const value = useMemo(
    () => ({ ...session, setSession }),
    [session, setSession],
  );
  return (
    <BridgeSessionContext.Provider value={value}>
      {children}
    </BridgeSessionContext.Provider>
  );
}

export function useBridgeSession() {
  return useContext(BridgeSessionContext);
}
