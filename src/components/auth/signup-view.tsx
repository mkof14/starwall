"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordField } from "@/components/auth/password-field";

export function SignupView() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        organization: organization.trim(),
        email: email.trim(),
        password,
      }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setBusy(false);
      setError(payload.error ?? "Could not create the account.");
      return;
    }
    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
    setBusy(false);
    if (!result || result.error) {
      setError("Account created. Sign in from the login page.");
      return;
    }
    router.push("/interface");
    router.refresh();
  }

  function google() {
    setBusy(true);
    void signIn("google", { callbackUrl: "/interface" });
  }

  return (
    <AuthShell title="Create a StarWall account">
      <form
        data-testid="signup-form"
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <Field
          id="signup-name"
          testId="signup-name"
          label="Name"
          value={name}
          onChange={setName}
          autoComplete="name"
        />
        <Field
          id="signup-org"
          testId="signup-organization"
          label="Organization (optional)"
          value={organization}
          onChange={setOrganization}
          autoComplete="organization"
        />
        <Field
          id="signup-email"
          testId="signup-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <PasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          testId="signup-password"
        />
        <PasswordField
          id="signup-confirm"
          label="Confirm Password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          testId="signup-confirm"
        />
        {error ? (
          <p data-testid="signup-error" className="mt-3 text-sm text-crit">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          data-testid="signup-submit"
          disabled={busy}
          className="mt-5 w-full bg-orange px-3 py-2.5 font-ui text-sm font-medium text-white hover:bg-orange/90 disabled:opacity-60"
        >
          {busy ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#B7C9D8]" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#55687A]">
          or
        </span>
        <span className="h-px flex-1 bg-[#B7C9D8]" />
      </div>

      <GoogleButton onClick={google} disabled={busy} />

      <p className="mt-6 text-center text-sm text-[#55687A]">
        Already have an account?{" "}
        <Link href="/login" className="text-orange hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

function Field({
  id,
  testId,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  testId: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="mt-4 block text-sm first:mt-0" htmlFor={id}>
      <span className="text-[#55687A]">{label}</span>
      <input
        id={id}
        data-testid={testId}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full border border-[#B7C9D8] bg-[#F7FBFD] px-3 py-2.5 text-navyText outline-none focus:border-orange"
      />
    </label>
  );
}
