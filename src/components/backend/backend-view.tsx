"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/cn";
import { EQUIPMENT } from "@/lib/equipment";
import { useAppMode } from "@/lib/mode";

const SECTIONS = [
  { id: "health", label: "System Health" },
  { id: "equipment", label: "Equipment" },
  { id: "access", label: "Access Control" },
  { id: "blackbox", label: "Black Box" },
  { id: "integrations", label: "Integrations" },
  { id: "audit", label: "Audit Log" },
] as const;

const ROLES = [
  {
    name: "Super Admin",
    detail: "Full system plus user management.",
  },
  {
    name: "Admin",
    detail: "Configure equipment and view all data.",
  },
  {
    name: "Operator",
    detail: "Day-to-day monitoring and scenario response.",
  },
  {
    name: "Viewer",
    detail: "Read-only access to reports.",
  },
] as const;

const USERS = [
  { name: "Elena Voss", role: "Super Admin", last: "4 min ago" },
  { name: "Marcus Hale", role: "Admin", last: "22 min ago" },
  { name: "Priya Nair", role: "Operator", last: "1 hour ago" },
  { name: "Kenji Sato", role: "Viewer", last: "Yesterday" },
] as const;

const INTEGRATIONS = [
  { name: "Radar", note: "Vendor-agnostic, via adapter", last: "3s ago" },
  { name: "AIS", note: "NMEA / standard feed", last: "3s ago" },
  { name: "Camera systems", note: "ONVIF / RTSP adapters", last: "8s ago" },
  { name: "Satcom provider", note: "Primary + backup path", last: "12s ago" },
] as const;

const AUDIT = [
  "Admin user updated equipment threshold settings",
  "New Operator account created",
  "System diagnostic run manually",
  "Cloud backup sync verified after restore drill",
  "Viewer access granted for a weekly report pack",
] as const;

const EXTRA_EQUIPMENT = [
  { id: "hull", name: "AGRON Container Unit — Hull Sensor Array" },
  { id: "power", name: "AGRON Container Unit — Power System" },
] as const;

type EquipStatus = "OK" | "Warning" | "Fail";
type ScanState = "idle" | "scanning" | "done";

function nowClock() {
  return new Date().toISOString().slice(11, 19);
}

function relativeLabel(seconds: number) {
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
}

function statusDot(status: EquipStatus) {
  if (status === "OK") return "bg-ok";
  if (status === "Warning") return "bg-attn";
  return "bg-crit";
}

