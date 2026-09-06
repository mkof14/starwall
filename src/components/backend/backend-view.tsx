"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { NotifyPanel } from "@/components/backend/notify-panel";
import { ObjectsPanel } from "@/components/backend/objects-panel";
import { PlanPanel } from "@/components/backend/plan-panel";
import { EventToasts, type EventToast } from "@/components/bridge/event-toasts";
import { HudPanel } from "@/components/bridge/hud-panel";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { ModeToggle } from "@/components/mode-toggle";
import { clockStamp, getAdminHeartbeat, postAdmin, type Heartbeat } from "@/lib/admin";
import { useAuthSession } from "@/lib/auth-session";
import { useBlackBox } from "@/lib/black-box";
import { cn } from "@/lib/cn";
import type { EquipmentStatus } from "@/lib/equipment";
import { usePreferences } from "@/lib/i18n/context";
import { useAppMode } from "@/lib/mode";
import {
  canManageUsers,
  canWriteSettings,
  USER_ROLES,
  type UserRole,
} from "@/lib/rbac";

const SECTIONS = [
  "health",
  "equipment",
  "access",
  "blackbox",
  "integrations",
  "audit",
  "plan",
  "objects",
  "notify",
] as const;

type SectionId = (typeof SECTIONS)[number];

type EquipmentItem = {
  id: string;
  name: string;
  category: string;
  lastCheckAt: string | null;
  status: EquipmentStatus;
  addedAt: string;
};

type IntegrationItem = {
  id: string;
  name: string;
  vendor: string;
  lastPingAt: string | null;
  status: "connected" | "stale" | "disconnected";
};

type AuditItem = {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  userName: string;
  userEmail: string;
};

function isSectionId(value: string | null | undefined): value is SectionId {
  return Boolean(value && (SECTIONS as readonly string[]).includes(value));
}

function sectionFromLocation(): SectionId {
  if (typeof window === "undefined") return "health";
  const hash = window.location.hash.replace(/^#/, "");
  if (isSectionId(hash)) return hash;
  const query = new URLSearchParams(window.location.search).get("section");
  if (isSectionId(query)) return query;
  return "health";
}

function statusDot(status: EquipmentStatus) {
  if (status === "ok") return "bg-ok";
  if (status === "warning") return "bg-attn";
  return "bg-crit";
}

function formatCheckTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toISOString().slice(11, 19);
}

