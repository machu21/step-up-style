"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Plus, Star } from "lucide-react";
import { peso, type Product } from "@/lib/products";
import { useUi } from "@/store/cart";

/** `grid` drops the fixed mobile width used for horizontal scrolling rails. */
export function ProductCard({ product, grid = false }: { product: Product; grid?: boolean }) {
  const openQuickView = useUi((s) => s.openQuickView);
  return (
    <article className={`group ${grid ? "" : "w-[78vw] shrink-0 snap-start sm:w-auto"}`}>
      <button
        onClick={() => openQuickView(product.id)}
        className="relative block aspect-square w-full overflow-hidden rounded-3xl bg-white text-left"
        aria-label={`Quick view ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-cream px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            {product.tag}
          </span>
        )}
        <span className="absolute bottom-3 right-3 flex translate-y-2 items-center gap-1 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-cream opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:opacity-100">
          <Plus size={14} /> <span className={grid ? "max-sm:hidden" : ""}>Quick add</span>
        </span>
      </button>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-x-2 gap-y-1 px-1">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">{product.name}</h3>
          <p className="text-xs text-muted">
            {product.gender} · {product.category}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            {product.colors.map((c) => (
              <span key={c.name} title={c.name} className="h-3 w-3 rounded-full ring-1 ring-ink/15" style={{ background: c.hex }} />
            ))}
            <span className="ml-2 flex items-center gap-0.5 text-xs text-muted">
              <Star size={11} className="fill-ember text-ember" /> {product.rating}
            </span>
          </div>
        </div>
        <p className="text-sm font-bold">{peso(product.price)}</p>
      </div>
    </article>
  );
}

export function ProductRail({ products, viewAllHref }: { products: Product[]; viewAllHref?: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div>
      <div
        ref={railRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4"
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-2">
        <button onClick={() => scroll(-1)} className="rounded-full border border-ink/20 p-2 sm:hidden" aria-label="Previous">
          <ChevronLeft size={18} />
        </button>
        {viewAllHref && (
          <Link href={viewAllHref} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-ember">
            View all <ArrowRight size={16} />
          </Link>
        )}
        <button onClick={() => scroll(1)} className="rounded-full border border-ink/20 p-2 sm:hidden" aria-label="Next">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export function QuickViewButton({ productId, children, className }: { productId: string; children: React.ReactNode; className?: string }) {
  const openQuickView = useUi((s) => s.openQuickView);
  return (
    <button onClick={() => openQuickView(productId)} className={className}>
      {children}
    </button>
  );
}
