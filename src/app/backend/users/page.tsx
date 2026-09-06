import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/auth-gate";
import { UsersView } from "@/components/backend/users-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.backend.title,
  description: pageMeta.backend.description,
};

export default function BackendUsersPage() {
  return (
    <AuthGate next="/backend/users">
      <UsersView />
    </AuthGate>
  );
}
