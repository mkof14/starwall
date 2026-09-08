"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeskShell, PlanMark, moneyLabel } from "@/components/admin/pricing/desk-ui";
import { LICENSE_PRICES } from "@/lib/price-book/catalog";
import { PLAN_LOOK } from "@/lib/price-book/desk-visual";
import { deskPaths } from "@/lib/price-book/paths";
import { OBJECT_TYPES, STARWALL_PLANS } from "@/lib/price-book/types";

const STEPS = ["Customer", "Object", "Plan"] as const;

export function NewQuoteView() {
  const router = useRouter();
  const [step, setStep] = useState(0);
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

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

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
    router.push(deskPaths.quote(data.id));
  }

  const canNext =
    step === 0
      ? Boolean(form.customerName.trim())
      : step === 1
        ? Boolean(form.objectType)
        : Boolean(form.plan);

  return (
    <DeskShell title="Open a commercial ticket">
      <ol className="mb-8 flex flex-wrap gap-6">
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center font-mono text-xs ${
                index === step ? "bg-orange text-white" : index < step ? "bg-navy text-sand" : "border border-stroke text-muted"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={index === step ? "font-heading text-lg font-bold" : "text-sm text-muted"}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
          <Field label="Customer / captain / office" value={form.customerName} onChange={(v) => set("customerName", v)} required />
          <Field label="Company" value={form.company} onChange={(v) => set("company", v)} />
          <Field label="Contact name" value={form.contact} onChange={(v) => set("contact", v)} />
          <Field label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" />
          <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="Country" value={form.country} onChange={(v) => set("country", v)} />
          <Field label="Opportunity ID" value={form.opportunityId} onChange={(v) => set("opportunityId", v)} />
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {OBJECT_TYPES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => set("objectType", item)}
                className={`border px-3 py-4 text-start ${
                  form.objectType === item ? "border-orange bg-[#F8DFCC]" : "border-stroke bg-panel hover:border-orange/50"
                }`}
              >
                <p className="font-heading text-lg font-bold">{item}</p>
              </button>
            ))}
          </div>
          <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
            <Field label="Object name" value={form.objectName} onChange={(v) => set("objectName", v)} />
            <Field label="Size / scale" value={form.objectSize} onChange={(v) => set("objectSize", v)} />
            <Field label="Location" value={form.location} onChange={(v) => set("location", v)} />
            <Field
              label="Sites"
              value={String(form.siteCount)}
              onChange={(v) => set("siteCount", Number(v) || 1)}
              type="number"
            />
            <Field
              label="Vessels"
              value={String(form.vesselCount)}
              onChange={(v) => set("vesselCount", Number(v) || 1)}
              type="number"
            />
            <label className="block text-sm sm:col-span-2">
              What is already on the object
              <textarea
                className="mt-1 w-full border-b border-stroke bg-transparent py-1"
                rows={3}
                value={form.objectNotes}
                onChange={(event) => set("objectNotes", event.target.value)}
              />
            </label>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {STARWALL_PLANS.map((item) => {
            const look = PLAN_LOOK[item];
            const price = LICENSE_PRICES[item];
            return (
              <button
                key={item}
                type="button"
                onClick={() => set("plan", item)}
                className={`border text-start ${form.plan === item ? "border-orange" : "border-stroke"}`}
              >
                <span className={`block h-1.5 ${look.bar}`} />
                <div className={`px-4 py-4 ${form.plan === item ? look.wash : "bg-panel"}`}>
                  <PlanMark plan={item} />
                  <p className="mt-3 font-heading text-3xl font-bold">{item}</p>
                  <p className="mt-2 text-sm text-muted">Annual license list, this desk only.</p>
                  <p className="mt-3 font-heading text-2xl font-bold text-ink">{moneyLabel(price)}</p>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-crit">{error}</p> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 ? (
          <button type="button" className="border border-stroke px-4 py-2 text-sm" onClick={() => setStep(step - 1)}>
            Back
          </button>
        ) : null}
        {step < 2 ? (
          <button
            type="button"
            disabled={!canNext}
            className="bg-orange px-4 py-2 text-sm text-white disabled:opacity-40"
            onClick={() => setStep(step + 1)}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={pending || !form.customerName.trim()}
            onClick={() => void submit()}
            className="bg-orange px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            {pending ? "Opening…" : "Open ticket"}
          </button>
        )}
      </div>
    </DeskShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      {label}
      {required ? <span className="text-orange"> *</span> : null}
      <input
        className="mt-1 w-full border-b border-stroke bg-transparent py-1"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