export function BackendView() {
  const { live } = useAppMode();
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("health");
  const [online, setOnline] = useState(true);
  const [syncedFor, setSyncedFor] = useState(12);
  const [checks, setChecks] = useState<Record<string, { status: EquipStatus; time: string; scan: ScanState }>>(
    () => {
      const rows = [...EQUIPMENT, ...EXTRA_EQUIPMENT];
      const initial: Record<string, { status: EquipStatus; time: string; scan: ScanState }> = {};
      rows.forEach((item, index) => {
        initial[item.id] = {
          status: index === 4 ? "Warning" : "OK",
          time: index === 4 ? "15:41:08" : "16:02:11",
          scan: "idle",
        };
      });
      return initial;
    },
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
    }, 1000);
    return () => window.clearInterval(timer);
  }, [live]);

  function runDiagnostic(id: string) {
    setChecks((current) => ({
      ...current,
      [id]: { ...current[id], scan: "scanning" },
    }));
    window.setTimeout(() => {
      setChecks((current) => ({
        ...current,
        [id]: { status: "OK", time: nowClock(), scan: "done" },
      }));
    }, 1600);
  }

  const equipmentRows = [...EQUIPMENT, ...EXTRA_EQUIPMENT];

  return (
    <div className="min-h-screen bg-bridge-bg font-ui text-bridge-text" dir="ltr" lang="en">
      {live ? <LiveModeBanner /> : null}
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {live ? null : (
        <p className="border border-attn/40 bg-attn/10 px-3 py-2 font-mono text-[11px] text-attn">
          Illustrative system administration view — demonstrates the operational
          layer&apos;s structure and capabilities, not a live production admin
          panel.
        </p>
        )}
        <header className={live ? "mt-2" : "mt-6"}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="font-mono text-[10px] tracking-[0.24em] text-bridge-dim">
              STARWALL BACKEND
            </p>
            <ModeToggle />
          </div>
          <h1 className="mt-1 font-ui text-3xl font-bold tracking-wide">
            System administration
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bridge-dim">
            Connectivity, equipment health, access control, and monitoring —
            including AGRON Container hardware. Denser than the Bridge: built
            for administrators, not a glance watch.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[13rem_1fr]">
          <nav
            aria-label="Backend sections"
            className="flex flex-wrap gap-2 lg:flex-col"
          >
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "border px-3 py-2 text-start font-mono text-[11px] tracking-wider",
                  section === item.id
                    ? "border-orange bg-orange/10 text-orange"
                    : "border-bridge-line text-bridge-dim hover:text-bridge-text",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-4">
            {section === "health" ? (
              <HudPanel testId="backend-health" title="SYSTEM HEALTH & CONNECTIVITY">
                <ul className="space-y-3 font-mono text-xs">
                  <li className="flex items-center justify-between gap-3">
                    <span>Internet / Satellite link</span>
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
                            {online ? "Connected" : "Offline"}
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
                          <span className="text-ok">Online</span>
                        </>
                      )}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Local network</span>
                    {live ? (
                      <span className="text-bridge-dim">Not reported</span>
                    ) : (
                    <span className="flex items-center gap-2 text-ok">
                      <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                      Online
                    </span>
                    )}
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Cloud backup sync</span>
                    {live ? (
                      <span className="text-bridge-dim">
                        not yet configured for this deployment
                      </span>
                    ) : (
                    <span className="text-ok">
                      Online · Last synced: {relativeLabel(syncedFor)}
                    </span>
                    )}
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Local backup</span>
                    {live ? (
                      <span className="text-bridge-dim">not yet configured</span>
                    ) : (
                    <span className="flex items-center gap-2 text-ok">
                      <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                      Online
                    </span>
                    )}
                  </li>
                </ul>

                {live ? (
                  <p className="mt-6 font-mono text-[11px] text-bridge-dim">
                    No sensor path yet — waiting for equipment installation.
                  </p>
                ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <FlowCard
                    title="CLOUD PATH"
                    steps={["Sensors", "StarWall Core", "Cloud Storage"]}
                  />
                  <FlowCard
                    title="LOCAL PATH"
                    steps={["Sensors", "StarWall Core", "Local Storage"]}
                  />
                </div>
                )}
              </HudPanel>
            ) : null}

            {section === "equipment" ? (
              <HudPanel testId="backend-equipment" title="EQUIPMENT MONITORING">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-start font-mono text-xs">
                    <thead className="text-bridge-dim">
                      <tr className="border-b border-bridge-line">
                        <th className="py-2 pe-3 font-medium">Equipment</th>
                        <th className="py-2 pe-3 font-medium">Status</th>
                        <th className="py-2 pe-3 font-medium">Last self-check</th>
                        <th className="py-2 font-medium">Diagnostic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentRows.map((item) => {
                        const row = checks[item.id];
                        return (
                          <tr key={item.id} className="border-b border-bridge-line/60">
                            <td className="py-2.5 pe-3 text-bridge-text">{item.name}</td>
                            <td className="py-2.5 pe-3">
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    live ? "bg-bridge-dim" : statusDot(row.status),
                                  )}
                                />
                                {live
                                  ? "Not connected — awaiting installation"
                                  : row.status}
                              </span>
                            </td>
                            <td className="py-2.5 pe-3 text-bridge-dim">
                              {live ? "—" : row.time}
                            </td>
                            <td className="py-2.5">
                              <button
                                type="button"
                                data-testid={`diagnostic-${item.id}`}
                                disabled={live || row.scan === "scanning"}
                                title={
                                  live
                                    ? "No equipment to diagnose yet."
                                    : undefined
                                }
                                onClick={() => runDiagnostic(item.id)}
                                className="border border-bridge-line px-2 py-1 text-[11px] hover:border-orange disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {row.scan === "scanning"
                                  ? "Scanning..."
                                  : row.scan === "done"
                                    ? `OK — ${row.time}`
                                    : "Run diagnostic"}
                              </button>
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
              <HudPanel testId="backend-access" title="ACCESS CONTROL">
                <p className="mb-4 font-mono text-[10px] tracking-wider text-bridge-dim">
                  ROLE HIERARCHY
                </p>
                <ol className="space-y-2">
                  {ROLES.map((role, index) => (
                    <li
                      key={role.name}
                      className="border border-bridge-line bg-bridge-bg px-3 py-2"
                      style={{ marginInlineStart: `${index * 12}px` }}
                    >
                      <p className="font-ui text-sm font-semibold">{role.name}</p>
                      <p className="mt-0.5 text-xs text-bridge-dim">{role.detail}</p>
                    </li>
                  ))}
                </ol>
                {live ? (
                  <p className="mt-6 font-mono text-xs text-bridge-dim">
                    No user accounts provisioned yet.
                  </p>
                ) : (
                <>
                <p className="mb-2 mt-6 font-mono text-[10px] tracking-wider text-bridge-dim">
                  ILLUSTRATIVE ACCOUNTS — FICTIONAL NAMES
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[28rem] font-mono text-xs">
                    <thead className="text-bridge-dim">
                      <tr className="border-b border-bridge-line">
                        <th className="py-2 pe-3 text-start font-medium">Name</th>
                        <th className="py-2 pe-3 text-start font-medium">Role</th>
                        <th className="py-2 text-start font-medium">Last active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {USERS.map((user) => (
                        <tr key={user.name} className="border-b border-bridge-line/60">
                          <td className="py-2 pe-3">{user.name}</td>
                          <td className="py-2 pe-3">{user.role}</td>
                          <td className="py-2 text-bridge-dim">{user.last}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </>
                )}
              </HudPanel>
            ) : null}

            {section === "blackbox" ? (
              <HudPanel testId="backend-blackbox" title="BLACK BOX">
                <p className="text-sm leading-relaxed text-bridge-dim">
                  {live
                    ? "No records yet."
                    : "Session records — assistant conversations and scenario runs — are written on the Bridge and retained locally, then synced to cloud storage. Open the live log on the captain console; this page does not duplicate the recorder."}
                </p>
                <Link
                  href="/interface#black-box-panel"
                  className="mt-4 inline-block border border-orange px-3 py-2 font-ui text-xs font-medium text-orange hover:bg-orange/10"
                >
                  View full Black Box log →
                </Link>
              </HudPanel>
            ) : null}

            {section === "integrations" ? (
              <HudPanel testId="backend-integrations" title="INTEGRATIONS REGISTRY">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[32rem] font-mono text-xs">
                    <thead className="text-bridge-dim">
                      <tr className="border-b border-bridge-line">
                        <th className="py-2 pe-3 text-start font-medium">Integration</th>
                        <th className="py-2 pe-3 text-start font-medium">Notes</th>
                        <th className="py-2 pe-3 text-start font-medium">Status</th>
                        <th className="py-2 text-start font-medium">Last data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INTEGRATIONS.map((item) => (
                        <tr key={item.name} className="border-b border-bridge-line/60">
                          <td className="py-2.5 pe-3">{item.name}</td>
                          <td className="py-2.5 pe-3 text-bridge-dim">{item.note}</td>
                          <td className="py-2.5 pe-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-2",
                                live ? "text-bridge-dim" : "text-ok",
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  live ? "bg-bridge-dim" : "bg-ok",
                                )}
                              />
                              {live ? "Not integrated" : "Online"}
                            </span>
                          </td>
                          <td className="py-2.5 text-bridge-dim">
                            {live ? "—" : item.last}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </HudPanel>
            ) : null}

            {section === "audit" ? (
              <HudPanel testId="backend-audit" title="AUDIT LOG">
                <p className="mb-3 font-mono text-[10px] text-bridge-dim">
                  Administrative actions — distinct from the Bridge Event Log.
                </p>
                {live ? (
                  <p className="font-mono text-xs text-bridge-dim">
                    No administrative actions recorded yet.
                  </p>
                ) : (
                <ul className="space-y-2 font-mono text-xs">
                  {AUDIT.map((line, index) => (
                    <li
                      key={line}
                      className="grid grid-cols-[auto_1fr] gap-3 border-b border-bridge-line/50 pb-2"
                    >
                      <span className="text-bridge-dim">
                        16:0{index}:{String(12 + index * 7).padStart(2, "0")}
                      </span>
                      <span>{line}</span>
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
          <div key={step} className="flex min-w-0 flex-1 items-center gap-1">
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
