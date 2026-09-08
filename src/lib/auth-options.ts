import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { isCommercialRole, resolveCommercialRole } from "@/lib/commercial-rbac";
import { isUserRole } from "@/lib/rbac";
import {
  authenticateUser,
  findUserByEmail,
  markSignIn,
  upsertGoogleUser,
} from "@/lib/user-store";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "starwall-dev-secret-not-for-production",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim() ?? "";
        const password = credentials?.password ?? "";
        if (!email || !password) return null;
        const user = await authenticateUser(email, password);
        if (!user) return null;
        await markSignIn(user.id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "missing-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing-google-client-secret",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const stored = await upsertGoogleUser({
          id: user.id,
          email: user.email,
          name: user.name,
        });
        if (stored) {
          user.id = stored.id;
          user.role = stored.role;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? token.sub;
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
        if (isUserRole(user.role)) token.role = user.role;
      }
      const email = typeof token.email === "string" ? token.email : "";
      if (email) {
        const stored = await findUserByEmail(email);
        if (stored) {
          token.sub = stored.id;
          token.role = stored.role;
          token.name = stored.name;
          token.commercialRole =
            resolveCommercialRole(stored.role, stored.commercialRole) ?? "none";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === "string" ? token.sub : "";
        session.user.name = typeof token.name === "string" ? token.name : session.user.name;
        session.user.email =
          typeof token.email === "string" ? token.email : session.user.email;
        session.user.role = isUserRole(token.role) ? token.role : "Operator";
        session.user.commercialRole = isCommercialRole(token.commercialRole)
          ? token.commercialRole
          : undefined;
      }
      return session;
    },
  },
};
