"use client";

import { useState, type FormEvent } from "react";

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
        "Received locally. An outbound email service is not connected yet.",
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
      <label className="block space-y-2">
        <span className="text-sm text-navyText">Name</span>
        <input
          name="name"
          required
          className="w-full border border-gray-200 px-3 py-2 text-navyText outline-none focus:border-orange"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-navyText">Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-gray-200 px-3 py-2 text-navyText outline-none focus:border-orange"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-navyText">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-gray-200 px-3 py-2 text-navyText outline-none focus:border-orange"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90 disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send"}
      </button>
      {message ? (
        <p
          className={status === "error" ? "text-sm text-crit" : "text-sm text-grey"}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
