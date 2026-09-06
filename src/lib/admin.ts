export type AdminRole = "Super Admin" | "Admin" | "Operator" | "Viewer";

export type AdminUser = {
  id: string;
  name: string;
  role: AdminRole;
  last: string;
  enabled: boolean;
  seeded: boolean;
};

export type AdminIntegration = {
  id: string;
  name: string;
  note: string;
  last: string;
  enabled: boolean;
  testing: boolean;
};

export type AuditEntry = {
  id: string;
  at: string;
  line: string;
};

export type EquipStatus = "OK" | "Warning" | "Fail";
export type ScanState = "idle" | "scanning" | "done";

export type EquipCheck = {
  status: EquipStatus;
  time: string;
  scan: ScanState;
  acknowledged: boolean;
};

export type Heartbeat = {
  status: "idle" | "ok" | "fail";
  at: string | null;
  host: string | null;
  helm: boolean | null;
  region: string | null;
};

export const ADMIN_ROLES: AdminRole[] = [
  "Super Admin",
  "Admin",
  "Operator",
  "Viewer",
];

export const SEEDED_USERS: AdminUser[] = [
  {
    id: "u-elena",
    name: "Elena Voss",
    role: "Super Admin",
    last: "4 min ago",
    enabled: true,
    seeded: true,
  },
  {
    id: "u-marcus",
    name: "Marcus Hale",
    role: "Admin",
    last: "22 min ago",
    enabled: true,
    seeded: true,
  },
  {
    id: "u-priya",
    name: "Priya Nair",
    role: "Operator",
    last: "1 hour ago",
    enabled: true,
    seeded: true,
  },
  {
    id: "u-kenji",
    name: "Kenji Sato",
    role: "Viewer",
    last: "Yesterday",
    enabled: true,
    seeded: true,
  },
];

export const INTEGRATION_SEED: AdminIntegration[] = [
  {
    id: "radar",
    name: "Radar",
    note: "Vendor-agnostic, via adapter",
    last: "3s ago",
    enabled: true,
    testing: false,
  },
  {
    id: "ais",
    name: "AIS",
    note: "NMEA / standard feed",
    last: "3s ago",
    enabled: true,
    testing: false,
  },
  {
    id: "cameras",
    name: "Camera systems",
    note: "ONVIF / RTSP adapters",
    last: "8s ago",
    enabled: true,
    testing: false,
  },
  {
    id: "satcom",
    name: "Satcom provider",
    note: "Primary + backup path",
    last: "12s ago",
    enabled: true,
    testing: false,
  },
];

export function clockStamp() {
  return new Date().toISOString().slice(11, 19);
}

export function newAdminId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function postAdmin(action: string, target?: string) {
  const response = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, target: target ?? null }),
  });
  if (!response.ok) {
    throw new Error("Admin service rejected the action.");
  }
  return (await response.json()) as {
    ok: boolean;
    action: string;
    target: string | null;
    at: string;
  };
}

export async function getAdminHeartbeat() {
  const response = await fetch("/api/admin", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Admin service unreachable.");
  }
  return (await response.json()) as {
    ok: boolean;
    at: string;
    host: string;
    helm: boolean;
    region: string;
  };
}
