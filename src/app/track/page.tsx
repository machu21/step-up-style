"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomerOrderCard } from "@/components/orders/CustomerOrderCard";
import { useOrders, useOrdersReady } from "@/store/orders";

function TrackView() {
  const ready = useOrdersReady();
  const orders = useOrders((s) => s.orders);
  const myOrderIds = useOrders((s) => s.myOrderIds);
  // Coming from the checkout confirmation: orders placed in this browser open without an email.
  const urlId = useSearchParams().get("id")?.toUpperCase() ?? "";
  const [id, setId] = useState(urlId);
  const [email, setEmail] = useState("");
  const [foundId, setFoundId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const wanted = id.trim().toUpperCase().replace(/^#/, "");
    const match = orders.find((o) => o.id === wanted && o.customer.email.toLowerCase() === email.trim().toLowerCase());
    setFoundId(match?.id ?? null);
    setError(match ? "" : "We couldn’t find an order with that ID and email.");
  };

  const order = orders.find((o) => o.id === (foundId ?? (myOrderIds.includes(urlId) ? urlId : null)));

  return (
    <>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-10 sm:px-6">
        <h1 className="display text-5xl sm:text-7xl">Track <span className="outline-text">Order</span></h1>
        <p className="mt-3 text-sm text-muted">Enter your order ID and the email you used at checkout.</p>
        <form onSubmit={submit} noValidate className="mt-6 grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Order ID (e.g. SUS-1234)" aria-label="Order ID"
            className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm outline-none focus:border-ink" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" aria-label="Email"
            className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm outline-none focus:border-ink" />
          <button className="flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-ember">
            <Search size={16} /> Track
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-ember" role="alert">{error}</p>}
        <div className="mt-8">
          {!ready ? <Loader2 className="mx-auto animate-spin text-muted" /> : order && <CustomerOrderCard key={order.id} order={order} defaultOpen />}
        </div>
      </main>
    </>
  );
}

export default function TrackPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="grid flex-1 place-items-center"><Loader2 className="animate-spin text-muted" /></main>}>
        <TrackView />
      </Suspense>
      <Footer />
    </>
  );
}
