"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Loader2, Minus, Plus, Star, X } from "lucide-react";
import { getProduct, peso, SIZES } from "@/lib/products";
import { useCart, useUi } from "@/store/cart";

export function QuickView() {
  const { quickViewId, closeQuickView } = useUi();
  const product = quickViewId ? getProduct(quickViewId) : undefined;

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeQuickView();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, closeQuickView]);

  if (!product) return null;
  // Keyed so size/qty state resets per product.
  return <QuickViewPanel key={product.id} productId={product.id} onClose={closeQuickView} />;
}

function QuickViewPanel({ productId, onClose }: { productId: string; onClose: () => void }) {
  const product = getProduct(productId)!;
  const add = useCart((s) => s.add);
  const openDrawer = useUi((s) => s.openDrawer);
  const [size, setSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState(false);

  const handleAdd = () => {
    if (size === null) {
      setError(true);
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      add(product, size, qty);
      setStatus("done");
      setTimeout(openDrawer, 650);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="animate-fade-in absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} quick view`}
        className="animate-pop-in relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-cream sm:rounded-3xl md:grid-cols-2"
      >
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white" aria-label="Close">
          <X size={18} />
        </button>
        <div className="relative aspect-square bg-white md:aspect-auto">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 450px, 100vw" className="object-cover" />
          {product.tag && (
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream">{product.tag}</span>
          )}
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-muted">
            {product.brand} · {product.category}
          </p>
          <h2 className="display mt-2 text-4xl sm:text-5xl">{product.name}</h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold">{peso(product.price)}</span>
            <span className="flex items-center gap-1 text-sm text-muted">
              <Star size={14} className="fill-ember text-ember" /> {product.rating} ({product.reviews})
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

          <fieldset className="mt-6">
            <legend className="mb-3 flex w-full justify-between text-sm font-semibold">
              <span>Select size (US)</span>
              {error && <span className="text-ember">Please pick a size</span>}
            </legend>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {SIZES.map((s) => {
                const out = product.soldOut.includes(s);
                const active = size === s;
                return (
                  <button
                    key={s}
                    disabled={out}
                    onClick={() => {
                      setSize(s);
                      setError(false);
                    }}
                    aria-pressed={active}
                    aria-label={`US ${s}${out ? ", sold out" : ""}`}
                    className={`relative rounded-xl border py-2.5 text-sm font-medium transition ${
                      active
                        ? "border-ink bg-ink text-cream"
                        : out
                          ? "cursor-not-allowed border-ink/10 text-ink/25 line-through"
                          : error
                            ? "border-ember/50 hover:border-ink"
                            : "border-ink/15 bg-white hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted">Crossed-out sizes are currently sold out.</p>
          </fieldset>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-ink/15 bg-white">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="p-3" aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={status !== "idle"}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold uppercase tracking-wider text-cream transition ${
                status === "done" ? "bg-olive" : "bg-ink hover:bg-ember"
              }`}
            >
              {status === "loading" && <Loader2 size={16} className="animate-spin" />}
              {status === "done" && <Check size={16} />}
              {status === "idle" ? `Add to Cart · ${peso(product.price * qty)}` : status === "loading" ? "Adding…" : "Added!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
