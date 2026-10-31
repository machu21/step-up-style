"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Banknote, CheckCircle2, CreditCard, Loader2, Lock, Wallet } from "lucide-react";
import { CheckoutHeader } from "@/components/Header";
import { FREE_SHIPPING, peso, SHIPPING, TAX_RATE, type ShippingMethod } from "@/lib/products";
import { selectSubtotal, useCart, type CartItem } from "@/store/cart";
import { useOrders } from "@/store/orders";
import type { Payment } from "@/lib/orderStatus";

type Fields = { fullName: string; email: string; phone: string; address: string; city: string; postal: string; cardNumber: string; expiry: string; cvc: string };
type Errors = Partial<Record<keyof Fields, string>>;

const PAYMENTS: { id: Payment; label: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Credit Card", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
  { id: "wallet", label: "Digital Wallet", icon: Wallet },
];

function validate(f: Fields, payment: Payment): Errors {
  const e: Errors = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email";
  if (!/^(09|\+639)\d{9}$/.test(f.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a PH mobile number (09XX XXX XXXX)";
  if (f.address.trim().length < 5) e.address = "Enter your street address";
  if (f.city.trim().length < 2) e.city = "Enter your city";
  if (!/^\d{4}$/.test(f.postal.trim())) e.postal = "Postal code must be 4 digits";
  if (payment === "card") {
    if (!/^\d{16}$/.test(f.cardNumber.replace(/\s/g, ""))) e.cardNumber = "Card number must be 16 digits";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry)) e.expiry = "Use MM/YY";
    if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = "3–4 digits";
  }
  return e;
}

