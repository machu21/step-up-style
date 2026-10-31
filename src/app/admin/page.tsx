"use client";

import Link from "next/link";
import { useState } from "react";
import { Banknote, PackageCheck, RotateCcw, TrendingUp } from "lucide-react";
import { StatusBadge, fmtDate } from "@/components/orders/OrderBits";
import { peso } from "@/lib/products";
import { useOrders, type Order } from "@/store/orders";

const DAY = 86_400_000;
const startOfDay = (t: number) => new Date(t).setHours(0, 0, 0, 0);
/** Revenue counts every order that wasn't cancelled or refunded. */
const counts = (o: Order) => o.status !== "cancelled" && o.status !== "refunded";

function RevenueChart({ orders, today }: { orders: Order[]; today: number }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const start = today - (6 - i) * DAY;
    const total = orders.filter((o) => counts(o) && o.createdAt >= start && o.createdAt < start + DAY).reduce((n, o) => n + o.total, 0);
    return { start, total };
  });
  const max = Math.max(...days.map((d) => d.total), 1);
  return (
    <div className="flex h-48 items-end gap-2 sm:gap-4">
      {days.map((d) => (
        <div key={d.start} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="text-[10px] font-semibold text-muted opacity-0 transition group-hover:opacity-100">{peso(d.total).replace(/\.00$/, "")}</span>
          <div className="w-full max-w-12 rounded-t-lg bg-ink transition group-hover:bg-ember" style={{ height: `${Math.max((d.total / max) * 100, 2)}%` }}
            title={peso(d.total)} />
          <span className="text-xs text-muted">{new Date(d.start).toLocaleDateString("en-PH", { weekday: "short" })}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const orders = useOrders((s) => s.orders);
  const [today] = useState(() => startOfDay(Date.now()));
  const todays = orders.filter((o) => o.createdAt >= today && counts(o));
  const week = orders.filter((o) => o.createdAt >= today - 6 * DAY && counts(o));

  const kpis = [
    { label: "Sales today", value: peso(todays.reduce((n, o) => n + o.total, 0)), sub: `${todays.length} orders`, icon: TrendingUp, href: "/admin/orders" },
    { label: "To ship", value: orders.filter((o) => o.status === "processing").length, sub: "Ready to pack", icon: PackageCheck, href: "/admin/orders" },
    { label: "Awaiting confirmation", value: orders.filter((o) => o.status === "pending").length, sub: "Mostly COD", icon: Banknote, href: "/admin/orders" },
    { label: "Return requests", value: orders.filter((o) => o.status === "return_requested").length, sub: "Need a decision", icon: RotateCcw, href: "/admin/orders" },
  ];

  const top = Object.values(
    week.flatMap((o) => o.items).reduce<Record<string, { name: string; qty: number; revenue: number }>>((acc, i) => {
      acc[i.id] ??= { name: i.name, qty: 0, revenue: 0 };
      acc[i.id].qty += i.quantity;
      acc[i.id].revenue += i.price * i.quantity;
      return acc;
    }, {}),
  ).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <>
      <h1 className="display text-4xl sm:text-5xl">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, sub, icon: Icon, href }) => (
          <Link key={label} href={href} className="rounded-2xl bg-white p-5 transition hover:ring-1 hover:ring-ink/20">
            <Icon size={20} className="text-ember" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl bg-white p-6">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-bold">Revenue · last 7 days</h2>
            <span className="text-sm font-semibold">{peso(week.reduce((n, o) => n + o.total, 0))}</span>
          </div>
          <RevenueChart orders={orders} today={today} />
        </section>
        <section className="rounded-2xl bg-white p-6">
          <h2 className="font-bold">Top sellers this week</h2>
          <ol className="mt-4 space-y-3 text-sm">
            {top.length === 0 && <li className="text-muted">No sales yet.</li>}
            {top.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-ink/5 text-xs font-bold">{i + 1}</span>
                <span className="flex-1 font-medium">{p.name}</span>
                <span className="text-muted">{p.qty} sold</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-ember">View all</Link>
        </div>
        <ul className="mt-3 divide-y divide-ink/5">
          {orders.slice(0, 6).map((o) => (
            <li key={o.id}>
              <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm hover:text-ember">
                <span className="w-24 font-semibold">{o.id}</span>
                <span className="flex-1">{o.customer.name}</span>
                <span className="text-muted">{fmtDate(o.createdAt)}</span>
                <span className="w-28 text-right font-semibold">{peso(o.total)}</span>
                <StatusBadge status={o.status} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
