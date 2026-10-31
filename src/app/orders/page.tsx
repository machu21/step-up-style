"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomerOrderCard } from "@/components/orders/CustomerOrderCard";
import { useOrders, useOrdersReady } from "@/store/orders";

export default function MyOrdersPage() {
  const ready = useOrdersReady();
  const orders = useOrders((s) => s.orders);
  const myOrderIds = useOrders((s) => s.myOrderIds);
  const mine = orders.filter((o) => myOrderIds.includes(o.id));

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-10 sm:px-6">
        <h1 className="display text-5xl sm:text-7xl">My <span className="outline-text">Orders</span></h1>
        <p className="mt-3 text-sm text-muted">Orders placed on this device. Placed one elsewhere? <Link href="/track" className="font-semibold text-ink underline">Track it here</Link>.</p>
        <div className="mt-8 space-y-6">
          {!ready && <Loader2 className="mx-auto animate-spin text-muted" />}
          {ready && mine.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center">
              <p className="text-muted">You haven’t placed any orders yet.</p>
              <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-8 py-3 text-sm font-semibold text-cream hover:bg-ember">Start shopping</Link>
            </div>
          )}
          {mine.map((o) => <CustomerOrderCard key={o.id} order={o} />)}
        </div>
      </main>
      <Footer />
    </>
  );
}
