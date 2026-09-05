"use client";

import { useState, type FormEvent } from "react";
import { usePreferences } from "@/lib/i18n/context";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const { t } = usePreferences();
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
        throw new Error(payload.error ?? t.contact.unable);
      }
      form.reset();
      setStatus("success");
      setMessage(t.contact.success);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t.contact.error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-2">
        <span className="text-sm text-ink">{t.contact.name}</span>
        <input
          name="name"
          required
          className="w-full border border-stroke bg-page px-3 py-2 text-ink outline-none focus:border-orange"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-ink">{t.contact.email}</span>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-stroke bg-page px-3 py-2 text-ink outline-none focus:border-orange"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-ink">{t.contact.message}</span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-stroke bg-page px-3 py-2 text-ink outline-none focus:border-orange"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90 disabled:opacity-50"
      >
        {status === "loading" ? t.contact.sending : t.contact.send}
      </button>
      {message ? (
        <p
          className={status === "error" ? "text-sm text-crit" : "text-sm text-muted"}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
