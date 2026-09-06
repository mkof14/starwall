"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ADMIN_ROLES,
  INTEGRATION_SEED,
  SEEDED_USERS,
  clockStamp,
  getAdminHeartbeat,
  newAdminId,
  postAdmin,
  type AdminIntegration,
  type AdminRole,
  type AdminUser,
  type AuditEntry,
  type EquipCheck,
  type EquipStatus,
  type Heartbeat,
} from "@/lib/admin";
import { useBlackBox } from "@/lib/black-box";
import { cn } from "@/lib/cn";
import { NotifyPanel } from "@/components/backend/notify-panel";
import { ObjectsPanel } from "@/components/backend/objects-panel";
import { PlanPanel } from "@/components/backend/plan-panel";
import { EQUIPMENT } from "@/lib/equipment";
import { usePreferences } from "@/lib/i18n/context";
import { useAppMode } from "@/lib/mode";

const EXTRA_EQUIPMENT = [
  { id: "hull", name: "AGRON Container Unit — Hull Sensor Array" },
  { id: "power", name: "AGRON Container Unit — Power System" },
] as const;

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

function statusDot(status: EquipStatus) {
  if (status === "OK") return "bg-ok";
  if (status === "Warning") return "bg-attn";
  return "bg-crit";
}

function initialChecks(): Record<string, EquipCheck> {
  const rows = [...EQUIPMENT, ...EXTRA_EQUIPMENT];
  const initial: Record<string, EquipCheck> = {};
  rows.forEach((item, index) => {
    initial[item.id] = {
      status: index === 4 ? "Warning" : "OK",
      time: index === 4 ? "15:41:08" : "16:02:11",
      scan: "idle",
      acknowledged: false,
    };
  });
  return initial;
}

