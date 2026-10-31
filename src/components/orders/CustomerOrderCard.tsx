"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PAYMENT_LABEL } from "@/lib/orderStatus";
import { peso, SHIPPING } from "@/lib/products";
import { useOrders, type Order } from "@/store/orders";
import { OrderStepper, OrderTimeline, StatusBadge, fmtDate } from "./OrderBits";

export function CustomerOrderCard({ order, defaultOpen = false }: { order: Order; defaultOpen?: boolean }) {
  const setStatus = useOrders((s) => s.setStatus);
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="rounded-3xl bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold">Order {order.id}</p>
          <p className="text-xs text-muted">Placed {fmtDate(order.createdAt)} · {PAYMENT_LABEL[order.payment]}</p>
        </div>
        <StatusBadge status={order.status} customer />
      </div>

      <div className="mt-5"><OrderStepper order={order} /></div>

      {order.trackingNo && (
        <p className="mt-5 rounded-2xl bg-stone/60 p-3 text-sm">
          <span className="text-muted">Courier:</span> <strong>{order.courier}</strong> · <span className="text-muted">Tracking no.</span> <strong className="font-mono">{order.trackingNo}</strong>
        </p>
      )}

      <ul className="mt-5 divide-y divide-ink/5">
        {order.items.map((i) => (
          <li key={i.key} className="flex items-center gap-3 py-2.5">
            <Image src={i.image} alt="" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
            <span className="flex-1 text-sm">{i.name} · US {i.size} × {i.quantity}</span>
            <span className="text-sm font-semibold">{peso(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex justify-between border-t border-ink/10 pt-3 font-bold"><span>Total</span><span>{peso(order.total)}</span></p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {order.status === "pending" && (
          <button onClick={() => confirm("Cancel this order?") && setStatus(order.id, "cancelled", "Cancelled by buyer")}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ember hover:border-ember">Cancel order</button>
        )}
        {order.status === "delivered" && (
          <button onClick={() => confirm("Request a return/refund for this order?") && setStatus(order.id, "return_requested", "Buyer requested a return")}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:border-ink">Request return</button>
        )}
        <button onClick={() => setOpen((v) => !v)} aria-expanded={open}
          className="ml-auto flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
          {open ? "Hide" : "Show"} details <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="mt-5 grid gap-6 border-t border-ink/10 pt-5 sm:grid-cols-2">
          <OrderTimeline order={order} />
          <div className="text-sm">
            <p className="font-semibold">Delivery address</p>
            <p className="text-muted">{order.customer.name}<br />{order.customer.address}, {order.customer.city} {order.customer.postal}</p>
            <p className="mt-3 font-semibold">Shipping</p>
            <p className="text-muted">{SHIPPING[order.shippingMethod].label} · {SHIPPING[order.shippingMethod].eta}</p>
          </div>
        </div>
      )}
    </article>
  );
}
