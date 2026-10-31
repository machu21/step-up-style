"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useAuth, useOrders } from "@/store/orders";
import { CartDrawer } from "./CartDrawer";
import { QuickView } from "./QuickView";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCart.persist.rehydrate();
    useAuth.persist.rehydrate();
    // Seed demo orders on first visit, once whatever is in localStorage has loaded.
    Promise.resolve(useOrders.persist.rehydrate()).then(() => useOrders.getState().seed());
  }, []);

  return (
    <>
      {children}
      <CartDrawer />
      <QuickView />
    </>
  );
}
