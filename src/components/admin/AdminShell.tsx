"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ExternalLink, LayoutDashboard, Loader2, LogOut, Package, RotateCcw } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth, useAuthReady, useOrders, useOrdersReady } from "@/store/orders";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: Package },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAuth((s) => s.admin);
  const logout = useAuth((s) => s.logout);
  const reset = useOrders((s) => s.reset);
  const authReady = useAuthReady();
  const ordersReady = useOrdersReady();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (authReady && !admin && !isLogin) router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [authReady, admin, isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;

  if (!authReady || !ordersReady || !admin) {
    return <main className="grid flex-1 place-items-center"><Loader2 className="animate-spin text-muted" /></main>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone/40 lg:flex-row">
      <aside className="flex shrink-0 flex-col gap-1 border-b border-ink/10 bg-ink p-4 text-cream lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:border-b-0 print:hidden">
        <div className="mb-2 flex items-center justify-between lg:mb-6 lg:block">
          <div className="rounded-xl bg-cream px-3 py-2 text-ink"><Logo /></div>
          <p className="mt-2 hidden text-xs uppercase tracking-widest text-cream/50 lg:block">Seller Center</p>
        </div>
        <nav className="flex gap-1 lg:flex-col">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-cream text-ink" : "text-cream/70 hover:bg-cream/10 hover:text-cream"}`}>
                <Icon size={18} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-2 flex flex-wrap gap-1 text-sm lg:mt-auto lg:flex-col">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-cream/60 hover:text-cream"><ExternalLink size={16} /> View store</Link>
          <button
            onClick={() => confirm("Reset all orders to the demo data? Orders placed in this browser will be removed.") && reset()}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-cream/60 hover:text-cream"
          >
            <RotateCcw size={16} /> Reset demo data
          </button>
          <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-cream/60 hover:text-cream">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
