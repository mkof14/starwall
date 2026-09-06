import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/auth-gate";
import { TasksView } from "@/components/auth/tasks-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.tasks.title,
  description: pageMeta.tasks.description,
};

export default function TasksPage() {
  return (
    <AuthGate next="/tasks">
      <TasksView />
    </AuthGate>
  );
}
