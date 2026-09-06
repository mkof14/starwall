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
import type { BlackBoxRecord, BlackBoxType, StorageLocation } from "@/lib/black-box-types";
import { useBridgeSession } from "@/lib/bridge-session";
import { syncBlackBoxToCloud } from "@/lib/cloud-sync";
import { DEMO_CLEARED_EVENT } from "@/lib/demo-storage";
import { listBlackBox, markBlackBoxLocation, putBlackBox } from "@/lib/local-db";
import { MODE_KEY, useAppMode } from "@/lib/mode";

export type { BlackBoxRecord, BlackBoxType, StorageLocation };

type BlackBoxContextValue = {
  records: BlackBoxRecord[];
  ready: boolean;
  recordConversation: (input: { summary: string; fullContent: string }) => void;
  recordScenario: (input: { summary: string; fullContent: string }) => void;
};

const BlackBoxContext = createContext<BlackBoxContextValue>({
  records: [],
  ready: false,
  recordConversation: () => {},
  recordScenario: () => {},
});

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `bb-${crypto.randomUUID()}`;
  }
  return `bb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function stamp() {
  return new Date().toISOString();
}

export function BlackBoxProvider({ children }: { children: ReactNode }) {
  const { vessel } = useBridgeSession();
  const { live } = useAppMode();
  const [records, setRecords] = useState<BlackBoxRecord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void listBlackBox()
      .then((rows) => {
        if (cancelled) return;
        if (window.localStorage.getItem(MODE_KEY) === "live") {
          setRecords([]);
          return;
        }
        setRecords(rows);
      })
      .catch(() => {
        if (!cancelled) setRecords([]);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (live) setRecords([]);
  }, [live]);

  useEffect(() => {
    function onCleared() {
      setRecords([]);
    }
    window.addEventListener(DEMO_CLEARED_EVENT, onCleared);
    return () => window.removeEventListener(DEMO_CLEARED_EVENT, onCleared);
  }, []);

  const persistAndSync = useCallback(
    (record: BlackBoxRecord) => {
      void putBlackBox(record).catch(() => undefined);
      void syncBlackBoxToCloud(record, vessel || (live ? "Unconnected deployment" : "M/Y AURELIA")).then(
        (result) => {
          if (!result.ok) return;
          setRecords((current) =>
            current.map((item) =>
              item.id === record.id ? { ...item, storageLocation: "both" } : item,
            ),
          );
          void markBlackBoxLocation(record.id, "both").catch(() => undefined);
        },
      );
    },
    [live, vessel],
  );

  const append = useCallback(
    (type: BlackBoxType, input: { summary: string; fullContent: string }) => {
      const record: BlackBoxRecord = {
        id: newId(),
        timestamp: stamp(),
        type,
        summary: input.summary,
        fullContent: input.fullContent,
        storageLocation: "local",
        pdfEnabled: true,
      };
      setRecords((current) => [record, ...current]);
      persistAndSync(record);
    },
    [persistAndSync],
  );

  const recordConversation = useCallback(
    (input: { summary: string; fullContent: string }) => {
      append("conversation", input);
    },
    [append],
  );

  const recordScenario = useCallback(
    (input: { summary: string; fullContent: string }) => {
      append("scenario", input);
    },
    [append],
  );

  const value = useMemo(
    () => ({ records, ready, recordConversation, recordScenario }),
    [records, ready, recordConversation, recordScenario],
  );

  return (
    <BlackBoxContext.Provider value={value}>{children}</BlackBoxContext.Provider>
  );
}

export function useBlackBox() {
  return useContext(BlackBoxContext);
}
