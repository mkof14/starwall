"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CategoryChip,
  DeskShell,
  PlanDots,
  moneyLabel,
} from "@/components/admin/pricing/desk-ui";
import { categoryLook, plansFromList } from "@/lib/price-book/desk-visual";

type Item = {
  id: string;
  itemCode: string;
  category: string;
  subcategory: string;
  name: string;
  description: string;
  unit: string;
  listPrice: number | null;
  billingType: string;
  applicablePlans: string;
  active: boolean;
  priceStatus: string;
  internalCost?: number | null;
  minimumPrice?: number | null;
  grossMargin?: number | null;
  vendorCost?: number | null;
  shippingCost?: number | null;
  otherAcquisition?: number | null;
  landedCost?: number | null;
  markupPercent?: number | null;
  listPriceOverride?: boolean;
};

export function PriceBookView() {
  const [role, setRole] = useState("");
  const [version, setVersion] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState("ALL");
  const [query, setQuery] = useState("");
  const [priced, setPriced] = useState<"all" | "ready" | "open">("all");
  const [layout, setLayout] = useState<"cards" | "table">("cards");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);

  function load() {
    fetch("/api/admin/starwall/pricing/book")
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 403 ? "No commercial access." : "Could not load.");
        const data = (await res.json()) as { role: string; book: { version: string }; items: Item[] };
        setRole(data.role);
        setVersion(data.book.version);
        setItems(data.items);
      })
      .catch((err: Error) => setError(err.message));
  }

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(
    () => ["ALL", ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );
  const rows = items.filter((item) => {
    if (category !== "ALL" && item.category !== category) return false;
    if (priced === "ready" && item.listPrice == null) return false;
    if (priced === "open" && item.listPrice != null) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return `${item.itemCode} ${item.name} ${item.description}`.toLowerCase().includes(q);
  });
  const openCount = items.filter((item) => item.listPrice == null).length;

  async function save() {
    if (!editing) return;
    const res = await fetch(`/api/admin/starwall/pricing/items/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (!res.ok) {
      setError("Could not save. Admin only for book edits.");
      return;
    }
    setEditing(null);
    load();
  }

  async function act(id: string, action: "duplicate" | "deactivate") {
    await fetch(`/api/admin/starwall/pricing/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    load();
  }

  return (
    <DeskShell title="Prices">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a price…"
          className="min-w-0 flex-1 border-b-2 border-stroke bg-transparent py-2 text-lg focus:border-navy focus:outline-none"
        />
        <select
          value={priced}
          onChange={(event) => setPriced(event.target.value as typeof priced)}
          className="border-b-2 border-stroke bg-transparent py-2 text-base"
        >
          <option value="all">All rows</option>
          <option value="ready">Priced</option>
          <option value="open">PRICE REQUIRED</option>
        </select>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLayout("cards")}
            className={`px-4 py-2 font-heading text-lg font-bold ${layout === "cards" ? "bg-navy text-sand" : "bg-panel"}`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setLayout("table")}
            className={`px-4 py-2 font-heading text-lg font-bold ${layout === "table" ? "bg-navy text-sand" : "bg-panel"}`}
          >
            Table
          </button>
        </div>
      </div>
      {error ? <p className="mb-4 text-lg text-crit">{error}</p> : null}
      <p className="mb-4 text-lg text-muted">
        {rows.length} of {items.length} · {openCount} still PRICE REQUIRED
        {version ? ` · book ${version}` : ""}
        {role ? ` · ${role}` : ""}
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((key) => {
          const count = key === "ALL" ? items.length : items.filter((item) => item.category === key).length;
          const look = key === "ALL" ? null : categoryLook(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`px-3 py-1.5 font-heading text-base font-bold ${
                category === key
                  ? "bg-navy text-sand"
                  : look
                    ? look.tone
                    : "bg-panel text-muted"
              }`}
            >
              {key === "ALL" ? "All" : look?.label} · {count}
            </button>
          );
        })}
      </div>

      {layout === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((item) => (
            <article key={item.id} className="flex flex-col bg-panel">
              <div className="flex items-center justify-between gap-2 px-5 pt-4">
                <CategoryChip category={item.category} />
                <PlanDots plans={item.applicablePlans} />
              </div>
              <div className="flex flex-1 flex-col px-5 py-3">
                <p className="font-mono text-sm text-muted">{item.itemCode}</p>
                <h3 className="mt-1 font-heading text-3xl font-bold leading-tight">{item.name}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{item.description}</p>
                <p className="mt-3 text-sm text-muted">
                  {item.billingType} · {item.unit}
                </p>
                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                  <p className={`font-heading text-4xl font-bold leading-none ${item.listPrice == null ? "text-[#C98900]" : "text-ink"}`}>
                    {moneyLabel(item.listPrice)}
                  </p>
                  {role === "admin" ? (
                    <button type="button" className="text-base text-[#0E8FA8]" onClick={() => setEditing(item)}>
                      Edit
                    </button>
                  ) : null}
                </div>
                {role === "admin" ? (
                  <p className="mt-2 font-mono text-[10px] text-muted">
                    {item.internalCost != null ? `Cost ${moneyLabel(item.internalCost)}` : "Cost open"}
                    {item.grossMargin != null ? ` · ${item.grossMargin}%` : ""}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto border-y border-stroke">
          <table className="w-full min-w-[64rem] text-start">
            <thead>
              <tr className="border-b border-stroke text-base text-muted">
                <th className="py-3 pe-3 text-start">Code</th>
                <th className="py-3 pe-3 text-start">Item</th>
                <th className="py-3 pe-3 text-start">Plans</th>
                <th className="py-3 pe-3 text-start">Category</th>
                <th className="py-3 pe-3 text-start">Bill</th>
                <th className="py-3 pe-3 text-start">List</th>
                {role === "admin" ? <th className="py-3 pe-3 text-start">Cost</th> : null}
                {role === "admin" ? <th className="py-3 pe-3 text-start">Margin</th> : null}
                <th className="py-3 pe-3 text-start">Status</th>
                <th className="py-3 text-start"> </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-stroke align-top">
                  <td className="py-3 pe-3 font-mono text-sm text-muted">{item.itemCode}</td>
                  <td className="py-3 pe-3">
                    <p className="font-heading text-2xl font-bold leading-tight">{item.name}</p>
                    <p className="mt-1 text-base text-muted">{item.description}</p>
                  </td>
                  <td className="py-3 pe-3">
                    {plansFromList(item.applicablePlans).length ? (
                      <PlanDots plans={item.applicablePlans} />
                    ) : (
                      <span className="text-base text-muted">—</span>
                    )}
                  </td>
                  <td className="py-3 pe-3">
                    <CategoryChip category={item.category} />
                  </td>
                  <td className="py-3 pe-3 text-base">{item.billingType}</td>
                  <td className={`py-3 pe-3 font-heading text-2xl font-bold ${item.listPrice == null ? "text-[#C98900]" : ""}`}>
                    {moneyLabel(item.listPrice)}
                  </td>
                  {role === "admin" ? <td className="py-3 pe-3 text-lg">{moneyLabel(item.internalCost)}</td> : null}
                  {role === "admin" ? (
                    <td className="py-3 pe-3 text-lg">
                      {item.grossMargin === null || item.grossMargin === undefined ? "—" : `${item.grossMargin}%`}
                    </td>
                  ) : null}
                  <td className="py-3 pe-3 text-base">{item.active ? item.priceStatus : "INACTIVE"}</td>
                  <td className="py-3">
                    {role === "admin" ? (
                      <div className="flex flex-wrap gap-3 text-base">
                        <button type="button" className="font-bold text-[#0E8FA8]" onClick={() => setEditing(item)}>
                          Edit
                        </button>
                        <button type="button" onClick={() => void act(item.id, "duplicate")}>
                          Duplicate
                        </button>
                        <button type="button" onClick={() => void act(item.id, "deactivate")}>
                          Inactive
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && role === "admin" ? (
        <div className="mt-8 max-w-xl space-y-3 border-t border-[#0E8FA8]/40 bg-[#D3F1F6]/50 px-5 py-6">
          <p className="font-heading text-3xl font-bold">Edit {editing.itemCode}</p>
          <Num
            label="List price"
            value={editing.listPrice}
            onChange={(value) => setEditing({ ...editing, listPrice: value, listPriceOverride: true })}
          />
          <Num
            label="Internal cost"
            value={editing.internalCost ?? null}
            onChange={(value) => setEditing({ ...editing, internalCost: value })}
          />
          <Num
            label="Minimum approved price"
            value={editing.minimumPrice ?? null}
            onChange={(value) => setEditing({ ...editing, minimumPrice: value })}
          />
          <Num
            label="Vendor cost"
            value={editing.vendorCost ?? null}
            onChange={(value) => setEditing({ ...editing, vendorCost: value })}
          />
          <Num
            label="Shipping"
            value={editing.shippingCost ?? null}
            onChange={(value) => setEditing({ ...editing, shippingCost: value })}
          />
          <Num
            label="Markup %"
            value={editing.markupPercent ?? null}
            onChange={(value) => setEditing({ ...editing, markupPercent: value })}
          />
          <p className="text-base text-muted">
            Margin is calculated. Hardware list follows landed cost + markup unless you override list price.
          </p>
          <div className="flex gap-3">
            <button type="button" className="bg-[#0E8FA8] px-5 py-3 font-heading text-lg font-bold text-white" onClick={() => void save()}>
              Save
            </button>
            <button type="button" className="text-lg text-muted" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </DeskShell>
  );
}

function Num({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <label className="block text-base">
      {label}
      <input
        className="mt-1 w-full border-b border-stroke bg-transparent py-1"
        type="number"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
      />
    </label>
  );
}
