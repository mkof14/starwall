"use client";

import { useEffect, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { PlansPageCopy } from "@/lib/i18n/plans-page";
import {
  ASSET_KEYS,
  REQUIREMENT_KEYS,
  SYSTEM_KEYS,
  type AssetKey,
  type PlanId,
  type RequirementKey,
  type SystemKey,
} from "@/lib/plans";
import { REQUIREMENT_BY_PLAN } from "@/lib/plans";

const fieldClass =
  "w-full border-b border-stroke bg-transparent px-0 py-2 text-ink outline-none focus:border-orange";

type Field = "name" | "email" | "asset" | "requirement";

export function PlansRequestForm({
  copy,
  selectedPlan,
}: {
  copy: PlansPageCopy["request"];
  selectedPlan: PlanId | null;
}) {
  const [asset, setAsset] = useState<AssetKey | "">("");
  const [scale, setScale] = useState("");
  const [systems, setSystems] = useState<SystemKey[]>([]);
  const [requirement, setRequirement] = useState<RequirementKey | "">("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (selectedPlan) {
      setRequirement(REQUIREMENT_BY_PLAN[selectedPlan]);
      setErrors((current) => ({ ...current, requirement: undefined }));
    }
  }, [selectedPlan]);

  function isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function toggleSystem(key: SystemKey) {
    setSystems((current) => {
      if (key === "none") return current.includes("none") ? [] : ["none"];
      const withoutNone = current.filter((item) => item !== "none");
      return withoutNone.includes(key)
        ? withoutNone.filter((item) => item !== key)
        : [...withoutNone, key];
    });
  }

  function composeMessage() {
    const assetLabel = asset ? copy.assets[asset] : "";
    const requirementLabel = requirement ? copy.requirements[requirement] : "";
    const systemLabels = systems.map((key) => copy.systems[key]).join(", ");
    const planLine = selectedPlan ? `StarWall plan interest: ${selectedPlan}` : "";
    return [
      "StarWall configuration request",
      planLine,
      `${copy.assetLabel}: ${assetLabel}`,
      scale.trim() ? `${copy.scaleLabel}: ${scale.trim()}` : "",
      systemLabels ? `${copy.systemsLabel}: ${systemLabels}` : "",
      `${copy.requirementLabel}: ${requirementLabel}`,
      company.trim() ? `${copy.company}: ${company.trim()}` : "",
      phone.trim() ? `${copy.phone}: ${phone.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<Field, string>> = {};
    if (!name.trim()) nextErrors.name = copy.required;
    if (!email.trim()) nextErrors.email = copy.required;
    else if (!isEmail(email.trim())) nextErrors.email = copy.invalidEmail;
    if (!asset) nextErrors.asset = copy.required;
    if (!requirement) nextErrors.requirement = copy.required;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const message = composeMessage();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message,
        }),
      });
    } catch {
      // Local preview still records the request in the console.
    }
    console.log({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      asset,
      scale: scale.trim(),
      systems,
      requirement,
      selectedPlan,
      message,
    });
    setSent(true);
  }

  if (sent) {
    return (
      <p className="max-w-xl text-base leading-relaxed text-ink" role="status">
        {copy.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-8" noValidate>
      <fieldset className="space-y-3">
        <legend className="text-sm text-ink">{copy.assetLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {ASSET_KEYS.map((key) => (
            <label
              key={key}
              className={cn(
                "cursor-pointer border px-3 py-1.5 text-sm",
                asset === key
                  ? "border-orange text-orange"
                  : "border-stroke text-muted hover:text-ink",
              )}
            >
              <input
                type="radio"
                name="plans-asset"
                value={key}
                checked={asset === key}
                onChange={() => {
                  setAsset(key);
                  setErrors((current) => ({ ...current, asset: undefined }));
                }}
                className="sr-only"
              />
              {copy.assets[key]}
            </label>
          ))}
        </div>
        {errors.asset ? (
          <p className="text-sm text-crit">{errors.asset}</p>
        ) : null}
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="plans-scale" className="block text-sm text-ink">
          {copy.scaleLabel}{" "}
          <span className="text-muted">({copy.optional})</span>
        </label>
        <input
          id="plans-scale"
          name="scale"
          type="text"
          value={scale}
          onChange={(event) => setScale(event.target.value)}
          placeholder={copy.scalePlaceholder}
          className={fieldClass}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm text-ink">
          {copy.systemsLabel}{" "}
          <span className="font-normal text-muted">({copy.optional})</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {SYSTEM_KEYS.map((key) => {
            const checked = systems.includes(key);
            return (
              <label
                key={key}
                className={cn(
                  "cursor-pointer border px-3 py-1.5 text-sm",
                  checked
                    ? "border-orange text-orange"
                    : "border-stroke text-muted hover:text-ink",
                )}
              >
                <input
                  type="checkbox"
                  name="plans-systems"
                  value={key}
                  checked={checked}
                  onChange={() => toggleSystem(key)}
                  className="sr-only"
                />
                {copy.systems[key]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="plans-requirement" className="block text-sm text-ink">
          {copy.requirementLabel}
        </label>
        <select
          id="plans-requirement"
          name="requirement"
          value={requirement}
          onChange={(event) => {
            setRequirement(event.target.value as RequirementKey);
            setErrors((current) => ({ ...current, requirement: undefined }));
          }}
          aria-invalid={Boolean(errors.requirement)}
          className={cn(fieldClass, errors.requirement ? "border-crit" : "border-stroke")}
        >
          <option value=""></option>
          {REQUIREMENT_KEYS.map((key) => (
            <option key={key} value={key}>
              {copy.requirements[key]}
            </option>
          ))}
        </select>
        {errors.requirement ? (
          <p className="text-sm text-crit">{errors.requirement}</p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="plans-name" className="block text-sm text-ink">
            {copy.name}
          </label>
          <input
            id="plans-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            aria-invalid={Boolean(errors.name)}
            className={cn(fieldClass, errors.name ? "border-crit" : "border-stroke")}
          />
          {errors.name ? <p className="text-sm text-crit">{errors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="plans-company" className="block text-sm text-ink">
            {copy.company}{" "}
            <span className="text-muted">({copy.optional})</span>
          </label>
          <input
            id="plans-company"
            name="company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="plans-email" className="block text-sm text-ink">
            {copy.email}
          </label>
          <input
            id="plans-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            aria-invalid={Boolean(errors.email)}
            className={cn(fieldClass, errors.email ? "border-crit" : "border-stroke")}
          />
          {errors.email ? <p className="text-sm text-crit">{errors.email}</p> : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="plans-phone" className="block text-sm text-ink">
            {copy.phone}{" "}
            <span className="text-muted">({copy.optional})</span>
          </label>
          <input
            id="plans-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <button
        type="submit"
        data-testid="request-configuration"
        className="bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
      >
        {copy.submit}
      </button>
    </form>
  );
}
