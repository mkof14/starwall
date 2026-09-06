import type { Messages } from "@/lib/i18n/messages";

export const navItems: Array<{ href: string; key: keyof Messages["nav"] }> = [
  { href: "/", key: "home" },
  { href: "/how-it-works", key: "howItWorks" },
  { href: "/interface", key: "interface" },
  { href: "/levels", key: "levels" },
  { href: "/pricing", key: "pricing" },
  { href: "/technology", key: "technology" },
  { href: "/faq", key: "faq" },
  { href: "/containers", key: "containers" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

export const adminNavItem = {
  href: "/backend",
  key: "backend",
} as const;

export const authNavItem = {
  href: "/login",
  key: "auth",
} as const;

export const tasksNavItem = {
  href: "/tasks",
  key: "tasks",
} as const;

/** Header chip: AUTH only. Tasks and Backend live in the footer. */
export const headerWorkItems = [authNavItem] as const;
export const footerWorkItems = [tasksNavItem, adminNavItem] as const;
