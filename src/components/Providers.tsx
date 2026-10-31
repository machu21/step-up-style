"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { CartDrawer } from "./CartDrawer";
import { QuickView } from "./QuickView";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  return (
    <>
      {children}
      <CartDrawer />
      <QuickView />
    </>
  );
}