export function BackendView() {
  const { live } = useAppMode();
  const { t } = usePreferences();
  const { records } = useBlackBox();
  const { session } = useAuthSession();
  const copy = t.backend;
  const role = session?.role ?? "Operator";
  const writeSettings = canWriteSettings(role);
  const manageUsers = canManageUsers(role);

  const [section, setSection] = useState<SectionId>("health");
  const [online, setOnline] = useState(true);
  const [syncedFor, setSyncedFor] = useState(12);
  const [localFor, setLocalFor] = useState(40);
  const [cloudBusy, setCloudBusy] = useState(false);
  const [localBusy, setLocalBusy] = useState(false);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [audit, setAudit] = useState<AuditItem[]>([]);
  const [toasts, setToasts] = useState<EventToast[]>([]);
  const [heartbeat, setHeartbeat] = useState<Heartbeat>({
    status: "idle",
    at: null,
    host: null,
    helm: null,
    region: null,
  });

  const sectionLabels: Record<SectionId, string> = {
    health: copy.health,
    equipment: copy.equipment,
    access: copy.access,
    blackbox: copy.blackbox,
    integrations: copy.integrations,
    audit: copy.audit,
    plan: copy.plan,
    objects: copy.objects,
    notify: copy.notify,
  };

  const roleDetails: Record<UserRole, { name: string; detail: string }> = {
    "Super Admin": { name: copy.roleSuper, detail: copy.roleSuperDetail },
    Admin: { name: copy.roleAdmin, detail: copy.roleAdminDetail },
    Operator: { name: copy.roleOperator, detail: copy.roleOperatorDetail },
    Viewer: { name: copy.roleViewer, detail: copy.roleViewerDetail },
  };

  const loadAudit = useCallback(async () => {
    const response = await fetch("/api/audit", { cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as { entries?: AuditItem[] };
    setAudit(payload.entries ?? []);
  }, []);

  const pushToast = useCallback((text: string, level: EventToast["level"] = "ATTENTION") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast: EventToast = {
      id,
      time: clockStamp(),
      level,
      text,
      kind: "fault",
    };
    setToasts((current) => [toast, ...current].slice(0, 4));
  }, []);

  const applyEquipment = useCallback(
    (rows: EquipmentItem[], changed: EquipmentItem[] = []) => {
      setEquipment(rows);
      for (const item of changed) {
        if (item.status === "warning" || item.status === "fail") {
          pushToast(`${item.name}: ${item.status}`, item.status === "fail" ? "CRITICAL" : "ATTENTION");
        }
      }
    },
    [pushToast],
  );

  useEffect(() => {
    setSection(sectionFromLocation());
    function onHash() {
      setSection(sectionFromLocation());
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function selectSection(item: SectionId) {
    setSection(item);
    const url = new URL(window.location.href);
    url.searchParams.delete("section");
    url.hash = item;
    window.history.replaceState(null, "", `${url.pathname}${url.search}#${item}`);
  }

  useEffect(() => {
    setOnline(navigator.onLine);
    function goOnline() {
      setOnline(true);
    }
    function goOffline() {
      setOnline(false);
    }
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    if (live) return;
    const timer = window.setInterval(() => {
      setSyncedFor((value) => value + 1);
      setLocalFor((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [live]);

  useEffect(() => {
    let cancelled = false;
    void getAdminHeartbeat()
      .then((payload) => {
        if (cancelled) return;
        setHeartbeat({
          status: "ok",
          at: payload.at,
          host: payload.host,
          helm: payload.helm,
          region: payload.region,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setHeartbeat({
          status: "fail",
          at: null,
          host: null,
          helm: null,
          region: null,
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [equipRes, integRes] = await Promise.all([
        fetch("/api/equipment", { cache: "no-store" }),
        fetch("/api/integrations", { cache: "no-store" }),
      ]);
      if (cancelled) return;
      if (equipRes.ok) {
        const payload = (await equipRes.json()) as { equipment?: EquipmentItem[] };
        setEquipment(payload.equipment ?? []);
      }
      if (integRes.ok) {
        const payload = (await integRes.json()) as { integrations?: IntegrationItem[] };
        setIntegrations(payload.integrations ?? []);
      }
      await loadAudit();
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [loadAudit]);

  useEffect(() => {
    if (live) return;
    async function tick() {
      const [equipRes, integRes] = await Promise.all([
        fetch("/api/equipment/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: "interval" }),
        }),
        fetch("/api/integrations/ping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }),
      ]);
      if (equipRes.ok) {
        const payload = (await equipRes.json()) as {
          equipment?: EquipmentItem[];
          changed?: EquipmentItem[];
        };
        applyEquipment(payload.equipment ?? [], payload.changed ?? []);
      }
      if (integRes.ok) {
        const payload = (await integRes.json()) as { integrations?: IntegrationItem[] };
        setIntegrations(payload.integrations ?? []);
      }
      await loadAudit();
    }
    void tick();
    const timer = window.setInterval(() => {
      void tick();
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [live, applyEquipment, loadAudit]);

  function relativeLabel(seconds: number) {
    if (seconds < 5) return copy.justNow;
    if (seconds < 60) return `${seconds} ${copy.secondsAgo}`;
    const minutes = Math.floor(seconds / 60);
    return minutes === 1 ? copy.minuteAgo : `${minutes} ${copy.minutesAgo}`;
  }

  async function runBackup(kind: "cloud" | "local") {
    if (live) {
      try {
        await postAdmin("request-config", kind);
      } catch {
        /* keep the existing status */
      }
      return;
    }
    if (kind === "cloud") setCloudBusy(true);
    else setLocalBusy(true);
    try {
      await postAdmin(kind === "cloud" ? "cloud-backup" : "local-backup");
      window.setTimeout(() => {
        if (kind === "cloud") {
          setSyncedFor(0);
          setCloudBusy(false);
        } else {
          setLocalFor(0);
          setLocalBusy(false);
        }
      }, 1200);
    } catch {
      if (kind === "cloud") setCloudBusy(false);
      else setLocalBusy(false);
    }
  }

  async function runDiagnostic(id: string) {
    if (!writeSettings) return;
    setScanningId(id);
    const response = await fetch("/api/equipment/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setScanningId(null);
    if (response.status === 403) return;
    if (!response.ok) return;
    const payload = (await response.json()) as {
      equipment?: EquipmentItem[];
      changed?: EquipmentItem[];
    };
    applyEquipment(payload.equipment ?? [], payload.changed ?? []);
    await loadAudit();
  }

  async function acknowledgeWarning(id: string) {
    if (!writeSettings) return;
    const response = await fetch("/api/equipment/acknowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) return;
    const payload = (await response.json()) as { equipment?: EquipmentItem };
    if (payload.equipment) {
      setEquipment((current) =>
        current.map((item) => (item.id === payload.equipment?.id ? payload.equipment : item)),
      );
    }
    await loadAudit();
  }

  async function testIntegration(id: string) {
    setPingingId(id);
    const response = await fetch("/api/integrations/ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPingingId(null);
    if (!response.ok) return;
    const payload = (await response.json()) as { integrations?: IntegrationItem[] };
    setIntegrations(payload.integrations ?? []);
  }

  async function exportAudit() {
    const lines =
      audit.length === 0
        ? copy.noAudit
        : audit
            .map(
              (entry) =>
                `${entry.timestamp}  ${entry.userName} <${entry.userEmail}>  ${entry.action}  ${entry.details}`,
            )
            .join("\n");
    const blob = new Blob([`StarWall Backend audit\n${lines}\n`], {
      type: "text/plain",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `starwall-audit-${clockStamp().replaceAll(":", "")}.txt`;
    link.click();
    URL.revokeObjectURL(href);
  }

  return (
    <div className="min-h-screen bg-bridge-bg font-ui text-bridge-text" dir="ltr">
      <EventToasts
        toasts={toasts}
        onDismiss={(id) => setToasts((current) => current.filter((item) => item.id !== id))}
        onOpen={() => selectSection("equipment")}
      />
      {live ? <LiveModeBanner /> : null}
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {live ? null : (
          <p className="border border-attn/40 bg-attn/10 px-3 py-2 font-mono text-[11px] text-attn">
            {copy.demoNotice}
          </p>
        )}
        <header className={live ? "mt-2" : "mt-6"}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="font-mono text-[10px] tracking-[0.24em] text-bridge-dim">
              {copy.kicker}
            </p>
            <ModeToggle />
          </div>
          <h1 className="mt-1 font-ui text-3xl font-bold tracking-wide">
            {copy.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bridge-dim">{copy.lead}</p>
          <p
            data-testid="backend-role"
            className="mt-3 inline-flex border border-orange/50 bg-orange/10 px-2.5 py-1 font-mono text-[11px] tracking-wider text-orange"
          >
            {copy.signedInRole.replace("{role}", roleDetails[role].name)}
            {session?.email ? ` · ${session.email}` : ""}
          </p>
          {role === "Viewer" ? (
            <p className="mt-2 font-mono text-[11px] text-attn">{copy.viewerLocked}</p>
          ) : null}
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[13rem_1fr]">
          <nav
            aria-label={copy.sectionsNav}
            className="flex flex-wrap gap-2 lg:flex-col"
          >
            {SECTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectSection(item)}
                className={cn(
                  "border px-3 py-2 text-start font-mono text-[11px] tracking-wider",
                  section === item
                    ? "border-orange bg-orange/10 text-orange"
                    : "border-bridge-line text-bridge-dim hover:text-bridge-text",
                )}
              >
                {sectionLabels[item]}
              </button>
            ))}
            {manageUsers ? (
              <Link
                href="/backend/users"
                data-testid="backend-users-link"
                className="border border-orange/50 px-3 py-2 text-start font-mono text-[11px] tracking-wider text-orange hover:bg-orange/10"
              >
                {copy.users}
              </Link>
            ) : null}
            <Link
              href="/backend/privacy"
              data-testid="backend-privacy-link"
              className="border border-bridge-line px-3 py-2 text-start font-mono text-[11px] tracking-wider text-bridge-dim hover:text-bridge-text"
            >
              {copy.privacy}
            </Link>
          </nav>

          <div className="space-y-4">
            {section === "health" ? (
              <HudPanel testId="backend-health" title={copy.healthTitle}>
                <ul className="space-y-3 font-mono text-xs">
                  <li className="flex items-center justify-between gap-3">
                    <span>{copy.heartbeat}</span>
                    <span
                      className={cn(
                        heartbeat.status === "ok"
                          ? "text-ok"
                          : heartbeat.status === "fail"
                            ? "text-crit"
                            : "text-bridge-dim",
                      )}
                    >
                      {heartbeat.status === "ok"
                        ? `${copy.heartbeatOk}${heartbeat.region ? ` · ${heartbeat.region}` : ""}`
                        : heartbeat.status === "fail"
                          ? copy.heartbeatFail
                          : "…"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Helm</span>
                    <span
                      className={
                        heartbeat.helm === true
                          ? "text-ok"
                          : heartbeat.helm === false
                            ? "text-attn"
                            : "text-bridge-dim"
                      }
                    >
                      {heartbeat.helm === true
                        ? copy.helmReady
                        : heartbeat.helm === false
                          ? copy.helmMissing
                          : "…"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>{copy.internet}</span>
                    <span className="flex items-center gap-2">
                      {live ? (
                        <>
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              online ? "bg-ok" : "bg-bridge-dim",
                            )}
                          />
                          <span className={online ? "text-ok" : "text-bridge-dim"}>
                            {online ? copy.connected : copy.offline}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-end gap-0.5">
                            <span className="h-1.5 w-1 bg-ok" />
                            <span className="h-2.5 w-1 bg-ok" />
                            <span className="h-3.5 w-1 bg-ok" />
                            <span className="h-4 w-1 bg-ok/30" />
                          </span>
                          <span className="text-ok">{copy.online}</span>
                        </>
                      )}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>{copy.localNet}</span>
                    {live ? (
                      <span className="text-bridge-dim">{copy.notReported}</span>
                    ) : (
                      <span className="flex items-center gap-2 text-ok">
                        <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                        {copy.online}
                      </span>
                    )}
                  </li>
                  <li className="flex flex-wrap items-center justify-between gap-3">
                    <span>{copy.cloudBackup}</span>
                    {live ? (
                      <span className="flex items-center gap-2">
                        <span className="text-bridge-dim">
                          {copy.notConfiguredDeploy}
                        </span>
                        <button
                          type="button"
                          data-testid="cloud-backup"
                          onClick={() => void runBackup("cloud")}
                          className="border border-bridge-line px-2 py-1 text-[11px] hover:border-orange"
                        >
                          {copy.requestConfig}
                        </button>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="text-ok">
                          {copy.online} · {copy.lastSynced}:{" "}
                          {relativeLabel(syncedFor)}
                        </span>
                        <button
                          type="button"
                          data-testid="cloud-backup"
                          disabled={cloudBusy}
                          onClick={() => void runBackup("cloud")}
                          className="border border-bridge-line px-2 py-1 text-[11px] hover:border-orange disabled:opacity-60"
                        >
                          {cloudBusy ? copy.backingUp : copy.runCloudBackup}
                        </button>
                      </span>
                    )}
                  </li>
                  <li className="flex flex-wrap items-center justify-between gap-3">
                    <span>{copy.localBackup}</span>
                    {live ? (
                      <span className="flex items-center gap-2">
                        <span className="text-bridge-dim">
                          {copy.notConfigured}
                        </span>
                        <button
                          type="button"
                          data-testid="local-backup"
                          onClick={() => void runBackup("local")}
                          className="border border-bridge-line px-2 py-1 hover:border-orange"
                        >
                          {copy.requestConfig}
                        </button>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2 text-ok">
                          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                          {copy.online} · {relativeLabel(localFor)}
                        </span>
                        <button
                          type="button"
                          data-testid="local-backup"
                          disabled={localBusy}
                          onClick={() => void runBackup("local")}
                          className="border border-bridge-line px-2 py-1 text-[11px] hover:border-orange disabled:opacity-60"
                        >
                          {localBusy ? copy.backingUp : copy.runLocalBackup}
                        </button>
                      </span>
                    )}
                  </li>
                </ul>

                {live ? (
                  <p className="mt-6 font-mono text-[11px] text-bridge-dim">
                    {copy.noSensor}
                  </p>
                ) : (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <FlowCard
                      title={copy.cloudPath}
                      steps={[copy.sensors, copy.core, copy.cloudStorage]}
                    />
                    <FlowCard
                      title={copy.localPath}
                      steps={[copy.sensors, copy.core, copy.localStorageLabel]}
                    />
                  </div>
                )}

                <p className="mt-6">
                  <Link
                    href="/interface/connections"
                    data-testid="backend-connections-link"
                    className="font-mono text-[11px] text-orange hover:underline"
                  >
                    {copy.mapLink}
                  </Link>
                </p>
              </HudPanel>
            ) : null}

            {section === "equipment" ? (
              <HudPanel testId="backend-equipment" title={copy.equipmentTitle}>
                {!writeSettings ? (
                  <p className="mb-3 font-mono text-[11px] text-attn">
                    {copy.diagnosticLocked}
                  </p>
                ) : null}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-start font-mono text-xs">
                    <thead className="text-bridge-dim">
                      <tr className="border-b border-bridge-line">
                        <th className="py-2 pe-3 font-medium">
                          {copy.colEquipment}
                        </th>
                        <th className="py-2 pe-3 font-medium">
                          {copy.colStatus}
                        </th>
                        <th className="py-2 pe-3 font-medium">{copy.colCheck}</th>
                        <th className="py-2 font-medium">{copy.colDiagnostic}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipment.map((item) => (
                        <tr key={item.id} className="border-b border-bridge-line/60">
                          <td className="py-2.5 pe-3 text-bridge-text">{item.name}</td>
                          <td className="py-2.5 pe-3">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  live ? "bg-bridge-dim" : statusDot(item.status),
                                )}
                              />
                              {live ? copy.notConnected : item.status}
                            </span>
                          </td>
                          <td className="py-2.5 pe-3 text-bridge-dim">
                            {live ? "—" : formatCheckTime(item.lastCheckAt)}
                          </td>
                          <td className="py-2.5">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                data-testid={`diagnostic-${item.id}`}
                                disabled={live || !writeSettings || scanningId === item.id}
                                title={
                                  live
                                    ? copy.notConnected
                                    : writeSettings
                                      ? undefined
                                      : copy.diagnosticLocked
                                }
                                onClick={() => void runDiagnostic(item.id)}
                                className="border border-bridge-line px-2 py-1 text-[11px] hover:border-orange disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {scanningId === item.id ? copy.scanning : copy.runDiagnostic}
                              </button>
                              {!live && item.status === "warning" ? (
                                <button
                                  type="button"
                                  data-testid={`ack-${item.id}`}
                                  disabled={!writeSettings}
                                  onClick={() => void acknowledgeWarning(item.id)}
                                  className="border border-attn/50 px-2 py-1 text-[11px] text-attn hover:border-attn disabled:opacity-60"
                                >
                                  {copy.acknowledge}
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </HudPanel>
            ) : null}

            {section === "access" ? (
              <HudPanel testId="backend-access" title={copy.accessTitle}>
                <p className="mb-4 font-mono text-[10px] tracking-wider text-bridge-dim">
                  {copy.roleHierarchy}
                </p>
                <ol className="space-y-2">
                  {USER_ROLES.map((item, index) => (
                    <li
                      key={item}
                      className={cn(
                        "border bg-bridge-bg px-3 py-2",
                        item === role ? "border-orange" : "border-bridge-line",
                      )}
                      style={{ marginInlineStart: `${index * 12}px` }}
                    >
                      <p className="font-ui text-sm font-semibold">
                        {roleDetails[item].name}
                        {item === role ? (
                          <span className="ms-2 font-mono text-[10px] text-orange">
                            {copy.signedInRole.replace("{role}", roleDetails[item].name)}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-bridge-dim">
                        {roleDetails[item].detail}
                      </p>
                    </li>
                  ))}
                </ol>
                {manageUsers ? (
                  <p className="mt-6">
                    <Link
                      href="/backend/users"
                      className="font-mono text-[11px] text-orange hover:underline"
                    >
                      {copy.usersLink}
                    </Link>
                  </p>
                ) : (
                  <p className="mt-6 font-mono text-[11px] text-bridge-dim">
                    {copy.settingsLocked}
                  </p>
                )}
              </HudPanel>
            ) : null}

            {section === "blackbox" ? (
              <HudPanel testId="backend-blackbox" title={copy.blackboxTitle}>
                <p className="text-sm leading-relaxed text-bridge-dim">
                  {live ? copy.blackboxLeadLive : copy.blackboxLead}
                </p>
                {records.length === 0 ? (
                  <p className="mt-4 font-mono text-xs text-bridge-dim">
                    {copy.blackboxEmpty}
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2 font-mono text-xs">
                    {records.slice(0, 8).map((record) => (
                      <li
                        key={record.id}
                        className="border-b border-bridge-line/50 pb-2"
                      >
                        <p className="text-bridge-dim">
                          {record.timestamp.slice(11, 19)} ·{" "}
                          {record.type === "conversation"
                            ? copy.conversation
                            : copy.scenarioRun}
                        </p>
                        <p className="mt-0.5">{record.summary}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href="/interface#black-box-panel"
                  className="mt-4 inline-block border border-orange px-3 py-2 font-ui text-xs font-medium text-orange hover:bg-orange/10"
                >
                  {copy.blackboxOpen}
                </Link>
              </HudPanel>
            ) : null}

            {section === "integrations" ? (
              <HudPanel
                testId="backend-integrations"
                title={copy.integrationsTitle}
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] font-mono text-xs">
                    <thead className="text-bridge-dim">
                      <tr className="border-b border-bridge-line">
                        <th className="py-2 pe-3 text-start font-medium">
                          {copy.colIntegration}
                        </th>
                        <th className="py-2 pe-3 text-start font-medium">
                          {copy.colVendor}
                        </th>
                        <th className="py-2 pe-3 text-start font-medium">
                          {copy.colStatus}
                        </th>
                        <th className="py-2 pe-3 text-start font-medium">
                          {copy.colLastData}
                        </th>
                        <th className="py-2 text-start font-medium">
                          {copy.colActions}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {integrations.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-bridge-line/60"
                        >
                          <td className="py-2.5 pe-3">{item.name}</td>
                          <td className="py-2.5 pe-3 text-bridge-dim">
                            {item.vendor}
                          </td>
                          <td className="py-2.5 pe-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-2",
                                live
                                  ? "text-bridge-dim"
                                  : item.status === "connected"
                                    ? "text-ok"
                                    : item.status === "stale"
                                      ? "text-attn"
                                      : "text-bridge-dim",
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  live
                                    ? "bg-bridge-dim"
                                    : item.status === "connected"
                                      ? "bg-ok"
                                      : item.status === "stale"
                                        ? "bg-attn"
                                        : "bg-bridge-dim",
                                )}
                              />
                              {live
                                ? copy.notIntegrated
                                : item.status === "connected"
                                  ? copy.feedConnected
                                  : item.status === "stale"
                                    ? copy.feedStale
                                    : copy.feedDisconnected}
                            </span>
                          </td>
                          <td className="py-2.5 pe-3 text-bridge-dim">
                            {live ? "—" : formatCheckTime(item.lastPingAt)}
                          </td>
                          <td className="py-2.5">
                            <button
                              type="button"
                              data-testid={`test-${item.id}`}
                              disabled={live || pingingId === item.id}
                              onClick={() => void testIntegration(item.id)}
                              className="border border-bridge-line px-2 py-1 hover:border-orange disabled:opacity-60"
                            >
                              {pingingId === item.id ? copy.testing : copy.testConnection}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </HudPanel>
            ) : null}

            {section === "plan" ? <PlanPanel /> : null}
            {section === "objects" ? <ObjectsPanel /> : null}
            {section === "notify" ? <NotifyPanel canWrite={writeSettings && !live} /> : null}

            {section === "audit" ? (
              <HudPanel testId="backend-audit" title={copy.auditTitle}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[10px] text-bridge-dim">
                    {copy.auditLead}
                  </p>
                  <button
                    type="button"
                    data-testid="export-audit"
                    onClick={() => void exportAudit()}
                    className="border border-orange px-2 py-1 font-mono text-[11px] text-orange hover:bg-orange/10"
                  >
                    {copy.exportAudit}
                  </button>
                </div>
                {audit.length === 0 ? (
                  <p className="font-mono text-xs text-bridge-dim">
                    {copy.noAudit}
                  </p>
                ) : (
                  <ul className="space-y-2 font-mono text-xs">
                    {audit.map((entry) => (
                      <li
                        key={entry.id}
                        data-testid="audit-row"
                        className="grid gap-1 border-b border-bridge-line/50 pb-2 sm:grid-cols-[auto_1fr]"
                      >
                        <span className="text-bridge-dim">
                          {entry.timestamp.slice(11, 19)}
                        </span>
                        <span>
                          <span className="text-orange">{entry.userName}</span>
                          <span className="text-bridge-dim">
                            {" "}
                            &lt;{entry.userEmail}&gt;
                          </span>
                          <span className="ms-2">{entry.details}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </HudPanel>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowCard({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="border border-bridge-line bg-bridge-bg p-3">
      <p className="mb-3 font-mono text-[10px] tracking-wider text-bridge-dim">
        {title}
      </p>
      <div className="flex items-center gap-1">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex min-w-0 flex-1 items-center gap-1">
            <span className="flex-1 border border-bridge-line px-1.5 py-2 text-center font-mono text-[10px] leading-tight">
              {step}
            </span>
            {index < steps.length - 1 ? (
              <span className="relative h-0.5 w-6 shrink-0 bg-bridge-line">
                <span className="backend-flow-dot absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-ok" />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