function Field({ label, name, value, error, onChange, className = "", ...rest }: { label: string; name: keyof Fields; value: string; error?: string; onChange: (n: keyof Fields, v: string) => void; className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "name" | "value">) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        aria-invalid={!!error}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-ink ${error ? "border-ember" : "border-ink/15"}`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-ember">{error}</span>}
    </label>
  );
}

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const clear = useCart((s) => s.clear);
  const placeOrder = useOrders((s) => s.place);
  const hydrated = useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
  const [fields, setFields] = useState<Fields>({ fullName: "", email: "", phone: "", address: "", city: "", postal: "", cardNumber: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [payment, setPayment] = useState<Payment>("card");
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<{ id: string; items: CartItem[]; total: number; email: string } | null>(null);

  const shippingFee = shipping === "standard" && subtotal >= FREE_SHIPPING ? 0 : SHIPPING[shipping].fee;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shippingFee + tax;

  const onChange = (n: keyof Fields, v: string) => {
    setFields((f) => ({ ...f, [n]: v }));
    if (errors[n]) setErrors((e) => ({ ...e, [n]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(fields, payment);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector<HTMLInputElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const placed = placeOrder({
        customer: { name: fields.fullName.trim(), email: fields.email.trim(), phone: fields.phone.trim(), address: fields.address.trim(), city: fields.city.trim(), postal: fields.postal.trim() },
        items,
        subtotal,
        shippingFee,
        tax,
        total,
        shippingMethod: shipping,
        payment,
      });
      setOrder({ id: placed.id, items, total, email: fields.email });
      clear();
      setSubmitting(false);
      window.scrollTo({ top: 0 });
    }, 1200);
  };

  if (order) {
    return (
      <>
        <CheckoutHeader />
        <main className="mx-auto flex max-w-xl flex-1 flex-col items-center px-4 py-20 text-center">
          <CheckCircle2 size={64} className="animate-pop-in text-olive" />
          <h1 className="display mt-6 text-5xl sm:text-6xl">Order {order.id} Placed</h1>
          <p className="mt-4 text-muted">
            Thanks! A confirmation was sent to <strong className="text-ink">{order.email}</strong>. We’ll notify you when it ships.
          </p>
          <ul className="mt-8 w-full divide-y divide-ink/10 rounded-3xl bg-white p-4 text-left">
            {order.items.map((i) => (
              <li key={i.key} className="flex items-center gap-3 py-3">
                <Image src={i.image} alt="" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
                <span className="flex-1 text-sm">{i.name} · US {i.size} × {i.quantity}</span>
                <span className="text-sm font-semibold">{peso(i.price * i.quantity)}</span>
              </li>
            ))}
            <li className="flex justify-between pt-3 font-bold"><span>Order total</span><span>{peso(order.total)}</span></li>
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/track?id=${order.id}`} className="rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-ember">
              Track your order
            </Link>
            <Link href="/" className="rounded-full border border-ink/15 px-8 py-4 text-sm font-semibold hover:border-ink">
              Continue shopping
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (!hydrated) {
    return (
      <>
        <CheckoutHeader />
        <main className="grid flex-1 place-items-center"><Loader2 className="animate-spin text-muted" /></main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <CheckoutHeader />
        <main className="mx-auto flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="display text-5xl">Your bag is empty</h1>
          <p className="mt-3 text-muted">Add a pair before checking out.</p>
          <Link href="/#best-sellers" className="mt-8 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-ember">Shop best sellers</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <CheckoutHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="display text-5xl sm:text-6xl">Checkout</h1>
        <form onSubmit={submit} noValidate className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-10">
            <section>
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold"><span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs text-cream">1</span>Shipping address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" name="fullName" value={fields.fullName} error={errors.fullName} onChange={onChange} autoComplete="name" />
                <Field label="Email" name="email" type="email" value={fields.email} error={errors.email} onChange={onChange} autoComplete="email" />
                <Field label="Mobile number" name="phone" type="tel" inputMode="tel" placeholder="0917 123 4567" value={fields.phone} error={errors.phone} onChange={onChange} autoComplete="tel" className="sm:col-span-2" />
                <Field label="Address" name="address" value={fields.address} error={errors.address} onChange={onChange} autoComplete="street-address" className="sm:col-span-2" />
                <Field label="City" name="city" value={fields.city} error={errors.city} onChange={onChange} autoComplete="address-level2" />
                <Field label="Postal code" name="postal" inputMode="numeric" maxLength={4} value={fields.postal} error={errors.postal} onChange={onChange} autoComplete="postal-code" />
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold"><span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs text-cream">2</span>Delivery method</h2>
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                {(Object.keys(SHIPPING) as ShippingMethod[]).map((m) => {
                  const fee = m === "standard" && subtotal >= FREE_SHIPPING ? 0 : SHIPPING[m].fee;
                  return (
                    <button type="button" role="radio" aria-checked={shipping === m} key={m} onClick={() => setShipping(m)}
                      className={`rounded-2xl border p-4 text-left transition ${shipping === m ? "border-ink bg-white ring-1 ring-ink" : "border-ink/15 hover:border-ink/40"}`}>
                      <span className="flex justify-between font-semibold"><span>{SHIPPING[m].label}</span><span>{fee === 0 ? "Free" : peso(fee)}</span></span>
                      <span className="text-xs text-muted">{SHIPPING[m].eta}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold"><span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs text-cream">3</span>Payment</h2>
              <div className="grid grid-cols-3 gap-3" role="radiogroup">
                {PAYMENTS.map(({ id, label, icon: Icon }) => (
                  <button type="button" role="radio" aria-checked={payment === id} key={id} onClick={() => setPayment(id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center text-xs font-semibold transition sm:text-sm ${payment === id ? "border-ink bg-ink text-cream" : "border-ink/15 hover:border-ink/40"}`}>
                    <Icon size={20} />{label}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                {payment === "card" && (
                  <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-4">
                    <Field label="Card number" name="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" maxLength={19} value={fields.cardNumber} error={errors.cardNumber} onChange={onChange} autoComplete="off" className="col-span-2" />
                    <Field label="Expiry" name="expiry" placeholder="MM/YY" maxLength={5} value={fields.expiry} error={errors.expiry} onChange={onChange} autoComplete="off" />
                    <Field label="CVC" name="cvc" inputMode="numeric" maxLength={4} value={fields.cvc} error={errors.cvc} onChange={onChange} autoComplete="off" />
                    <p className="col-span-2 text-xs text-muted">Demo checkout — no real payment is processed.</p>
                  </div>
                )}
                {payment === "cod" && <p className="rounded-2xl bg-white p-4 text-sm text-muted">Pay in cash when your order arrives. Please prepare the exact amount.</p>}
                {payment === "wallet" && <p className="rounded-2xl bg-white p-4 text-sm text-muted">You’ll be redirected to GCash / Maya to approve the payment (simulated).</p>}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 lg:sticky lg:top-6">
            <h2 className="display text-3xl">Order summary</h2>
            <ul className="mt-4 divide-y divide-ink/10">
              {items.map((i) => (
                <li key={i.key} className="flex items-center gap-3 py-3">
                  <div className="relative">
                    <Image src={i.image} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-cream">{i.quantity}</span>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-xs text-muted">US {i.size}</p>
                  </div>
                  <span className="text-sm font-semibold">{peso(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{peso(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Shipping ({SHIPPING[shipping].label})</dt><dd>{shippingFee === 0 ? "Free" : peso(shippingFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">VAT (12%)</dt><dd>{peso(tax)}</dd></div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-bold"><dt>Total</dt><dd>{peso(total)}</dd></div>
            </dl>
            <button disabled={submitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-wider text-cream transition hover:bg-ember disabled:opacity-70">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {submitting ? "Placing order…" : `Place order · ${peso(total)}`}
            </button>
          </aside>
        </form>
      </main>
    </>
  );
}
