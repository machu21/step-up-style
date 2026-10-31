import type { Order, TimelineEntry } from "@/store/orders";
import { COURIERS, FLOW, type OrderStatus, type Payment } from "./orderStatus";
import { FREE_SHIPPING, products, SHIPPING, SIZES, TAX_RATE } from "./products";

const NAMES = [
  "Maria Santos", "Juan Dela Cruz", "Angelica Reyes", "Mark Villanueva", "Kristine Bautista", "Paolo Garcia",
  "Bea Mendoza", "Carlo Ramos", "Jasmine Torres", "Miguel Aquino", "Patricia Flores", "Rafael Navarro",
];
const PLACES = [
  ["Quezon City", "1100"], ["Makati", "1200"], ["Pasig", "1600"], ["Cebu City", "6000"], ["Davao City", "8000"],
  ["Taguig", "1630"], ["Baguio", "2600"], ["Iloilo City", "5000"],
] as const;
const STREETS = ["Rizal St.", "Mabini Ave.", "Bonifacio Rd.", "Luna St.", "Katipunan Ave.", "Aguinaldo Hwy."];

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

// Deterministic PRNG so the demo data looks the same after every reset.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const PLAN: OrderStatus[] = [
  "pending", "pending", "pending", "processing", "processing", "processing", "processing", "shipped", "shipped",
  "out_for_delivery", "delivered", "delivered", "delivered", "delivered", "delivered", "delivered", "delivered",
  "delivered", "cancelled", "cancelled", "return_requested", "refunded", "processing", "shipped", "delivered",
];

// Roughly how many days old an order in each status is.
const AGE: Record<OrderStatus, number> = {
  pending: 0, processing: 0.5, shipped: 1.5, out_for_delivery: 2.5, delivered: 3, cancelled: 1, return_requested: 6, refunded: 8,
};

function stepsTo(status: OrderStatus): OrderStatus[] {
  if (status === "cancelled") return ["cancelled"];
  if (status === "return_requested") return [...FLOW.slice(1), "return_requested"];
  if (status === "refunded") return [...FLOW.slice(1), "return_requested", "refunded"];
  return FLOW.slice(1, FLOW.indexOf(status) + 1);
}

export function makeMockOrders(now: number): Order[] {
  const r = rng(42);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)];

  return PLAN.map((status, i): Order => {
    // Spread delivered orders over the past two weeks so the revenue chart has shape.
    const extra = status === "delivered" ? r() * 11 : r() * 1.2;
    const createdAt = now - (AGE[status] + extra) * DAY - Math.floor(r() * 8 + 1) * HOUR;
    const items = Array.from({ length: 1 + Math.floor(r() * 2) }, (_, j) => {
      const p = pick(products);
      const size = pick(SIZES);
      return { key: `${p.id}-${size}-${j}`, id: p.id, name: p.name, brand: p.brand, price: p.price, size, quantity: r() < 0.8 ? 1 : 2, image: p.image };
    });
    const subtotal = items.reduce((n, it) => n + it.price * it.quantity, 0);
    const shippingMethod = r() < 0.75 ? "standard" : "express";
    const shippingFee = shippingMethod === "standard" && subtotal >= FREE_SHIPPING ? 0 : SHIPPING[shippingMethod].fee;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    // Prepaid orders skip "pending", so anything still awaiting confirmation is COD.
    const payment: Payment = status === "pending" ? "cod" : pick(["cod", "cod", "card", "wallet"] as const);
    const name = NAMES[i % NAMES.length];
    const [city, postal] = pick(PLACES);

    const steps = stepsTo(status);
    const timeline: TimelineEntry[] = [{ status: "pending", at: createdAt }];
    const span = Math.max(now - HOUR - createdAt, 0);
    steps.forEach((s, k) => {
      timeline.push({
        status: s,
        at: createdAt + (span * (k + 1)) / (steps.length + 0.5),
        note: s === "cancelled" ? "Cancelled by buyer: changed mind" : s === "return_requested" ? "Buyer reason: wrong size received" : undefined,
      });
    });

    const shipped = steps.includes("shipped");
    return {
      id: `SUS-${2000 + i * 137}`,
      createdAt,
      customer: {
        name,
        email: `${name.split(" ")[0].toLowerCase()}@example.com`,
        phone: `09${Math.floor(100000000 + r() * 899999999)}`,
        address: `${10 + Math.floor(r() * 990)} ${pick(STREETS)}`,
        city,
        postal,
      },
      items,
      subtotal,
      shippingFee,
      tax,
      total: subtotal + shippingFee + tax,
      shippingMethod,
      payment,
      paymentStatus: status === "refunded" ? "refunded" : payment !== "cod" || steps.includes("delivered") ? "paid" : "unpaid",
      status,
      timeline,
      ...(shipped && { courier: pick(COURIERS), trackingNo: `PH${Math.floor(1e9 + r() * 9e9)}` }),
    };
  }).sort((a, b) => b.createdAt - a.createdAt);
}
