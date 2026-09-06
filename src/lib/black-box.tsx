"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type BlackBoxType = "conversation" | "scenario";
export type StorageLocation = "local" | "cloud" | "both";

export type BlackBoxRecord = {
  id: string;
  timestamp: string;
  type: BlackBoxType;
  summary: string;
  fullContent: string;
  storageLocation: StorageLocation;
  pdfEnabled: boolean;
};

type BlackBoxContextValue = {
  records: BlackBoxRecord[];
  recordConversation: (input: { summary: string; fullContent: string }) => void;
  recordScenario: (input: { summary: string; fullContent: string }) => void;
};

const BlackBoxContext = createContext<BlackBoxContextValue>({
  records: [],
  recordConversation: () => {},
  recordScenario: () => {},
});

function newId() {
  return `bb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function stamp() {
  return new Date().toISOString();
}

export function BlackBoxProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<BlackBoxRecord[]>([]);
  const syncTimers = useRef<number[]>([]);

  useEffect(() => {
    const timers = syncTimers.current;
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const append = useCallback((record: BlackBoxRecord) => {
    setRecords((current) => [record, ...current]);
  }, []);

  const recordConversation = useCallback(
    (input: { summary: string; fullContent: string }) => {
      append({
        id: newId(),
        timestamp: stamp(),
        type: "conversation",
        summary: input.summary,
        fullContent: input.fullContent,
        storageLocation: "both",
        pdfEnabled: true,
      });
    },
    [append],
  );

  const recordScenario = useCallback(
    (input: { summary: string; fullContent: string }) => {
      const id = newId();
      append({
        id,
        timestamp: stamp(),
        type: "scenario",
        summary: input.summary,
        fullContent: input.fullContent,
        storageLocation: "local",
        pdfEnabled: true,
      });
      const timer = window.setTimeout(() => {
        setRecords((current) =>
          current.map((item) =>
            item.id === id ? { ...item, storageLocation: "both" } : item,
          ),
        );
      }, 1400);
      syncTimers.current.push(timer);
    },
    [append],
  );

  const value = useMemo(
    () => ({ records, recordConversation, recordScenario }),
    [records, recordConversation, recordScenario],
  );

  return (
    <BlackBoxContext.Provider value={value}>{children}</BlackBoxContext.Provider>
  );
}

export function useBlackBox() {
  return useContext(BlackBoxContext);
}
