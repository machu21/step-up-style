"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShippingMethod } from "@/lib/products";
import type { OrderStatus, Payment } from "@/lib/orderStatus";
import { makeMockOrders } from "@/lib/mockOrders";
import type { CartItem } from "./cart";

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
}

export interface TimelineEntry {
  status: OrderStatus;
  at: number;
  note?: string;
}

export interface Order {
  id: string;
  createdAt: number;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingMethod: ShippingMethod;
  payment: Payment;
  paymentStatus: "paid" | "unpaid" | "refunded";
  status: OrderStatus;
  timeline: TimelineEntry[];
  courier?: string;
  trackingNo?: string;
  adminNotes?: string;
}

export type NewOrder = Omit<Order, "id" | "createdAt" | "status" | "timeline" | "paymentStatus">;

interface OrdersState {
  orders: Order[];
  /** Orders placed from this browser — stands in for a customer account. */
  myOrderIds: string[];
  seeded: boolean;
  seed: () => void;
  reset: () => void;
  place: (o: NewOrder) => Order;
  setStatus: (id: string, status: OrderStatus, note?: string, patch?: Partial<Order>) => void;
  setNotes: (id: string, notes: string) => void;
}

const newId = (taken: Order[]) => {
  let id: string;
  do id = `SUS-${Math.floor(1000 + Math.random() * 9000)}`;
  while (taken.some((o) => o.id === id));
  return id;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      myOrderIds: [],
      seeded: false,
      seed: () => {
        if (!get().seeded) set({ orders: makeMockOrders(Date.now()), seeded: true });
      },
      reset: () => set({ orders: makeMockOrders(Date.now()), myOrderIds: [], seeded: true }),
      place: (o) => {
        const now = Date.now();
        const paid = o.payment !== "cod";
        // COD orders wait for seller confirmation; prepaid orders go straight to packing.
        const timeline: TimelineEntry[] = [{ status: "pending", at: now, note: paid ? "Payment received" : "Awaiting seller confirmation" }];
        if (paid) timeline.push({ status: "processing", at: now });
        const order: Order = {
          ...o,
          id: newId(get().orders),
          createdAt: now,
          status: paid ? "processing" : "pending",
          paymentStatus: paid ? "paid" : "unpaid",
          timeline,
        };
        set((s) => ({ orders: [order, ...s.orders], myOrderIds: [order.id, ...s.myOrderIds] }));
        return order;
      },
      setStatus: (id, status, note, patch) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, ...patch, status, timeline: [...o.timeline, { status, at: Date.now(), note }] } : o,
          ),
        })),
      setNotes: (id, adminNotes) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, adminNotes } : o)) })),
    }),
    // Rehydrated manually in <Providers>, like the cart.
    { name: "sus-orders", skipHydration: true },
  ),
);

/** True once the orders store has loaded from localStorage (and been seeded). */
export function useOrdersReady() {
  return useSyncExternalStore(
    (cb) => useOrders.persist.onFinishHydration(cb),
    () => useOrders.persist.hasHydrated(),
    () => false,
  );
}

/** Demo-only admin session. There is no real authentication here. */
export const ADMIN_EMAIL = "admin@stepupstyle.ph";
export const ADMIN_PASSWORD = "stepup2026";

interface AuthState {
  admin: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      login: (email, password) => {
        const ok = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
        if (ok) set({ admin: ADMIN_EMAIL });
        return ok;
      },
      logout: () => set({ admin: null }),
    }),
    { name: "sus-admin", skipHydration: true },
  ),
);

export function useAuthReady() {
  return useSyncExternalStore(
    (cb) => useAuth.persist.onFinishHydration(cb),
    () => useAuth.persist.hasHydrated(),
    () => false,
  );
}
