"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { COLOR_HEX, filterLabel, filterProducts, FILTER_OPTIONS, products, type Facet, type ProductFilters } from "@/lib/products";

const GROUPS: { facet: Facet; title: string }[] = [
  { facet: "gender", title: "Gender" },
  { facet: "category", title: "Category" },
  { facet: "brand", title: "Brand" },
  { facet: "size", title: "Size (US)" },
  { facet: "color", title: "Color" },
  { facet: "price", title: "Price" },
];

interface Props {
  filters: ProductFilters;
  toggle: (facet: Facet, value: string) => void;
}

export function FilterPanel({ filters, toggle }: Props) {
  return (
    <div className="divide-y divide-ink/10">
      {GROUPS.map((g) => (
        <FacetGroup key={g.facet} {...g} filters={filters} toggle={toggle} />
      ))}
    </div>
  );
}

function FacetGroup({ facet, title, filters, toggle }: Props & { facet: Facet; title: string }) {
  const [open, setOpen] = useState(true);
  const selected = filters[facet];
  // Counts reflect every other active facet, so each option shows what clicking it would yield.
  const pool = filterProducts(products, filters, facet);
  const count = (value: string) => filterProducts(pool, { ...filters, [facet]: [value] }).length;

  return (
    <section className="py-5">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-sm font-semibold" aria-expanded={open}>
        <span>
          {title}
          {selected.length > 0 && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[10px] text-cream">{selected.length}</span>}
        </span>
        <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-4">
          {facet === "size" ? (
            <div className="grid grid-cols-4 gap-2">
              {FILTER_OPTIONS.size.map((v) => {
                const active = selected.includes(v);
                const n = count(v);
                return (
                  <button
                    key={v}
                    onClick={() => toggle(facet, v)}
                    aria-pressed={active}
                    className={`rounded-xl border py-2 text-sm font-medium transition ${
                      active ? "border-ink bg-ink text-cream" : n === 0 ? "border-ink/10 text-ink/25" : "border-ink/15 bg-white hover:border-ink"
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          ) : facet === "color" ? (
            <div className="flex flex-wrap gap-3">
              {FILTER_OPTIONS.color.map((v) => {
                const active = selected.includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => toggle(facet, v)}
                    aria-pressed={active}
                    aria-label={`${v} (${count(v)})`}
                    title={v}
                    className={`grid h-8 w-8 place-items-center rounded-full ring-1 ring-ink/15 transition ${active ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : ""} ${count(v) === 0 ? "opacity-30" : ""}`}
                    style={{ background: COLOR_HEX[v] }}
                  >
                    {active && <Check size={14} className={v === "White" || v === "Sand" || v === "Grey" ? "text-ink" : "text-white"} />}
                  </button>
                );
              })}
            </div>
          ) : facet === "gender" ? (
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.gender.map((v) => {
                const active = selected.includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => toggle(facet, v)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${active ? "border-ink bg-ink text-cream" : "border-ink/15 hover:border-ink"}`}
                  >
                    {v} <span className="opacity-50">{count(v)}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <ul className="space-y-2.5">
              {(FILTER_OPTIONS[facet] as string[]).map((v) => {
                const active = selected.includes(v);
                const n = count(v);
                return (
                  <li key={v}>
                    <label className={`flex cursor-pointer items-center gap-3 text-sm ${n === 0 && !active ? "text-ink/30" : ""}`}>
                      <input type="checkbox" checked={active} onChange={() => toggle(facet, v)} className="h-4 w-4 accent-ink" />
                      <span className="flex-1">{filterLabel(facet, v)}</span>
                      <span className="text-xs text-muted">{n}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
