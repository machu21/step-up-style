import { Check, X } from "lucide-react";
import { FLOW, STATUS, type OrderStatus } from "@/lib/orderStatus";
import type { Order } from "@/store/orders";

export const fmtDate = (t: number) =>
  new Date(t).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function StatusBadge({ status, customer = false }: { status: OrderStatus; customer?: boolean }) {
  const s = STATUS[status];
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${s.className}`}>
      {customer ? s.customer : s.label}
    </span>
  );
}

/** Horizontal progress bar over the happy path; off-path statuses show as a banner instead. */
export function OrderStepper({ order }: { order: Order }) {
  const idx = FLOW.indexOf(order.status);
  if (idx === -1) {
    const returnFlow = order.status === "return_requested" || order.status === "refunded";
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-stone/60 p-4 text-sm">
        <X size={18} className="text-ember" />
        <span className="font-semibold">{STATUS[order.status].customer}</span>
        {returnFlow && <span className="text-muted">— delivered order is being returned</span>}
      </div>
    );
  }
  return (
    <ol className="grid grid-cols-5 gap-1">
      {FLOW.map((s, i) => {
        const done = i <= idx;
        const at = order.timeline.findLast((t) => t.status === s)?.at;
        return (
          <li key={s} className="flex flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done ? "bg-olive" : "bg-ink/10"}`} />
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${done ? "bg-olive text-white" : "bg-ink/10 text-muted"}`}>
                {done ? <Check size={16} /> : <span className="text-xs">{i + 1}</span>}
              </span>
              <span className={`h-0.5 flex-1 ${i === FLOW.length - 1 ? "invisible" : i < idx ? "bg-olive" : "bg-ink/10"}`} />
            </div>
            <span className={`mt-2 text-[11px] font-semibold leading-tight sm:text-xs ${done ? "" : "text-muted"}`}>{STATUS[s].customer}</span>
            {at && <span className="mt-0.5 hidden text-[10px] text-muted sm:block">{fmtDate(at)}</span>}
          </li>
        );
      })}
    </ol>
  );
}

/** Full history, newest first. */
export function OrderTimeline({ order }: { order: Order }) {
  const entries = [...order.timeline].reverse();
  return (
    <ol className="relative space-y-5 border-l border-ink/10 pl-6">
      {entries.map((t, i) => (
        <li key={i} className="relative">
          <span className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${i === 0 ? "bg-ember" : "bg-ink/25"}`} />
          <p className={`text-sm font-semibold ${i === 0 ? "" : "text-ink/70"}`}>{STATUS[t.status].customer}</p>
          {t.note && <p className="text-sm text-muted">{t.note}</p>}
          <p className="text-xs text-muted">{fmtDate(t.at)}</p>
        </li>
      ))}
    </ol>
  );
}
