"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FACETS, filterLabel, filterProducts, products, SORTS, sortProducts, type SortKey } from "@/lib/products";
import { useShopFilters } from "@/lib/useShopFilters";
import { ProductCard } from "@/components/ProductRail";
import { FilterPanel } from "./FilterPanel";

export function ShopView() {
  const { filters, sort, toggle, setSort, clear, activeCount } = useShopFilters();
  const [sheetOpen, setSheetOpen] = useState(false);
  const results = sortProducts(filterProducts(products, filters), sort);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const chips = FACETS.flatMap((f) => filters[f].map((v) => ({ f, v })));

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <div className="flex items-center justify-between">
            <p className="display text-2xl">Filters</p>
            {activeCount > 0 && (
              <button onClick={clear} className="text-xs font-semibold text-muted underline hover:text-ink">
                Clear all
              </button>
            )}
          </div>
          <FilterPanel filters={filters} toggle={toggle} />
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            <strong className="text-ink">{results.length}</strong> {results.length === 1 ? "style" : "styles"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filters{activeCount > 0 && ` (${activeCount})`}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-muted sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium outline-none focus:border-ink"
              >
                {Object.entries(SORTS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map(({ f, v }) => (
              <button
                key={`${f}-${v}`}
                onClick={() => toggle(f, v)}
                className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-cream hover:bg-ember"
                aria-label={`Remove filter ${filterLabel(f, v)}`}
              >
                {filterLabel(f, v)} <X size={12} />
              </button>
            ))}
            <button onClick={clear} className="px-2 text-xs font-semibold text-muted underline hover:text-ink">
              Clear all
            </button>
          </div>
        )}

        {results.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="display text-4xl">No matches</p>
            <p className="mt-2 max-w-sm text-sm text-muted">Nothing fits every filter you picked. Try removing one or two.</p>
            <button onClick={clear} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-ember">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} grid />
            ))}
          </div>
        )}
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="animate-fade-in absolute inset-0 bg-ink/50" onClick={() => setSheetOpen(false)} />
          <div role="dialog" aria-modal="true" aria-label="Filters" className="animate-pop-in absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-cream">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <p className="display text-2xl">Filters</p>
              <button onClick={() => setSheetOpen(false)} className="rounded-full p-2 hover:bg-ink/5" aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">
              <FilterPanel filters={filters} toggle={toggle} />
            </div>
            <div className="flex gap-3 border-t border-ink/10 p-4">
              <button onClick={clear} className="flex-1 rounded-full border border-ink/20 py-3 text-sm font-semibold">
                Clear
              </button>
              <button onClick={() => setSheetOpen(false)} className="flex-[2] rounded-full bg-ink py-3 text-sm font-semibold text-cream">
                Show {results.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
