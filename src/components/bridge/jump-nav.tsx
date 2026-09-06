"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useAuthSession } from "@/lib/auth-session";
import { useCrisisMode } from "@/lib/crisis-mode";
import { HELM_STATE_EVENT, openHelm } from "@/lib/helm-events";
import { canUseHelm } from "@/lib/rbac";

type JumpKind = "scroll" | "helm" | "link";

type JumpItem = {
  id: string;
  label: string;
  kind: JumpKind;
  href?: string;
  targetId?: string;
  crisisOnly?: boolean;
  hideInCrisis?: boolean;
  icon: ReactNode;
};

const ICON = "h-4 w-4";

const ITEMS: JumpItem[] = [
  {
    id: "picture",
    label: "Situational Picture",
    kind: "scroll",
    targetId: "situational-picture",
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M8 1.2A6.8 6.8 0 1 0 14.8 8 6.8 6.8 0 0 0 8 1.2Zm0 1.4A5.4 5.4 0 1 1 2.6 8 5.4 5.4 0 0 1 8 2.6ZM8 4.2A3.8 3.8 0 1 0 11.8 8 3.8 3.8 0 0 0 8 4.2Zm.7 4.1 2.4 1.4-.7 1.2-2.8-1.6V5.4h1.4Z"
        />
      </svg>
    ),
  },
  {
    id: "risk",
    label: "Risk Level",
    kind: "scroll",
    targetId: "risk-level-panel",
    hideInCrisis: true,
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M8 1.3 2.4 3.4v4.3c0 3.5 2.3 5.8 5.6 7 3.3-1.2 5.6-3.5 5.6-7V3.4L8 1.3Zm0 1.6 4.2 1.5v3.3c0 2.5-1.6 4.3-4.2 5.4-2.6-1.1-4.2-2.9-4.2-5.4V4.4L8 2.9Z"
        />
      </svg>
    ),
  },
  {
    id: "systems",
    label: "Connected Systems",
    kind: "scroll",
    targetId: "connected-systems-panel",
    hideInCrisis: true,
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M7.3 1.2h1.4v3.1h-1.4V1.2ZM3.2 3.1l1 1 2.1-2.1-1-1-2.1 2.1Zm8.6 0 2.1-2.1-1-1-2.1 2.1 1 1ZM2.2 7.3v1.4h3.1V7.3H2.2Zm8.5 0v1.4h3.1V7.3h-3.1ZM8 6.1A1.9 1.9 0 1 0 9.9 8 1.9 1.9 0 0 0 8 6.1ZM4.4 11.4 3.2 14h1.6l.7-1.6H10l.8 1.6H12l-1.2-2.6H4.4Z"
        />
      </svg>
    ),
  },
  {
    id: "action",
    label: "Recommended Action",
    kind: "scroll",
    targetId: "recommended-action-panel",
    hideInCrisis: true,
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M8 1.2A4.6 4.6 0 0 0 3.4 5.8c0 2 1.1 3.3 2.2 4.3V12h4.8v-1.9c1.1-1 2.2-2.3 2.2-4.3A4.6 4.6 0 0 0 8 1.2Zm-1.4 12h2.8v1.2H6.6V13.2Z"
        />
      </svg>
    ),
  },
  {
    id: "library",
    label: "Scenario Library",
    kind: "scroll",
    targetId: "scenario-library",
    hideInCrisis: true,
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M2.2 2.2h11.6v2.2H2.2V2.2Zm1.2 3.4h9.2v2.2H3.4V5.6Zm1.2 3.4h6.8v2.2H4.6V9Zm1.2 3.4h4.4V14.6H5.8v-2.2Z"
        />
      </svg>
    ),
  },
  {
    id: "crisis",
    label: "Crisis Protocol",
    kind: "scroll",
    targetId: "crisis-protocol-panel",
    crisisOnly: true,
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M8 1.2 1.2 13.4h13.6L8 1.2Zm0 3.4.2 5.2H7.8L8 4.6Zm0 6.6c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9Z"
        />
      </svg>
    ),
  },
  {
    id: "log",
    label: "Event Log",
    kind: "scroll",
    targetId: "event-log-panel",
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M8 1.3A6.7 6.7 0 1 0 14.7 8 6.7 6.7 0 0 0 8 1.3ZM8 2.7A5.3 5.3 0 1 1 2.7 8 5.3 5.3 0 0 1 8 2.7Zm-.7 1.6h1.4v3.3l2.4 2.4-1 1L7.3 8.4V4.3Z"
        />
      </svg>
    ),
  },
  {
    id: "helm",
    label: "StarWall Assistant",
    kind: "helm",
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M8 1.5A2.2 2.2 0 0 0 5.8 3.7v3.1a2.2 2.2 0 1 0 4.4 0V3.7A2.2 2.2 0 0 0 8 1.5Zm-4 5.4a.7.7 0 0 0-1.4 0 5.4 5.4 0 0 0 4.7 5.3v1.6H6.1a.7.7 0 0 0 0 1.4h3.8a.7.7 0 0 0 0-1.4H8.7v-1.6A5.4 5.4 0 0 0 13.4 6.9a.7.7 0 0 0-1.4 0 4 4 0 0 1-8 0Z"
        />
      </svg>
    ),
  },
  {
    id: "blackbox",
    label: "Black Box",
    kind: "scroll",
    targetId: "black-box-panel",
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M2 2.4h12v3.1H2V2.4Zm0 4.3h12v7H2v-7Zm1.4 1.4v4.2h9.2V8.1H3.4Zm6.8 1.2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z"
        />
      </svg>
    ),
  },
  {
    id: "learning",
    label: "Adaptive Learning",
    kind: "scroll",
    targetId: "adaptive-learning-panel",
    hideInCrisis: true,
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M1.6 12.8 5.2 7.8l2.6 3 4.1-6.2 2.5 1.6-.8 1.2-1.5-1-3.5 5.3-2.6-3-3.2 4.4H1.6Z"
        />
      </svg>
    ),
  },
  {
    id: "map",
    label: "Connections Map",
    kind: "link",
    href: "/interface/connections",
    icon: (
      <svg viewBox="0 0 16 16" className={ICON} aria-hidden>
        <path
          fill="currentColor"
          d="M4.2 3.1a1.6 1.6 0 1 1 1.5 2.3H5.4L3.9 8.2h2.4a1.6 1.6 0 1 1 0 1.4H3.6l1.6 3.2h.3a1.6 1.6 0 1 1-1.3.7L2.2 9.3A1.6 1.6 0 0 1 4.2 3.1Zm7.6 0a1.6 1.6 0 0 1 2 2.4l1.8 3.4a1.6 1.6 0 1 1-1.2.7l-1.7-3.3h-.3L10.6 9.6h.2a1.6 1.6 0 1 1 0 1.4H10l1.6 3.1a1.6 1.6 0 1 1-1.3.7L8.4 11H7.8a1.6 1.6 0 1 1 0-1.4h.9L10.4 6H9.8a1.6 1.6 0 1 1 0-1.4h2Z"
        />
      </svg>
    ),
  },
];

