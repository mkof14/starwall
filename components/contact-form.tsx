"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to send.");
      }

      form.reset();
      setStatus("success");
      setMessage(
        "Received locally. An outbound email service is not connected yet — the team will confirm Resend, Formspree, or another AGRON channel before launch.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Name" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Organization" name="organization" />
      <label className="block space-y-2">
        <span className="text-sm text-sand/80">Role</span>
        <select
          name="role"
          className="w-full border border-sand/20 bg-navy px-3 py-2 text-sand outline-none focus:border-orange"
          defaultValue=""
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="owner">Owner / family office</option>
          <option value="captain">Captain / security officer</option>
          <option value="broker">Marine insurance broker</option>
          <option value="pilot">Pilot partner / investor</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-sand/80">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-sand/20 bg-navy px-3 py-2 text-sand outline-none focus:border-orange"
        />
      </label>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send"}
      </Button>
      {message ? (
        <p
          className={
            status === "error" ? "text-sm text-crit" : "text-sm text-sand/70"
          }
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-sand/80">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border border-sand/20 bg-navy px-3 py-2 text-sand outline-none focus:border-orange"
      />
    </label>
  );
}
