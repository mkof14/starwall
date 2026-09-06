import type { Metadata } from "next";
import { ForgotPasswordView } from "@/components/auth/forgot-password-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.forgotPassword.title,
  description: pageMeta.forgotPassword.description,
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
