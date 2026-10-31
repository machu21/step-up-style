"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { FREE_SHIPPING, peso } from "@/lib/products";
import { selectCount, selectSubtotal, useCart, useUi } from "@/store/cart";

export function CartDrawer() {
  const { drawerOpen, closeDrawer } = useUi();
  const { items, setQuantity, remove } = useCart();
  const count = useCart(selectCount);
  const subtotal = useCart(selectSubtotal);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  const remaining = Math.max(FREE_SHIPPING - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING) * 100, 100);

  return (
    <div className="fixed inset-0 z-50">
      <div className="animate-fade-in absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={closeDrawer} />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="animate-slide-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="display text-3xl">
            Your Bag <span className="text-muted">({count})</span>
          </h2>
          <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-ink/5" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-stone">
              <ShoppingBag size={32} />
            </div>
            <p className="display text-2xl">Your bag is empty</p>
            <p className="text-sm text-muted">Find your next pair and step up your rotation.</p>
            <button onClick={closeDrawer} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream">
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-ink/10 px-6 py-4">
              <p className="flex items-center gap-2 text-sm">
                <Truck size={16} />
                {remaining > 0 ? (
                  <span>
                    You’re <strong>{peso(remaining)}</strong> away from free shipping
                  </span>
                ) : (
                  <span className="font-semibold text-olive">You’ve unlocked free shipping!</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${remaining > 0 ? "bg-ember" : "bg-olive"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 py-5">
                  <Image src={i.image} alt={i.name} width={96} height={96} className="h-24 w-24 shrink-0 rounded-2xl bg-white object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted">{i.brand}</p>
                        <p className="font-semibold">{i.name}</p>
                      </div>
                      <button onClick={() => remove(i.key)} className="rounded-full p-1.5 text-muted hover:bg-ink/5 hover:text-ember" aria-label={`Remove ${i.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="mt-1 w-fit rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-semibold text-cream">US {i.size}</span>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-ink/15">
                        <button onClick={() => setQuantity(i.key, i.quantity - 1)} className="p-2" aria-label="Decrease quantity">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{i.quantity}</span>
                        <button onClick={() => setQuantity(i.key, i.quantity + 1)} disabled={i.quantity >= 10} className="p-2 disabled:opacity-30" aria-label="Increase quantity">
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-semibold">{peso(i.price * i.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink/10 px-6 py-5">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="text-lg font-bold text-ink">{peso(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="mt-4 block rounded-full bg-ink py-4 text-center text-sm font-bold uppercase tracking-wider text-cream transition hover:bg-ember"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
