"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const SHOP_LINKS = [
  ["Shop All", "/shop"],
  ["New Arrivals", "/shop?sort=newest"],
  ["Men", "/shop?gender=Men"],
  ["Women", "/shop?gender=Women"],
  ["Basketball", "/shop?category=Basketball"],
  ["Track Order", "/track"],
  ["My Orders", "/orders"],
] as const;

const COLUMNS = [
  { title: "Support", links: ["Contact Us", "Size Guide", "Shipping & Delivery", "Returns", "FAQs"] },
  { title: "Social", links: ["Facebook", "Instagram", "TikTok"] },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(/^\S+@\S+\.\S+$/.test(email) ? "done" : "error");
  };

  return (
    <footer className="overflow-hidden bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="display text-3xl">Join the crew</p>
          <p className="mt-2 max-w-sm text-sm text-cream/60">Early drops, restocks and members-only pricing. No spam, ever.</p>
          {state === "done" ? (
            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-olive">
              <Check size={16} className="text-[#b5c26a]" /> <span className="text-[#b5c26a]">You’re on the list. Welcome!</span>
            </p>
          ) : (
            <form onSubmit={submit} className="mt-6 flex max-w-sm gap-2" noValidate>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setState("idle");
                }}
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                aria-invalid={state === "error"}
                className={`flex-1 rounded-full border bg-transparent px-5 py-3 text-sm outline-none placeholder:text-cream/40 ${
                  state === "error" ? "border-ember" : "border-cream/20 focus:border-cream"
                }`}
              />
              <button className="flex items-center gap-1 rounded-full bg-cream px-5 text-sm font-semibold text-ink hover:bg-ember hover:text-cream">
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          )}
          {state === "error" && <p className="mt-2 text-xs text-ember">Enter a valid email address.</p>}
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="mb-4 text-sm font-semibold">Shop</p>
            <ul className="space-y-2.5 text-sm text-cream/60">
              {SHOP_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-cream">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-sm font-semibold">{col.title}</p>
              <ul className="space-y-2.5 text-sm text-cream/60">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href={l === "Facebook" ? "https://www.facebook.com/stepupstyleco" : l === "Instagram" ? "https://www.instagram.com/stepupstyleco__" : "#"} className="hover:text-cream">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="display select-none whitespace-nowrap px-2 text-center text-[13.5vw] leading-[0.8] tracking-tight" aria-hidden>
        Step-Up-Style
      </p>
      <div className="mx-auto flex max-w-7xl justify-between px-4 py-6 text-xs text-cream/40 sm:px-6">
        <span>Privacy Policy</span>
        <span>© 2026 Step-Up-Style. All rights reserved.</span>
        <span>Terms of Service</span>
      </div>
    </footer>
  );
}
