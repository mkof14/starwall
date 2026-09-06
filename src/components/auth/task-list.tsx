"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { usePreferences } from "@/lib/i18n/context";
import type { Messages } from "@/lib/i18n/messages";
import { TASK_GROUPS, TASKS, type TaskDef, type TaskId } from "@/lib/tasks";

function taskTitle(task: TaskDef, t: Messages): string {
  const titles: Record<TaskId, string> = {
    health: t.backend.health,
    equipment: t.backend.equipment,
    access: t.backend.access,
    blackbox: t.backend.blackbox,
    integrations: t.backend.integrations,
    audit: t.backend.audit,
    overview: t.nav.home,
    how: t.nav.howItWorks,
    bridge: t.nav.interface,
    connections: t.surface.connectionsTitle,
    levels: t.nav.levels,
    pricing: t.nav.pricing,
    technology: t.nav.technology,
    faq: t.nav.faq,
    containers: t.nav.containers,
    contact: t.nav.contact,
  };
  return titles[task.id];
}

function taskBody(task: TaskDef, t: Messages): string {
  return t.auth.bodies[task.id];
}

type TaskListProps = {
  signedIn: boolean;
  onLocked: (href: string) => void;
};

export function TaskList({ signedIn, onLocked }: TaskListProps) {
  const { t } = usePreferences();

  return (
    <div className="space-y-8" data-testid="task-list">
      {TASK_GROUPS.map((group) => {
        const items = TASKS.filter((task) => task.group === group);
        if (items.length === 0) {
          return (
            <p key={group} className="font-mono text-xs text-muted">
              {t.auth.tasksEmpty}
            </p>
          );
        }
        return (
          <section key={group} aria-labelledby={`tasks-${group}`}>
            <h2
              id={`tasks-${group}`}
              className="font-mono text-[10px] tracking-[0.22em] text-muted"
            >
              {group === "backend" ? t.auth.groupBackend : t.auth.groupSite}
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {items.map((task) => (
                <li key={task.id}>
                  <TaskCard
                    task={task}
                    title={taskTitle(task, t)}
                    body={taskBody(task, t)}
                    openLabel={t.auth.openTask}
                    lockedHint={t.auth.lockedHint}
                    signedIn={signedIn}
                    onLocked={onLocked}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function TaskCard({
  task,
  title,
  body,
  openLabel,
  lockedHint,
  signedIn,
  onLocked,
}: {
  task: TaskDef;
  title: string;
  body: string;
  openLabel: string;
  lockedHint: string;
  signedIn: boolean;
  onLocked: (href: string) => void;
}) {
  const locked = task.gated && !signedIn;
  const className = cn(
    "flex h-full flex-col border bg-panel p-4 transition-colors",
    locked
      ? "border-stroke text-ink"
      : "border-stroke hover:border-orange",
  );

  const inner = (
    <>
      <p className="font-ui text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{body}</p>
      <p
        className={cn(
          "mt-3 font-mono text-[11px]",
          locked ? "text-muted" : "text-orange",
        )}
      >
        {locked ? lockedHint : `${openLabel} →`}
      </p>
    </>
  );

  if (locked) {
    return (
      <button
        type="button"
        data-testid={`task-${task.id}`}
        onClick={() => onLocked(task.href)}
        className={`${className} w-full text-start`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={task.href}
      data-testid={`task-${task.id}`}
      className={className}
    >
      {inner}
    </Link>
  );
}
