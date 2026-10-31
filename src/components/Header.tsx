"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { products, peso, type Category } from "@/lib/products";
import { selectCount, useCart, useUi } from "@/store/cart";
import { Logo } from "./Logo";

const CATEGORIES: Category[] = ["Running", "Casual", "Basketball"];

export function Header() {
  const count = useCart(selectCount);
  const { openDrawer, openQuickView, setCategory, category } = useUi();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const results = query.trim()
    ? products.filter((p) =>
        `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : [];

  const pickCategory = (c: Category) => {
    setCategory(c);
    setMenuOpen(false);
    document.getElementById("best-sellers")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-full p-2 hover:bg-ink/5 md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 rounded-full bg-ink/5 p-1 md:flex" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => pickCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c ? "bg-ink text-cream" : "text-ink/70 hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2.5 hover:bg-ink/5"
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <button
            onClick={openDrawer}
            className="relative rounded-full bg-ink p-2.5 text-cream transition hover:bg-ink/85"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              // Keyed on count so the pop animation replays on every change.
              <span
                key={count}
                className="animate-pop-in absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-bold text-white"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex gap-2 border-t border-ink/5 px-4 py-3 md:hidden" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => pickCategory(c)} className="rounded-full bg-ink/5 px-4 py-1.5 text-sm font-medium">
              {c}
            </button>
          ))}
        </nav>
      )}

      {searchOpen && (
        <div className="animate-fade-in border-t border-ink/5 bg-cream">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              placeholder="Search shoes, brands, categories…"
              className="w-full rounded-full border border-ink/15 bg-white px-5 py-3 text-sm outline-none focus:border-ink"
              aria-label="Search products"
            />
            {query.trim() && (
              <ul className="mt-3 divide-y divide-ink/5 overflow-hidden rounded-2xl bg-white">
                {results.length === 0 && <li className="p-4 text-sm text-muted">No shoes match “{query}”.</li>}
                {results.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        openQuickView(p.id);
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex w-full items-center gap-4 p-3 text-left hover:bg-stone/50"
                    >
                      <Image src={p.image} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">{p.name}</span>
                        <span className="block text-xs text-muted">
                          {p.brand} · {p.category}
                        </span>
                      </span>
                      <span className="text-sm font-semibold">{peso(p.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function CheckoutHeader() {
  return (
    <header className="border-b border-ink/5 bg-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <Link href="/" className="text-sm font-medium text-muted hover:text-ink">
          ← Continue shopping
        </Link>
      </div>
    </header>
  );
}
