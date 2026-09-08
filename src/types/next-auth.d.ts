import { DefaultSession } from "next-auth";
import type { CommercialRole } from "@/lib/commercial-rbac";
import type { UserRole } from "@/lib/rbac";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      commercialRole?: CommercialRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    commercialRole?: CommercialRole | "none";
  }
}
