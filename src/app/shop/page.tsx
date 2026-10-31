import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop All Shoes — Step-Up-Style",
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-10 sm:px-6">
        <h1 className="display text-6xl sm:text-8xl">
          All <span className="outline-text">Shoes</span>
        </h1>
        <p className="mb-10 mt-3 max-w-md text-sm text-muted">Filter by gender, brand, size and more. Every size you pick is in stock.</p>
        {/* useSearchParams in ShopView renders client-side; the rest of the page stays prerendered. */}
        <Suspense fallback={<div className="grid h-64 place-items-center"><Loader2 className="animate-spin text-muted" /></div>}>
          <ShopView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
