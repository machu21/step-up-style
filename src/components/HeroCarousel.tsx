"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { u } from "@/lib/products";

const SLIDES = [
  {
    eyebrow: "FW ’26 Collection",
    title: ["Driven by", "Comfort"],
    copy: "Premium comfort in every step — streetwear silhouettes engineered for the way you move.",
    cta: { label: "Shop Collection", href: "/shop" },
    img: u("1556906781-9a412961c28c", 2400),
    alt: "Sneakers on a city street",
  },
  {
    eyebrow: "Court Series",
    title: ["Own the", "Hardwood"],
    copy: "Lockdown fit, zoned cushioning and herringbone grip built for hard cuts and late-game legs.",
    cta: { label: "Shop Basketball", href: "/shop?category=Basketball" },
    img: u("1546519638-68e109498ffc", 2400),
    alt: "Basketball player driving to the hoop",
  },
  {
    eyebrow: "Run Lab",
    title: ["Built for", "Every Mile"],
    copy: "Responsive foams and breathable knits for tempo days, long runs and everything between.",
    cta: { label: "Shop Running", href: "/shop?category=Running" },
    img: u("1571008887538-b36bb32f4571", 2400),
    alt: "Runner on an open road",
  },
];

const INTERVAL = 6000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  return (
    <section
      className="relative isolate h-[calc(100svh-4rem)] min-h-[560px] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
    >
      {SLIDES.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.img}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}`}
            aria-hidden={!active}
            inert={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ${active ? "z-10 opacity-100" : "opacity-0"}`}
          >
            <Image
              src={s.img}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[7000ms] ease-out ${active ? "scale-105" : "scale-100"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/10" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-28">
              <div className={`text-cream transition-all delay-200 duration-700 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
                <p className="mb-4 inline-block rounded-full border border-cream/30 px-3 py-1 text-xs uppercase tracking-widest">{s.eyebrow}</p>
                {i === 0 ? (
                  <h1 className="display text-[19vw] sm:text-[12vw] lg:text-[10rem]">
                    {s.title[0]}
                    <br />
                    {s.title[1]}
                  </h1>
                ) : (
                  <h2 className="display text-[19vw] sm:text-[12vw] lg:text-[10rem]">
                    {s.title[0]}
                    <br />
                    {s.title[1]}
                  </h2>
                )}
                <p className="mt-4 max-w-sm text-cream/75">{s.copy}</p>
                <Link href={s.cta.href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink transition hover:bg-ember hover:text-cream">
                  {s.cta.label} <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-8 sm:px-6">
        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.img}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className="relative h-1 w-10 overflow-hidden rounded-full bg-cream/25 sm:w-16"
            >
              {/* Keyed so the fill animation restarts whenever the slide changes. */}
              <span
                key={i === index ? `on-${index}` : "off"}
                className={`absolute inset-y-0 left-0 rounded-full bg-cream ${i === index ? (paused ? "w-full" : "animate-hero-progress") : i < index ? "w-full" : "w-0"}`}
                style={{ animationDuration: `${INTERVAL}ms` }}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => go(index - 1)} className="rounded-full border border-cream/30 p-2.5 text-cream backdrop-blur transition hover:bg-cream hover:text-ink" aria-label="Previous slide">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => go(index + 1)} className="rounded-full border border-cream/30 p-2.5 text-cream backdrop-blur transition hover:bg-cream hover:text-ink" aria-label="Next slide">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
