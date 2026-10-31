"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Printer, Truck, X } from "lucide-react";
import { OrderStepper, OrderTimeline, StatusBadge, fmtDate } from "@/components/orders/OrderBits";
import { COURIERS, PAYMENT_LABEL } from "@/lib/orderStatus";
import { peso, SHIPPING } from "@/lib/products";
import { useOrders, type Order } from "@/store/orders";

const btn = "rounded-full px-5 py-2.5 text-sm font-semibold transition";
const primary = `${btn} bg-ink text-cream hover:bg-ember`;
const secondary = `${btn} border border-ink/15 hover:border-ink`;

function Actions({ order }: { order: Order }) {
  const setStatus = useOrders((s) => s.setStatus);
  const [modal, setModal] = useState<"ship" | "cancel" | null>(null);
  const [courier, setCourier] = useState<string>(COURIERS[0]);
  const [tracking, setTracking] = useState("");
  const [reason, setReason] = useState("Out of stock");
  const paid = order.paymentStatus === "paid";

  const cancel = () => {
    setStatus(order.id, "cancelled", `Cancelled by seller: ${reason}${paid ? " · payment refunded" : ""}`, paid ? { paymentStatus: "refunded" } : undefined);
    setModal(null);
  };
  const ship = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingNo = tracking.trim() || `PH${Math.floor(1e9 + Math.random() * 9e9)}`;
    setStatus(order.id, "shipped", `Picked up by ${courier} · ${trackingNo}`, { courier, trackingNo });
    setModal(null);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 print:hidden">
        {order.status === "pending" && (
          <button className={primary} onClick={() => setStatus(order.id, "processing", "Confirmed by seller")}>Confirm order</button>
        )}
        {order.status === "processing" && (
          <button className={`${primary} flex items-center gap-2`} onClick={() => setModal("ship")}><Truck size={16} /> Arrange shipment</button>
        )}
        {order.status === "shipped" && (
          <button className={primary} onClick={() => setStatus(order.id, "out_for_delivery", `${order.courier} rider is on the way`)}>Mark out for delivery</button>
        )}
        {order.status === "out_for_delivery" && (
          <button className={primary} onClick={() => setStatus(order.id, "delivered", order.payment === "cod" ? "Delivered · COD collected" : "Delivered", { paymentStatus: "paid" })}>
            Mark delivered
          </button>
        )}
        {order.status === "return_requested" && (
          <>
            <button className={primary} onClick={() => setStatus(order.id, "refunded", "Return approved · refund issued", { paymentStatus: "refunded" })}>Approve refund</button>
            <button className={secondary} onClick={() => setStatus(order.id, "delivered", "Return request rejected by seller")}>Reject return</button>
          </>
        )}
        {(order.status === "pending" || order.status === "processing") && (
          <button className={`${secondary} text-ember`} onClick={() => setModal("cancel")}>Cancel order</button>
        )}
        <button className={`${secondary} flex items-center gap-2`} onClick={() => window.print()}><Printer size={16} /> Packing slip</button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 print:hidden" onClick={() => setModal(null)}>
          <div className="animate-pop-in w-full max-w-md rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{modal === "ship" ? "Arrange shipment" : "Cancel order"}</h2>
              <button onClick={() => setModal(null)} aria-label="Close" className="rounded-full p-1 hover:bg-ink/5"><X size={18} /></button>
            </div>
            {modal === "ship" ? (
              <form onSubmit={ship} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Courier</span>
                  <select value={courier} onChange={(e) => setCourier(e.target.value)} className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm">
                    {COURIERS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Tracking number</span>
                  <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Leave blank to auto-generate"
                    className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm outline-none focus:border-ink" />
                </label>
                <button className={`${primary} w-full`}>Mark as shipped</button>
              </form>
            ) : (
              <div className="space-y-4">
                <select value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Reason" className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm">
                  {["Out of stock", "Buyer requested", "Invalid address", "Suspected fraud"].map((r) => <option key={r}>{r}</option>)}
                </select>
                {paid && <p className="text-sm text-muted">This order was prepaid — it will be marked as refunded.</p>}
                <button onClick={cancel} className={`${btn} w-full bg-ember text-white`}>Cancel order</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminOrderPage() {
  const { id } = useParams<{ id: string }>();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));
  const setNotes = useOrders((s) => s.setNotes);

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">Order {id} not found.</p>
        <Link href="/admin/orders" className="mt-4 inline-block font-semibold underline">Back to orders</Link>
      </div>
    );
  }

  const c = order.customer;
  return (
    <>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink print:hidden"><ArrowLeft size={14} /> Orders</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display flex items-center gap-3 text-4xl sm:text-5xl">{order.id}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">Placed {fmtDate(order.createdAt)} <StatusBadge status={order.status} /></p>
        </div>
        <Actions order={order} />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 print:hidden"><OrderStepper order={order} /></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6">
            <h2 className="font-bold">Items</h2>
            <ul className="mt-3 divide-y divide-ink/5">
              {order.items.map((i) => (
                <li key={i.key} className="flex items-center gap-4 py-3">
                  <Image src={i.image} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-xs text-muted">{i.brand} · US {i.size} · {peso(i.price)} × {i.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">{peso(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-ink/10 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{peso(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Shipping ({SHIPPING[order.shippingMethod].label})</dt><dd>{order.shippingFee ? peso(order.shippingFee) : "Free"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">VAT (12%)</dt><dd>{peso(order.tax)}</dd></div>
              <div className="flex justify-between pt-2 text-base font-bold"><dt>Total</dt><dd>{peso(order.total)}</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl bg-white p-6 print:hidden">
            <h2 className="font-bold">Internal notes</h2>
            <textarea defaultValue={order.adminNotes} onBlur={(e) => setNotes(order.id, e.target.value)} rows={3}
              placeholder="Only visible to admins. Saved when you click away."
              className="mt-3 w-full rounded-xl border border-ink/15 p-3 text-sm outline-none focus:border-ink" />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 text-sm">
            <h2 className="font-bold">Customer</h2>
            <p className="mt-3 font-medium">{c.name}</p>
            <p className="text-muted">{c.email}</p>
            <p className="text-muted">{c.phone}</p>
            <h3 className="mt-4 font-semibold">Ship to</h3>
            <p className="text-muted">{c.address}, {c.city} {c.postal}</p>
          </section>
          <section className="rounded-2xl bg-white p-6 text-sm">
            <h2 className="font-bold">Payment & delivery</h2>
            <dl className="mt-3 space-y-1.5">
              <div className="flex justify-between"><dt className="text-muted">Method</dt><dd>{PAYMENT_LABEL[order.payment]}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Status</dt><dd className="capitalize">{order.paymentStatus}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Courier</dt><dd>{order.courier ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Tracking no.</dt><dd className="font-mono">{order.trackingNo ?? "—"}</dd></div>
            </dl>
          </section>
          <section className="rounded-2xl bg-white p-6 print:hidden">
            <h2 className="mb-4 font-bold">History</h2>
            <OrderTimeline order={order} />
          </section>
        </div>
      </div>
    </>
  );
}
