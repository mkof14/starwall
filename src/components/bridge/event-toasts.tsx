"use client";

import { cn } from "@/lib/cn";
import type { RiskLevel } from "@/lib/scenarios";

export type ToastKind =
  | "watch"
  | "scenario"
  | "auto"
  | "crisis"
  | "escalate"
  | "fault"
  | "restore"
  | "reset";

export type EventToast = {
  id: string;
  time: string;
  level: RiskLevel;
  text: string;
  kind: ToastKind;
  auto?: boolean;
};

function borderTone(level: RiskLevel) {
  if (level === "ATTENTION") return "border-l-attn";
  if (level === "ELEVATED") return "border-l-orange";
  if (level === "CRITICAL") return "border-l-crit";
  return "border-l-ok";
}

function ToastIcon({ toast }: { toast: EventToast }) {
  const className = "h-3.5 w-3.5 shrink-0";
  if (toast.kind === "auto") {
    return (
      <svg viewBox="0 0 16 16" className={cn(className, "text-ok")} aria-hidden>
        <path
          fill="currentColor"
          d="M6.4 1.2h3.2l.3 1.6a5 5 0 0 1 1.4.8l1.5-.6 1.6 2.8-1.2 1.1c.1.4.2.8.2 1.1s-.1.8-.2 1.1l1.2 1.1-1.6 2.8-1.5-.6a5 5 0 0 1-1.4.8l-.3 1.6H6.4l-.3-1.6a5 5 0 0 1-1.4-.8l-1.5.6L1.6 10l1.2-1.1A5 5 0 0 1 2.6 8c0-.4.1-.8.2-1.1L1.6 5.8 3.2 3l1.5.6a5 5 0 0 1 1.4-.8l.3-1.6ZM8 6.2A1.8 1.8 0 1 0 8 9.8 1.8 1.8 0 0 0 8 6.2Z"
        />
      </svg>
    );
  }
  if (toast.kind === "fault" || toast.level === "ATTENTION") {
    return (
      <svg viewBox="0 0 16 16" className={cn(className, "text-attn")} aria-hidden>
        <path
          fill="currentColor"
          d="M8 1.2 14.8 14H1.2L8 1.2Zm0 4.2-.9 5h1.8L8 5.4Zm0 6.2a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z"
        />
      </svg>
    );
  }
  if (toast.kind === "escalate" || toast.kind === "crisis" || toast.level === "CRITICAL") {
    return (
      <svg viewBox="0 0 16 16" className={cn(className, "text-crit")} aria-hidden>
        <path
          fill="currentColor"
          d="M8 1.4a6.6 6.6 0 1 1 0 13.2A6.6 6.6 0 0 1 8 1.4Zm0 3.1-.9 5.1h1.8L8 4.5Zm0 6.3a.95.95 0 1 0 0 1.9.95.95 0 0 0 0-1.9Z"
        />
      </svg>
    );
  }
  if (toast.level === "ELEVATED") {
    return (
      <svg viewBox="0 0 16 16" className={cn(className, "text-orange")} aria-hidden>
        <circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8" cy="8" r="1.6" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className={cn(className, "text-ok")} aria-hidden>
      <path
        fill="currentColor"
        d="M6.2 11.4 2.8 8l1.1-1.1 2.3 2.3 5.9-5.9L13.2 4.4 6.2 11.4Z"
      />
    </svg>
  );
}

export function EventToasts({
  toasts,
  onDismiss,
  onOpen,
}: {
  toasts: EventToast[];
  onDismiss: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      data-testid="event-toast-stack"
      className="pointer-events-none fixed end-4 top-20 z-[60] flex w-[min(22.5rem,calc(100vw-1.5rem))] flex-col gap-2 print:hidden"
      role="region"
      aria-label="Live event notifications"
    >
      {toasts.map((toast) => {
        const critical = toast.level === "CRITICAL";
        return (
          <div
            key={toast.id}
            data-testid={critical ? "event-toast-critical" : "event-toast"}
            data-log-id={toast.id}
            className={cn(
              "toast-slide-in pointer-events-auto border border-bridge-line bg-bridge-panel text-start shadow-lg",
              "border-l-4",
              borderTone(toast.level),
              critical && "toast-crit-glow px-3.5 py-3",
              !critical && "px-3 py-2.5",
            )}
          >
            <div className="flex items-start gap-2.5">
              <button
                type="button"
                className="min-w-0 flex-1 text-start"
                onClick={() => onOpen(toast.id)}
              >
                <span className="flex items-center gap-2">
                  {critical ? (
                    <span
                      className="crisis-pulse-dot mt-0.5 h-2 w-2 shrink-0 rounded-full bg-crit"
                      aria-hidden
                    />
                  ) : (
                    <ToastIcon toast={toast} />
                  )}
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-wider",
                      toast.auto
                        ? "text-ok"
                        : critical
                          ? "text-crit"
                          : "text-bridge-dim",
                    )}
                  >
                    {toast.auto ? "AUTO" : toast.level}
                    <span className="ms-2 text-bridge-dim">{toast.time}</span>
                  </span>
                </span>
                <p
                  className={cn(
                    "mt-1 truncate font-ui text-sm text-bridge-text",
                    critical && "text-[15px] font-medium",
                  )}
                >
                  {toast.text}
                </p>
              </button>
              <button
                type="button"
                data-testid="event-toast-dismiss"
                aria-label="Dismiss notification"
                className="shrink-0 px-1 font-ui text-sm leading-none text-bridge-dim hover:text-bridge-text"
                onClick={(event) => {
                  event.stopPropagation();
                  onDismiss(toast.id);
                }}
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
