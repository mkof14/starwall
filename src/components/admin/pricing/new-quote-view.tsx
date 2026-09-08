"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeskShell } from "@/components/admin/pricing/desk-shell";
import { OBJECT_TYPES, STARWALL_PLANS } from "@/lib/price-book/types";

export function NewQuoteView() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    company: "",
    contact: "",
    email: "",
    phone: "",
    country: "",
    opportunityId: "",
    objectType: "Superyacht",
    objectName: "",
    objectSize: "",
    location: "",
    siteCount: 1,
    vesselCount: 1,
    objectNotes: "",
    plan: "INTELLIGENCE",
  });

  async function submit() {
    setPending(true);
    setError("");
    const res = await fetch("/api/admin/starwall/pricing/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await res.json()) as { id?: string; error?: string };
    setPending(false);
    if (!res.ok || !data.id) {
      setError(data.error === "forbidden" ? "Your desk role cannot open a quote." : "Could not create quote.");
      return;
    }
    router.push(`/admin/starwall/pricing/quotes/${data.id}`);
  }

  function field(key: keyof typeof form, label: string, type = "text") {
    return (
      <label className="block text-sm">
        {label}
        <input
          className="mt-1 w-full border-b border-stroke bg-transparent py-1"
          type={type}
          value={form[key] as string | number}
          onChange={(event) =>
            setForm({
              ...form,
              [key]: type === "number" ? Number(event.target.value) : event.target.value,
            })
          }
        />
      </label>
    );
  }

  return (
    <DeskShell title="New StarWall quote">
      <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
        {field("customerName", "Customer name")}
        {field("company", "Company")}
        {field("contact", "Contact")}
        {field("email", "Email", "email")}
        {field("phone", "Phone")}
        {field("country", "Country")}
        {field("opportunityId", "Opportunity ID")}
        <label className="block text-sm">
          Object type
          <select
            className="mt-1 w-full border-b border-stroke bg-transparent py-1"
            value={form.objectType}
            onChange={(event) => setForm({ ...form, objectType: event.target.value })}
          >
            {OBJECT_TYPES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        {field("objectName", "Object name")}
        {field("objectSize", "Size / scale")}
        {field("location", "Location")}
        {field("siteCount", "Number of sites", "number")}
        {field("vesselCount", "Number of vessels", "number")}
        <label className="block text-sm sm:col-span-2">
          StarWall plan
          <select
            className="mt-1 w-full border-b border-stroke bg-transparent py-1"
            value={form.plan}
            onChange={(event) => setForm({ ...form, plan: event.target.value })}
          >
            {STARWALL_PLANS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          Notes
          <textarea
            className="mt-1 w-full border-b border-stroke bg-transparent py-1"
            rows={3}
            value={form.objectNotes}
            onChange={(event) => setForm({ ...form, objectNotes: event.target.value })}
          />
        </label>
      </div>
      {error ? <p className="mt-4 text-sm text-crit">{error}</p> : null}
      <button
        type="button"
        disabled={pending || !form.customerName.trim()}
        onClick={() => void submit()}
        className="mt-6 bg-orange px-4 py-2 text-sm text-white disabled:opacity-40"
      >
        Create quote
      </button>
    </DeskShell>
  );
}
