export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "refunded";

export const STATUS: Record<OrderStatus, { label: string; customer: string; className: string }> = {
  pending: { label: "To Pay / Confirm", customer: "Order placed", className: "bg-amber-100 text-amber-800" },
  processing: { label: "To Ship", customer: "Preparing your order", className: "bg-sky-100 text-sky-800" },
  shipped: { label: "Shipped", customer: "Handed to courier", className: "bg-indigo-100 text-indigo-800" },
  out_for_delivery: { label: "Out for Delivery", customer: "Out for delivery", className: "bg-violet-100 text-violet-800" },
  delivered: { label: "Completed", customer: "Delivered", className: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", customer: "Cancelled", className: "bg-ink/10 text-ink/60" },
  return_requested: { label: "Return Requested", customer: "Return requested", className: "bg-rose-100 text-rose-800" },
  refunded: { label: "Refunded", customer: "Refunded", className: "bg-ink/10 text-ink/60" },
};

/** The happy path, used for the progress stepper. */
export const FLOW: OrderStatus[] = ["pending", "processing", "shipped", "out_for_delivery", "delivered"];

/** Seller-center tabs, Shopee style. */
export const TABS = [
  { id: "all", label: "All", statuses: null },
  { id: "to-pay", label: "To Pay", statuses: ["pending"] },
  { id: "to-ship", label: "To Ship", statuses: ["processing"] },
  { id: "shipping", label: "Shipping", statuses: ["shipped", "out_for_delivery"] },
  { id: "completed", label: "Completed", statuses: ["delivered"] },
  { id: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
  { id: "returns", label: "Returns", statuses: ["return_requested", "refunded"] },
] as const satisfies readonly { id: string; label: string; statuses: readonly OrderStatus[] | null }[];

export type TabId = (typeof TABS)[number]["id"];

export const COURIERS = ["J&T Express", "LBC", "Ninja Van", "Flash Express"] as const;

export const PAYMENT_LABEL = { card: "Credit Card", cod: "Cash on Delivery", wallet: "GCash / Maya" } as const;
export type Payment = keyof typeof PAYMENT_LABEL;
