"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { StatusBadge, fmtDate } from "@/components/orders/OrderBits";
import { PAYMENT_LABEL, TABS, type Payment, type TabId } from "@/lib/orderStatus";
import { peso } from "@/lib/products";
import { useOrders } from "@/store/orders";

type Sort = "newest" | "oldest" | "total";

export default function AdminOrdersPage() {
  const orders = useOrders((s) => s.orders);
  const setStatus = useOrders((s) => s.setStatus);
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState<Payment | "all">("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [selected, setSelected] = useState<string[]>([]);

  const inTab = (id: TabId, status: string) => {
    const t = TABS.find((x) => x.id === id)!;
    return !t.statuses || (t.statuses as readonly string[]).includes(status);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => inTab(tab, o.status))
      .filter((o) => payment === "all" || o.payment === payment)
      .filter((o) => !q || `${o.id} ${o.customer.name} ${o.customer.email} ${o.trackingNo ?? ""}`.toLowerCase().includes(q))
      .sort((a, b) => (sort === "total" ? b.total - a.total : sort === "oldest" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt));
  }, [orders, tab, query, payment, sort]);

  const visibleSelected = selected.filter((id) => rows.some((r) => r.id === id));
  const allChecked = rows.length > 0 && visibleSelected.length === rows.length;
  const selectedOrders = orders.filter((o) => visibleSelected.includes(o.id));
  const canConfirm = selectedOrders.length > 0 && selectedOrders.every((o) => o.status === "pending");

  return (
    <>
      <h1 className="display text-4xl sm:text-5xl">Orders</h1>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-ink/10" role="tablist">
        {TABS.map((t) => {
          const count = orders.filter((o) => inTab(t.id, o.status)).length;
          return (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => { setTab(t.id); setSelected([]); }}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${tab === t.id ? "border-ember text-ink" : "border-transparent text-muted hover:text-ink"}`}>
              {t.label} <span className="ml-1 rounded-full bg-ink/5 px-2 py-0.5 text-xs">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="relative min-w-60 flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order ID, customer, tracking no."
            className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-ink" />
        </label>
        <select value={payment} onChange={(e) => setPayment(e.target.value as Payment | "all")} aria-label="Payment method"
          className="rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm">
          <option value="all">All payments</option>
          {(Object.keys(PAYMENT_LABEL) as Payment[]).map((p) => <option key={p} value={p}>{PAYMENT_LABEL[p]}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort"
          className="rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="total">Highest total</option>
        </select>
      </div>

      {visibleSelected.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-cream">
          <span>{visibleSelected.length} selected</span>
          <button disabled={!canConfirm} onClick={() => { visibleSelected.forEach((id) => setStatus(id, "processing", "Confirmed by seller")); setSelected([]); }}
            className="rounded-full bg-cream px-4 py-1.5 font-semibold text-ink disabled:opacity-40" title={canConfirm ? "" : "Only 'To Pay' orders can be confirmed"}>
            Confirm orders
          </button>
          <button onClick={() => window.print()} className="rounded-full border border-cream/30 px-4 py-1.5 font-semibold">Print list</button>
          <button onClick={() => setSelected([])} className="ml-auto text-cream/60 hover:text-cream">Clear</button>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="w-10 p-4">
                <input type="checkbox" aria-label="Select all" checked={allChecked}
                  onChange={() => setSelected(allChecked ? [] : rows.map((r) => r.id))} />
              </th>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {rows.length === 0 && (
              <tr><td colSpan={7} className="p-10 text-center text-muted">No orders here.</td></tr>
            )}
            {rows.map((o) => (
              <tr key={o.id} className="hover:bg-stone/30">
                <td className="p-4">
                  <input type="checkbox" aria-label={`Select ${o.id}`} checked={selected.includes(o.id)}
                    onChange={() => setSelected((s) => (s.includes(o.id) ? s.filter((x) => x !== o.id) : [...s, o.id]))} />
                </td>
                <td className="p-4">
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold hover:text-ember">{o.id}</Link>
                  <p className="text-xs text-muted">{fmtDate(o.createdAt)}</p>
                </td>
                <td className="p-4">
                  <p className="font-medium">{o.customer.name}</p>
                  <p className="text-xs text-muted">{o.customer.city}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-3">
                      {o.items.slice(0, 3).map((i) => (
                        <Image key={i.key} src={i.image} alt="" width={36} height={36} className="h-9 w-9 rounded-lg object-cover ring-2 ring-white" />
                      ))}
                    </div>
                    <span className="text-xs text-muted">{o.items.reduce((n, i) => n + i.quantity, 0)} pc</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">{peso(o.total)}</td>
                <td className="p-4">
                  <p>{PAYMENT_LABEL[o.payment]}</p>
                  <p className={`text-xs ${o.paymentStatus === "paid" ? "text-olive" : "text-muted"}`}>{o.paymentStatus}</p>
                </td>
                <td className="p-4"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
