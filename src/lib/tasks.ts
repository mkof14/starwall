export type TaskGroup = "backend" | "site";

export type TaskId =
  | "health"
  | "equipment"
  | "access"
  | "blackbox"
  | "integrations"
  | "audit"
  | "overview"
  | "how"
  | "bridge"
  | "connections"
  | "levels"
  | "pricing"
  | "technology"
  | "faq"
  | "containers"
  | "about"
  | "contact";

export type TaskDef = {
  id: TaskId;
  group: TaskGroup;
  href: string;
  gated: boolean;
};

export const TASKS: TaskDef[] = [
  { id: "health", group: "backend", href: "/backend#health", gated: true },
  { id: "equipment", group: "backend", href: "/backend#equipment", gated: true },
  { id: "access", group: "backend", href: "/backend#access", gated: true },
  { id: "blackbox", group: "backend", href: "/backend#blackbox", gated: true },
  { id: "integrations", group: "backend", href: "/backend#integrations", gated: true },
  { id: "audit", group: "backend", href: "/backend#audit", gated: true },
  { id: "overview", group: "site", href: "/", gated: false },
  { id: "how", group: "site", href: "/how-it-works", gated: false },
  { id: "bridge", group: "site", href: "/interface", gated: true },
  { id: "connections", group: "site", href: "/interface/connections", gated: true },
  { id: "levels", group: "site", href: "/levels", gated: false },
  { id: "pricing", group: "site", href: "/pricing", gated: false },
  { id: "technology", group: "site", href: "/technology", gated: false },
  { id: "faq", group: "site", href: "/faq", gated: false },
  { id: "containers", group: "site", href: "/containers", gated: false },
  { id: "about", group: "site", href: "/about", gated: false },
  { id: "contact", group: "site", href: "/contact", gated: false },
];

export const TASK_GROUPS: TaskGroup[] = ["backend", "site"];
