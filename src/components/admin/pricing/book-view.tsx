"use client";

import { useEffect, useMemo, useState } from "react";
import { DeskShell, moneyLabel } from "@/components/admin/pricing/desk-shell";

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
  const rows = items.filter((item) => category === "ALL" || item.category === category);

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
    <DeskShell title={`Price Book ${version || ""}`} role={role}>
      {error ? <p className="mb-4 text-sm text-crit">{error}</p> : null}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(key)}
            className={`border px-2 py-1 text-xs ${
              category === key ? "border-orange text-orange" : "border-stroke text-muted"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
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
                  {item.category}
                  {item.subcategory ? ` / ${item.subcategory}` : ""}
                </td>
                <td className="py-2 pe-3">{item.billingType}</td>
                <td className="py-2 pe-3">{moneyLabel(item.listPrice)}</td>
                {role === "admin" ? <td className="py-2 pe-3">{moneyLabel(item.internalCost)}</td> : null}
                {role === "admin" ? (
                  <td className="py-2 pe-3">
                    {item.grossMargin === null || item.grossMargin === undefined
                      ? "—"
                      : `${item.grossMargin}%`}
                  </td>
                ) : null}
                <td className="py-2 pe-3">
                  {item.active ? item.priceStatus : "INACTIVE"}
                </td>
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
      {editing && role === "admin" ? (
        <div className="mt-8 max-w-xl space-y-3 border-t border-stroke pt-6">
          <p className="font-heading text-xl font-bold">Edit {editing.itemCode}</p>
          <label className="block text-sm">
            List price
            <input
              className="mt-1 w-full border-b border-stroke bg-transparent py-1"
              type="number"
              value={editing.listPrice ?? ""}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  listPrice: event.target.value === "" ? null : Number(event.target.value),
                  listPriceOverride: true,
                })
              }
            />
          </label>
          <label className="block text-sm">
            Internal cost
            <input
              className="mt-1 w-full border-b border-stroke bg-transparent py-1"
              type="number"
              value={editing.internalCost ?? ""}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  internalCost: event.target.value === "" ? null : Number(event.target.value),
                })
              }
            />
          </label>
          <label className="block text-sm">
            Minimum approved price
            <input
              className="mt-1 w-full border-b border-stroke bg-transparent py-1"
              type="number"
              value={editing.minimumPrice ?? ""}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  minimumPrice: event.target.value === "" ? null : Number(event.target.value),
                })
              }
            />
          </label>
          <label className="block text-sm">
            Vendor cost
            <input
              className="mt-1 w-full border-b border-stroke bg-transparent py-1"
              type="number"
              value={editing.vendorCost ?? ""}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  vendorCost: event.target.value === "" ? null : Number(event.target.value),
                })
              }
            />
          </label>
          <label className="block text-sm">
            Shipping
            <input
              className="mt-1 w-full border-b border-stroke bg-transparent py-1"
              type="number"
              value={editing.shippingCost ?? ""}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  shippingCost: event.target.value === "" ? null : Number(event.target.value),
                })
              }
            />
          </label>
          <label className="block text-sm">
            Markup %
            <input
              className="mt-1 w-full border-b border-stroke bg-transparent py-1"
              type="number"
              value={editing.markupPercent ?? ""}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  markupPercent: event.target.value === "" ? null : Number(event.target.value),
                })
              }
            />
          </label>
          <p className="text-xs text-muted">
            Margin is calculated. Hardware list price follows landed cost + markup unless you override list
            price.
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
