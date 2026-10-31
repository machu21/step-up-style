"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ADMIN_EMAIL, ADMIN_PASSWORD, useAuth, useAuthReady } from "@/store/orders";

export default function AdminLoginPage() {
  const router = useRouter();
  const admin = useAuth((s) => s.admin);
  const login = useAuth((s) => s.login);
  const ready = useAuthReady();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const goNext = () => {
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(next?.startsWith("/admin") ? next : "/admin");
  };

  useEffect(() => {
    if (ready && admin) goNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, admin]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email, password)) setError("Incorrect email or password.");
  };

  return (
    <main className="grid flex-1 place-items-center bg-stone/40 px-4 py-16">
      <form onSubmit={submit} noValidate className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <Logo />
        <h1 className="display mt-6 text-4xl">Seller Center</h1>
        <p className="mt-1 text-sm text-muted">Log in to manage orders.</p>
        <label className="mt-6 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Email</span>
          <input type="email" autoComplete="username" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm outline-none focus:border-ink" />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Password</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm outline-none focus:border-ink" />
        </label>
        {error && <p className="mt-3 text-sm text-ember" role="alert">{error}</p>}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-bold uppercase tracking-wider text-cream hover:bg-ember">
          <Lock size={16} /> Log in
        </button>
        <p className="mt-6 rounded-xl bg-stone/60 p-3 text-xs text-muted">
          Demo only — no real authentication. Use <strong className="text-ink">{ADMIN_EMAIL}</strong> / <strong className="text-ink">{ADMIN_PASSWORD}</strong>.
        </p>
      </form>
    </main>
  );
}
