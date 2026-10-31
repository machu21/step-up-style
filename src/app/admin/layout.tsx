import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Seller Center — Step-Up-Style",
};

// Admin data lives in localStorage, so there is no server-rendered shell to validate.
export const instant = false;

// The shell reads the URL and localStorage, so it renders entirely on the client.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<main className="grid flex-1 place-items-center"><Loader2 className="animate-spin text-muted" /></main>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
