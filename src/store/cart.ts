"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, Product } from "@/lib/products";

export interface CartItem {
  key: string;
  id: string;
  name: string;
  brand: string;
  price: number;
  size: number;
  quantity: number;
  image: string;
}

const MAX_QTY = 10;

interface CartState {
  items: CartItem[];
  add: (p: Product, size: number, quantity: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (p, size, quantity) =>
        set((s) => {
          const key = `${p.id}-${size}`;
          if (s.items.some((i) => i.key === key)) {
            return {
              items: s.items.map((i) =>
                i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QTY) } : i,
              ),
            };
          }
          return {
            items: [
              ...s.items,
              { key, id: p.id, name: p.name, brand: p.brand, price: p.price, size, quantity, image: p.image },
            ],
          };
        }),
      setQuantity: (key, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.key !== key)
              : s.items.map((i) => (i.key === key ? { ...i, quantity: Math.min(quantity, MAX_QTY) } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    // Rehydrated manually in <Providers> so server and first client render match.
    { name: "sus-cart", skipHydration: true },
  ),
);

export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (s: CartState) => s.items.reduce((n, i) => n + i.price * i.quantity, 0);

interface UiState {
  drawerOpen: boolean;
  quickViewId: string | null;
  category: Category | "All";
  setCategory: (c: Category | "All") => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;
}

export const useUi = create<UiState>()((set) => ({
  drawerOpen: false,
  quickViewId: null,
  category: "All",
  setCategory: (category) => set({ category }),
  openDrawer: () => set({ drawerOpen: true, quickViewId: null }),
  closeDrawer: () => set({ drawerOpen: false }),
  openQuickView: (id) => set({ quickViewId: id }),
  closeQuickView: () => set({ quickViewId: null }),
}));
