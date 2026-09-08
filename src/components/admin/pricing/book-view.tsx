"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CategoryChip,
  DeskShell,
  moneyLabel,
} from "@/components/admin/pricing/desk-ui";
import { categoryLook } from "@/lib/price-book/desk-visual";

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
    <DeskShell
      title={`Catalog ${version || ""}`}
      role={role}
      actions={
        <>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search SKU or name…"
            className="min-w-[14rem] flex-1 border-b border-sand/25 bg-transparent py-1 text-sm text-sand placeholder:text-sand/40 focus:border-orange focus:outline-none"
          />
          <select
            value={priced}
            onChange={(event) => setPriced(event.target.value as typeof priced)}
            className="border-b border-sand/25 bg-transparent py-1 text-sm text-sand"
          >
            <option value="all">All rows</option>
            <option value="ready">Priced</option>
            <option value="open">PRICE REQUIRED</option>
          </select>
          <div className="flex border border-sand/25">
            <button
              type="button"
              onClick={() => setLayout("cards")}
              className={`px-3 py-1 font-ui text-[10px] uppercase ${layout === "cards" ? "bg-orange text-white" : "text-sand/70"}`}
            >
              Shelf
            </button>
            <button
              type="button"
              onClick={() => setLayout("table")}
              className={`px-3 py-1 font-ui text-[10px] uppercase ${layout === "table" ? "bg-orange text-white" : "text-sand/70"}`}
            >
              Sheet
            </button>
          </div>
        </>
      }
    >
      {error ? <p className="mb-4 text-sm text-crit">{error}</p> : null}
      <p className="mb-4 text-sm text-muted">
        {rows.length} of {items.length} rows · {openCount} still PRICE REQUIRED
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
              className={`px-2 py-1 font-ui text-[10px] uppercase tracking-wider ${
                category === key
                  ? "bg-orange text-white"
                  : look
                    ? look.tone
                    : "border border-stroke text-muted"
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
            <article key={item.id} className="flex flex-col border border-stroke bg-panel">
              <div className="flex items-center justify-between gap-2 border-b border-stroke px-4 py-2">
                <CategoryChip category={item.category} />
                <span className="font-mono text-[10px] text-muted">{item.itemCode}</span>
              </div>
              <div className="flex flex-1 flex-col px-4 py-3">
                <h3 className="font-heading text-xl font-bold leading-tight">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                <p className="mt-3 text-xs text-muted">
                  {item.billingType} · {item.unit}
                  {item.applicablePlans ? ` · ${item.applicablePlans}` : ""}
                </p>
                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  <p className={`font-heading text-2xl font-bold ${item.listPrice == null ? "text-attn" : "text-ink"}`}>
                    {moneyLabel(item.listPrice)}
                  </p>
                  {role === "admin" ? (
                    <button type="button" className="text-xs text-orange" onClick={() => setEditing(item)}>
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
          <table className="w-full min-w-[64rem] text-start text-sm">
            <thead>
              <tr className="border-b border-stroke">
                <th className="py-2 pe-3 text-start">Code</th>
                <th className="py-2 pe-3 text-start">Item</th>
                <th className="py-2 pe-3 text-start">Category</th>
                <th className="py-2 pe-3 text-start">Bill</th>
                <th className="py-2 pe-3 text-start">List</th>
                {role === "admin" ? <th className="py-2 pe-3 text-start">Cost</th> : null}
                {role === "admin" ? <th className="py-2 pe-3 text-start">Margin</th> : null}
                <th className="py-2 pe-3 text-start">Status</th>
                <th className="py-2 text-start"> </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-stroke align-top">
                  <td className="py-2 pe-3 font-mono text-[11px]">{item.itemCode}</td>
                  <td className="py-2 pe-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted">{item.description}</p>
                  </td>
                  <td className="py-2 pe-3">
                    <CategoryChip category={item.category} />
                  </td>
                  <td className="py-2 pe-3">{item.billingType}</td>
                  <td className="py-2 pe-3">{moneyLabel(item.listPrice)}</td>
                  {role === "admin" ? <td className="py-2 pe-3">{moneyLabel(item.internalCost)}</td> : null}
                  {role === "admin" ? (
                    <td className="py-2 pe-3">
                      {item.grossMargin === null || item.grossMargin === undefined ? "—" : `${item.grossMargin}%`}
                    </td>
                  ) : null}
                  <td className="py-2 pe-3">{item.active ? item.priceStatus : "INACTIVE"}</td>
                  <td className="py-2">
                    {role === "admin" ? (
                      <div className="flex flex-wrap gap-2 text-xs">
                        <button type="button" className="text-orange" onClick={() => setEditing(item)}>
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
        <div className="mt-8 max-w-xl space-y-3 border-t border-orange/40 bg-[#F8DFCC]/40 px-4 py-6">
          <p className="font-heading text-xl font-bold">Edit {editing.itemCode}</p>
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
          <p className="text-xs text-muted">
            Margin is calculated. Hardware list follows landed cost + markup unless you override list price.
          </p>
          <div className="flex gap-3">
            <button type="button" className="bg-orange px-3 py-2 text-sm text-white" onClick={() => void save()}>
              Save
            </button>
            <button type="button" className="text-sm text-muted" onClick={() => setEditing(null)}>
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
    <label className="block text-sm">
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
