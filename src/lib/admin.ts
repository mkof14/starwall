export type Heartbeat = {
  status: "idle" | "ok" | "fail";
  at: string | null;
  host: string | null;
  helm: boolean | null;
  region: string | null;
};

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

export function clockStamp() {
  return new Date().toISOString().slice(11, 19);
}