export function BackendView() {
  const { live } = useAppMode();
  const { t } = usePreferences();
  const { records } = useBlackBox();
  const copy = t.backend;
  const [section, setSection] = useState<SectionId>("health");

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
  const [online, setOnline] = useState(true);
  const [syncedFor, setSyncedFor] = useState(12);
  const [localFor, setLocalFor] = useState(40);
  const [cloudBusy, setCloudBusy] = useState(false);
  const [localBusy, setLocalBusy] = useState(false);
  const [checks, setChecks] = useState(initialChecks);
  const [users, setUsers] = useState<AdminUser[]>(() => SEEDED_USERS);
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState<AdminRole>("Operator");
  const [integrations, setIntegrations] = useState<AdminIntegration[]>(
    () => INTEGRATION_SEED,
  );
  const [audit, setAudit] = useState<AuditEntry[]>([]);
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

  const roleDetails: Record<AdminRole, { name: string; detail: string }> = {
    "Super Admin": { name: copy.roleSuper, detail: copy.roleSuperDetail },
    Admin: { name: copy.roleAdmin, detail: copy.roleAdminDetail },
    Operator: { name: copy.roleOperator, detail: copy.roleOperatorDetail },
    Viewer: { name: copy.roleViewer, detail: copy.roleViewerDetail },
  };

  const visibleUsers = useMemo(
    () => (live ? users.filter((user) => !user.seeded) : users),
    [live, users],
  );

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

  function pushAudit(line: string) {
    setAudit((current) => [
      { id: newAdminId("aud"), at: clockStamp(), line },
      ...current,
    ]);
  }

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
        pushAudit(`${copy.requestConfig}: ${kind}`);
      } catch {
        pushAudit(`${copy.heartbeatFail}: ${kind}`);
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
        pushAudit(
          kind === "cloud"
            ? `${copy.backupDone} · cloud`
            : `${copy.backupDone} · local`,
        );
      }, 1200);
    } catch {
      if (kind === "cloud") setCloudBusy(false);
      else setLocalBusy(false);
      pushAudit(copy.heartbeatFail);
    }
  }

  function runDiagnostic(id: string, name: string) {
    setChecks((current) => ({
      ...current,
      [id]: { ...current[id], scan: "scanning" },
    }));
    void postAdmin("diagnostic", id)
      .then(() => {
        window.setTimeout(() => {
          const stamp = clockStamp();
          setChecks((current) => ({
            ...current,
            [id]: {
              status: "OK",
              time: stamp,
              scan: "done",
              acknowledged: true,
            },
          }));
          pushAudit(`${copy.runDiagnostic}: ${name}`);
        }, 1600);
      })
      .catch(() => {
        setChecks((current) => ({
          ...current,
          [id]: { ...current[id], scan: "idle" },
        }));
        pushAudit(`${copy.heartbeatFail}: ${name}`);
      });
  }

  function acknowledgeWarning(id: string, name: string) {
    void postAdmin("acknowledge", id).then(() => {
      setChecks((current) => ({
        ...current,
        [id]: { ...current[id], status: "OK", acknowledged: true },
      }));
      pushAudit(`${copy.acknowledged}: ${name}`);
    });
  }

  function addUser() {
    const name = draftName.trim();
    if (!name) return;
    void postAdmin("add-user", name).then(() => {
      setUsers((current) => [
        {
          id: newAdminId("usr"),
          name,
          role: draftRole,
          last: copy.justNow,
          enabled: true,
          seeded: false,
        },
        ...current,
      ]);
      setDraftName("");
      pushAudit(`${copy.addUser}: ${name} · ${draftRole}`);
    });
  }

  function setUserRole(id: string, role: AdminRole, name: string) {
    void postAdmin("set-role", `${id}:${role}`).then(() => {
      setUsers((current) =>
        current.map((user) => (user.id === id ? { ...user, role } : user)),
      );
      pushAudit(`${copy.colRole}: ${name} → ${role}`);
    });
  }

  function toggleUser(id: string, name: string, enabled: boolean) {
    void postAdmin("set-user-enabled", `${id}:${enabled ? "off" : "on"}`).then(
      () => {
        setUsers((current) =>
          current.map((user) =>
            user.id === id ? { ...user, enabled: !enabled } : user,
          ),
        );
        pushAudit(
          `${enabled ? copy.disable : copy.enable}: ${name}`,
        );
      },
    );
  }

  function testIntegration(id: string, name: string) {
    setIntegrations((current) =>
      current.map((item) =>
        item.id === id ? { ...item, testing: true } : item,
      ),
    );
    void postAdmin("test-integration", id)
      .then(() => {
        window.setTimeout(() => {
          setIntegrations((current) =>
            current.map((item) =>
              item.id === id
                ? { ...item, testing: false, last: clockStamp() }
                : item,
            ),
          );
          pushAudit(
            live
              ? `${copy.testFail}: ${name}`
              : `${copy.testOk}: ${name}`,
          );
        }, 900);
      })
      .catch(() => {
        setIntegrations((current) =>
          current.map((item) =>
            item.id === id ? { ...item, testing: false } : item,
          ),
        );
        pushAudit(`${copy.heartbeatFail}: ${name}`);
      });
  }

  function toggleIntegration(id: string, name: string, enabled: boolean) {
    void postAdmin("toggle-integration", id).then(() => {
      setIntegrations((current) =>
        current.map((item) =>
          item.id === id ? { ...item, enabled: !enabled } : item,
        ),
      );
      pushAudit(`${enabled ? copy.disableInt : copy.enableInt}: ${name}`);
    });
  }

  function exportAudit() {
    void postAdmin("export-audit").then(() => {
      const lines =
        audit.length === 0
          ? copy.noAudit
          : audit.map((entry) => `${entry.at}  ${entry.line}`).join("\n");
      const blob = new Blob([`StarWall Backend audit\n${lines}\n`], {
        type: "text/plain",
      });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `starwall-audit-${clockStamp().replaceAll(":", "")}.txt`;
      link.click();
      URL.revokeObjectURL(href);
      pushAudit(copy.exportAudit);
    });
  }

  const equipmentRows = [...EQUIPMENT, ...EXTRA_EQUIPMENT];

  return (
    <div className="min-h-screen bg-bridge-bg font-ui text-bridge-text" dir="ltr">
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
                          className="border border-bridge-line px-2 py-1 text-[11px] hover:border-orange"
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
                      {equipmentRows.map((item) => {
                        const row = checks[item.id];
                        return (
                          <tr
                            key={item.id}
                            className="border-b border-bridge-line/60"
                          >
                            <td className="py-2.5 pe-3 text-bridge-text">
                              {item.name}
                            </td>
                            <td className="py-2.5 pe-3">
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    live
                                      ? "bg-bridge-dim"
                                      : statusDot(row.status),
                                  )}
                                />
                                {live ? copy.notConnected : row.status}
                              </span>
                            </td>
                            <td className="py-2.5 pe-3 text-bridge-dim">
                              {live ? "—" : row.time}
                            </td>
                            <td className="py-2.5">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  data-testid={`diagnostic-${item.id}`}
                                  disabled={live || row.scan === "scanning"}
                                  title={
                                    live ? copy.notConnected : undefined
                                  }
                                  onClick={() =>
                                    runDiagnostic(item.id, item.name)
                                  }
                                  className="border border-bridge-line px-2 py-1 text-[11px] hover:border-orange disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {row.scan === "scanning"
                                    ? copy.scanning
                                    : row.scan === "done"
                                      ? `OK — ${row.time}`
                                      : copy.runDiagnostic}
                                </button>
                                {!live &&
                                row.status === "Warning" &&
                                !row.acknowledged ? (
                                  <button
                                    type="button"
                                    data-testid={`ack-${item.id}`}
                                    onClick={() =>
                                      acknowledgeWarning(item.id, item.name)
                                    }
                                    className="border border-attn/50 px-2 py-1 text-[11px] text-attn hover:border-attn"
                                  >
                                    {copy.acknowledge}
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
                  {ADMIN_ROLES.map((role, index) => (
                    <li
                      key={role}
                      className="border border-bridge-line bg-bridge-bg px-3 py-2"
                      style={{ marginInlineStart: `${index * 12}px` }}
                    >
                      <p className="font-ui text-sm font-semibold">
                        {roleDetails[role].name}
                      </p>
                      <p className="mt-0.5 text-xs text-bridge-dim">
                        {roleDetails[role].detail}
                      </p>
                    </li>
                  ))}
                </ol>
                <p className="mb-2 mt-6 font-mono text-[10px] tracking-wider text-bridge-dim">
                  {copy.accounts}
                </p>
                <form
                  className="mb-4 flex flex-wrap gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    addUser();
                  }}
                >
                  <input
                    data-testid="admin-user-name"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    placeholder={copy.userPlaceholder}
                    className="min-w-[10rem] flex-1 border border-bridge-line bg-bridge-bg px-2 py-1.5 font-ui text-sm outline-none focus:border-orange"
                  />
                  <select
                    data-testid="admin-user-role"
                    value={draftRole}
                    onChange={(event) =>
                      setDraftRole(event.target.value as AdminRole)
                    }
                    className="border border-bridge-line bg-bridge-bg px-2 py-1.5 font-mono text-xs outline-none focus:border-orange"
                  >
                    {ADMIN_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {roleDetails[role].name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    data-testid="admin-add-user"
                    className="border border-orange px-3 py-1.5 font-ui text-xs text-orange hover:bg-orange/10"
                  >
                    {copy.addUser}
                  </button>
                </form>
                {visibleUsers.length === 0 ? (
                  <p className="font-mono text-xs text-bridge-dim">
                    {copy.noUsers}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[32rem] font-mono text-xs">
                      <thead className="text-bridge-dim">
                        <tr className="border-b border-bridge-line">
                          <th className="py-2 pe-3 text-start font-medium">
                            {copy.colName}
                          </th>
                          <th className="py-2 pe-3 text-start font-medium">
                            {copy.colRole}
                          </th>
                          <th className="py-2 pe-3 text-start font-medium">
                            {copy.colLast}
                          </th>
                          <th className="py-2 text-start font-medium">
                            {copy.colActions}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-bridge-line/60"
                          >
                            <td className="py-2 pe-3">
                              {user.name}
                              {!user.enabled ? (
                                <span className="ms-2 text-attn">
                                  {copy.disabled}
                                </span>
                              ) : null}
                            </td>
                            <td className="py-2 pe-3">
                              <select
                                value={user.role}
                                onChange={(event) =>
                                  setUserRole(
                                    user.id,
                                    event.target.value as AdminRole,
                                    user.name,
                                  )
                                }
                                className="border border-bridge-line bg-bridge-bg px-1 py-0.5"
                              >
                                {ADMIN_ROLES.map((role) => (
                                  <option key={role} value={role}>
                                    {roleDetails[role].name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2 pe-3 text-bridge-dim">
                              {user.last}
                            </td>
                            <td className="py-2">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleUser(user.id, user.name, user.enabled)
                                }
                                className="border border-bridge-line px-2 py-1 hover:border-orange"
                              >
                                {user.enabled ? copy.disable : copy.enable}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                          {copy.colNotes}
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
                            {item.note}
                          </td>
                          <td className="py-2.5 pe-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-2",
                                live || !item.enabled
                                  ? "text-bridge-dim"
                                  : "text-ok",
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  live || !item.enabled
                                    ? "bg-bridge-dim"
                                    : "bg-ok",
                                )}
                              />
                              {live
                                ? copy.notIntegrated
                                : item.enabled
                                  ? copy.online
                                  : copy.disabled}
                            </span>
                          </td>
                          <td className="py-2.5 pe-3 text-bridge-dim">
                            {live ? "—" : item.last}
                          </td>
                          <td className="py-2.5">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                data-testid={`test-${item.id}`}
                                disabled={item.testing}
                                onClick={() =>
                                  testIntegration(item.id, item.name)
                                }
                                className="border border-bridge-line px-2 py-1 hover:border-orange disabled:opacity-60"
                              >
                                {item.testing
                                  ? copy.testing
                                  : copy.testConnection}
                              </button>
                              <button
                                type="button"
                                disabled={live}
                                onClick={() =>
                                  toggleIntegration(
                                    item.id,
                                    item.name,
                                    item.enabled,
                                  )
                                }
                                className="border border-bridge-line px-2 py-1 hover:border-orange disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {item.enabled
                                  ? copy.disableInt
                                  : copy.enableInt}
                              </button>
                            </div>
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
            {section === "notify" ? <NotifyPanel /> : null}

            {section === "audit" ? (
              <HudPanel testId="backend-audit" title={copy.auditTitle}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[10px] text-bridge-dim">
                    {copy.auditLead}
                  </p>
                  <button
                    type="button"
                    data-testid="export-audit"
                    onClick={exportAudit}
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
                        className="grid grid-cols-[auto_1fr] gap-3 border-b border-bridge-line/50 pb-2"
                      >
                        <span className="text-bridge-dim">{entry.at}</span>
                        <span>{entry.line}</span>
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
