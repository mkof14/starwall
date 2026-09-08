import { requireActor } from "@/lib/authz";
import {
  resolveCommercialRole,
  type CommercialActor,
} from "@/lib/commercial-rbac";
import { findUserByEmail } from "@/lib/user-store";

export async function requireCommercial(): Promise<
  | { ok: true; actor: CommercialActor }
  | { ok: false; status: number; error: string }
> {
  const ready = await requireActor();
  if (!ready.ok) return ready;
  const stored = await findUserByEmail(ready.actor.email);
  const commercialRole = resolveCommercialRole(
    ready.actor.role,
    stored?.commercialRole,
  );
  if (!commercialRole) {
    return { ok: false, status: 403, error: "forbidden" };
  }
  return {
    ok: true,
    actor: { ...ready.actor, commercialRole },
  };
}
