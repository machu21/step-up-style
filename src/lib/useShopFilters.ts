"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { emptyFilters, FACETS, FILTER_OPTIONS, SORTS, type Facet, type ProductFilters, type SortKey } from "./products";

/** Shop filter state, stored in the URL query (e.g. ?gender=Women&size=9&size=9.5&sort=price-asc). */
export function useShopFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => {
    const f = emptyFilters();
    for (const facet of FACETS) {
      // Drop unknown values so a hand-edited URL can't break the UI.
      f[facet] = params.getAll(facet).filter((v) => (FILTER_OPTIONS[facet] as string[]).includes(v));
    }
    return f;
  }, [params]);

  const rawSort = params.get("sort");
  const sort: SortKey = rawSort && rawSort in SORTS ? (rawSort as SortKey) : "featured";

  const commit = useCallback(
    (next: ProductFilters, nextSort: SortKey) => {
      const q = new URLSearchParams();
      for (const facet of FACETS) next[facet].forEach((v) => q.append(facet, v));
      if (nextSort !== "featured") q.set("sort", nextSort);
      const qs = q.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const toggle = (facet: Facet, value: string) => {
    const cur = filters[facet];
    commit({ ...filters, [facet]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] }, sort);
  };

  return {
    filters,
    sort,
    toggle,
    setSort: (s: SortKey) => commit(filters, s),
    clear: () => commit(emptyFilters(), sort),
    activeCount: FACETS.reduce((n, f) => n + filters[f].length, 0),
  };
}