function typingInField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function JumpNav() {
  const { crisis } = useCrisisMode();
  const { session } = useAuthSession();
  const helmAllowed = canUseHelm(session?.role);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState("picture");
  const expanded = pinned || hovered;
  const lockUntil = useRef(0);

  const visible = useMemo(
    () =>
      ITEMS.filter((item) => {
        if (item.crisisOnly && !crisis) return false;
        if (item.hideInCrisis && crisis) return false;
        if (item.kind === "helm" && !helmAllowed) return false;
        return true;
      }),
    [crisis, helmAllowed],
  );

  const numbered = useMemo(
    () =>
      visible
        .filter((item) => item.kind !== "link")
        .slice(0, 9)
        .map((item, index) => ({ item, key: String(index + 1) })),
    [visible],
  );

  const jump = useCallback((item: JumpItem) => {
    if (item.kind === "link" && item.href) return;
    if (item.kind === "helm") {
      lockUntil.current = Date.now() + 1200;
      openHelm();
      setActive(item.id);
      return;
    }
    const target = item.targetId ? document.getElementById(item.targetId) : null;
    if (!target) return;
    lockUntil.current = Date.now() + 1200;
    setActive(item.id);
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  useEffect(() => {
    function onHelm(event: Event) {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (detail?.open) setActive("helm");
    }
    window.addEventListener(HELM_STATE_EVENT, onHelm);
    return () => window.removeEventListener(HELM_STATE_EVENT, onHelm);
  }, []);

  useEffect(() => {
    const observed = visible
      .filter((item) => item.kind === "scroll" && item.targetId)
      .map((item) => ({
        item,
        el: document.getElementById(item.targetId ?? ""),
      }))
      .filter((row): row is { item: JumpItem; el: HTMLElement } => Boolean(row.el));

    if (!observed.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntil.current) return;
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const match = observed.find((row) => row.el === hit.target);
        if (match) setActive(match.item.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.1, 0.25, 0.5, 0.75] },
    );

    observed.forEach((row) => io.observe(row.el));
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (typingInField(event.target)) return;
      const found = numbered.find((row) => row.key === event.key);
      if (!found) return;
      event.preventDefault();
      jump(found.item);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump, numbered]);

  return (
    <aside
      data-testid="jump-nav"
      data-expanded={expanded ? "true" : "false"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "fixed bottom-0 left-0 top-16 z-30 flex flex-col border-r border-bridge-line bg-bridge-panel text-bridge-text",
        expanded ? "w-56" : "w-12",
      )}
    >
      <div className="flex h-10 items-center justify-between border-b border-bridge-line px-2">
        {expanded ? (
          <p className="font-mono text-[9px] tracking-[0.18em] text-bridge-dim">JUMP</p>
        ) : (
          <span className="sr-only">Section jump</span>
        )}
        <button
          type="button"
          data-testid="jump-nav-toggle"
          aria-expanded={expanded}
          aria-label={pinned ? "Collapse section jump" : "Pin section jump"}
          onClick={() => setPinned((value) => !value)}
          className="inline-flex h-7 w-7 items-center justify-center border border-bridge-line text-bridge-dim hover:border-orange hover:text-orange"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
            <path
              fill="currentColor"
              d={
                expanded
                  ? "M9.7 3.2 5 8l4.7 4.8 1.1-1.1L7.2 8l3.6-3.7-1.1-1.1Z"
                  : "M6.3 3.2 11 8 6.3 12.8 5.2 11.7 8.8 8 5.2 4.3l1.1-1.1Z"
              }
            />
          </svg>
        </button>
      </div>

      <nav aria-label="Bridge sections" className="flex-1 overflow-y-auto py-1">
        <ul>
          {visible.map((item) => {
            const key = numbered.find((row) => row.item.id === item.id)?.key;
            const current = active === item.id;
            const inner = (
              <>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center",
                    current ? "text-orange" : "text-bridge-text",
                  )}
                >
                  {item.icon}
                </span>
                {expanded ? (
                  <>
                    <span className="min-w-0 flex-1 truncate text-left font-ui text-xs">
                      {item.label}
                    </span>
                    {key ? (
                      <span className="font-mono text-[9px] text-bridge-dim">{key}</span>
                    ) : null}
                  </>
                ) : null}
              </>
            );
            const className = cn(
              "relative flex w-full items-center gap-2 px-2 py-1",
              current
                ? "border-l-2 border-orange bg-orange/10 text-orange"
                : "border-l-2 border-transparent text-bridge-text hover:bg-bridge-bg hover:text-orange",
            );

            if (item.kind === "link" && item.href) {
              return (
                <li key={item.id} className="group relative">
                  <Link
                    href={item.href}
                    title={item.label}
                    data-testid={`jump-${item.id}`}
                    className={className}
                  >
                    {inner}
                  </Link>
                  {!expanded ? (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute start-full top-1/2 z-40 ml-2 hidden -translate-y-1/2 whitespace-nowrap border border-bridge-line bg-navy px-2 py-1 font-ui text-[11px] text-sand group-hover:block"
                    >
                      {item.label}
                    </span>
                  ) : null}
                </li>
              );
            }

            return (
              <li key={item.id} className="group relative">
                <button
                  type="button"
                  title={item.label}
                  data-testid={`jump-${item.id}`}
                  aria-current={current ? "location" : undefined}
                  data-active={current ? "true" : "false"}
                  onClick={() => jump(item)}
                  className={className}
                >
                  {inner}
                </button>
                {!expanded ? (
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute start-full top-1/2 z-40 ml-2 hidden -translate-y-1/2 whitespace-nowrap border border-bridge-line bg-navy px-2 py-1 font-ui text-[11px] text-sand group-hover:block"
                  >
                    {item.label}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
