import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductRail, QuickViewButton } from "@/components/ProductRail";
import { bestSellers, featured, newArrivals, peso, u } from "@/lib/products";

function SectionTitle({ lead, accent, tail, sub }: { lead: string; accent: string; tail?: string; sub: string }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="display text-4xl sm:text-6xl">
        {lead} <span className="outline-text">{accent}</span> {tail}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">{sub}</p>
    </div>
  );
}

function Pill({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span className={`relative mx-2 inline-block h-[0.95em] w-[2.2em] overflow-hidden rounded-full align-[-0.12em] ${className}`}>
      <Image src={src} alt="" fill sizes="120px" className="object-cover" />
    </span>
  );
}

const btnDark = "inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-ember";

const REVIEWS = [
  { name: "Andrea M.", text: "Wore the Aero Run 2 for a half-marathon straight out of the box. Zero hotspots and the cushioning still feels fresh.", product: "Aero Run 2", avatar: u("1494790108377-be9c29b29330", 120) },
  { name: "Paolo R.", text: "Hoop Elite fits true to size and the traction on our outdoor court is unreal. Fast shipping to Cebu too.", product: "Hoop Elite Mid", avatar: u("1500648767791-00dcc994a43e", 120) },
];

const SPORTS = [
  { label: "Built for the Hardwood", href: "/shop?category=Basketball", img: u("1546519638-68e109498ffc", 700), tone: "bg-cobalt" },
  { label: "Own the Court", href: "/shop?category=Casual", img: u("1554068865-24cecd4e34b8", 700), tone: "bg-olive" },
  { label: "Run Further, Recover Faster", href: "/shop?category=Running", img: u("1571008887538-b36bb32f4571", 700), tone: "bg-ember" },
  { label: "Gear Up for Match Day", href: "/shop?sort=rating", img: u("1579952363873-27f3bade9f55", 700), tone: "bg-ink" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* 2. Hero */}
        <HeroCarousel />

        {/* 3. Narrative banner */}
        <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
          <p className="text-2xl font-semibold leading-snug tracking-tight sm:text-4xl">
            Step into the
            <Pill src={u("1542291026-7eec264c27ff", 300)} />
            <span className="text-muted">city with a collection that defines</span> modern streetwear, balancing bold
            <Pill src={u("1525966222134-fcfa99b8ae77", 300)} />
            aesthetics <span className="text-muted">with effortless</span>
            <Pill src={u("1552674605-db6ffd4facb5", 300)} />
            comfort.
          </p>
        </section>

        {/* 4. Editorial story grid */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <SectionTitle lead="Innovation" accent="Wrapped" tail="in Comfort" sub="Experience elevated comfort through modern innovation." />
          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <figure className="group relative min-h-[420px] overflow-hidden rounded-3xl md:col-span-2 md:row-span-2">
              <Image src={u("1552346154-21d32810aba3", 1400)} alt="Runner lacing up sneakers" fill sizes="(min-width:768px) 66vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent p-6 text-cream">
                <div>
                  <p className="display text-3xl sm:text-4xl">Adaptive Foam Core</p>
                  <p className="text-sm text-cream/75">Energy return that keeps up from first mile to last call.</p>
                </div>
                <a href="#featured" className="rounded-full bg-cream p-3 text-ink transition hover:bg-ember hover:text-cream" aria-label="Explore innovation">
                  <ArrowUpRight size={18} />
                </a>
              </figcaption>
            </figure>
            <figure className="group relative min-h-[240px] overflow-hidden rounded-3xl">
              <Image src={u("1491553895911-0055eca6402d", 800)} alt="Sneaker detail" fill sizes="33vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <figcaption className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-xs font-semibold">Engineered Mesh</figcaption>
            </figure>
            <figure className="relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl bg-ember p-6 text-cream">
              <p className="display text-4xl">Explore Innovation</p>
              <p className="text-sm text-cream/85">Zoned breathability, recycled uppers, and outsoles mapped to how you land.</p>
              <a href="#featured" className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold">
                Learn more <ArrowUpRight size={14} />
              </a>
            </figure>
          </div>
        </section>

        {/* 5. Best sellers */}
        <section id="best-sellers" className="scroll-mt-20 bg-stone/40 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle lead="Best" accent="Seller" sub="The pairs our community keeps coming back for. Tap any pair to pick your size." />
            <ProductRail products={bestSellers} viewAllHref="/shop?sort=rating" />
          </div>
        </section>

        {/* 6. Featured breakout */}
        <section id="featured" className="mx-auto grid max-w-7xl scroll-mt-20 items-center gap-10 px-4 py-24 sm:px-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cobalt">Featured drop</p>
            <h2 className="display mt-3 text-6xl sm:text-7xl">
              {featured.name.split(" ").slice(0, -1).join(" ")}
              <br />
              <span className="outline-text">{featured.name.split(" ").at(-1)}</span>
            </h2>
            <p className="mt-5 max-w-md text-muted">{featured.description}</p>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold">{peso(featured.price)}</span>
              <span className="flex items-center gap-1 text-sm text-muted">
                <Star size={14} className="fill-ember text-ember" /> {featured.rating} · {featured.reviews} reviews
              </span>
            </div>
            <QuickViewButton productId={featured.id} className={`${btnDark} mt-8 px-8 py-4 uppercase tracking-wider`}>
              Buy Now <ArrowUpRight size={16} />
            </QuickViewButton>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cobalt">
            <Image src={u("1517649763962-0c623066013b", 1200)} alt="Athlete in motion" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover mix-blend-luminosity opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 rounded-2xl bg-cream/95 p-3 backdrop-blur">
              <Image src={featured.image} alt={featured.name} width={72} height={72} className="h-18 w-18 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{featured.name}</p>
                <p className="text-xs text-muted">{featured.brand}</p>
              </div>
              <span className="pr-2 font-bold">{peso(featured.price)}</span>
            </div>
          </div>
        </section>

        {/* 7. Full Force Style collage */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <SectionTitle lead="Full" accent="Force" tail="Style" sub="Built for those who move with purpose — on the street, the court and everywhere between." />
          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[200px]">
            <div className="relative overflow-hidden rounded-3xl"><Image src={u("1529156069898-49953e39b3ac", 600)} alt="Friends hanging out" fill sizes="25vw" className="object-cover" /></div>
            <div className="relative row-span-2 overflow-hidden rounded-3xl bg-ember md:col-span-2 md:row-span-3">
              <Image src={u("1595950653106-6c9ebd614d3a", 1200)} alt="Pulse Trainer" fill sizes="50vw" className="object-cover opacity-90" />
              <div className="absolute inset-0 flex flex-col items-center justify-between bg-gradient-to-b from-ink/40 via-transparent to-ink/70 p-6 text-center text-cream">
                <p className="display text-4xl sm:text-6xl">Full Force Style</p>
                <div>
                  <p className="mx-auto max-w-xs text-xs text-cream/85 sm:text-sm">For those who refuse to slow down — grip, bounce and an unmistakable silhouette.</p>
                  <QuickViewButton productId="sus-pulse-trainer" className="mt-4 rounded-full bg-cream px-5 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-cream">
                    Shop Now
                  </QuickViewButton>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl md:row-span-2"><Image src={u("1608231387042-66d1773070a5", 600)} alt="High-top sneaker" fill sizes="25vw" className="object-cover" /></div>
            <div className="relative overflow-hidden rounded-3xl md:row-span-2"><Image src={u("1514989940723-e8e51635b782", 600)} alt="Sneakers lined up" fill sizes="25vw" className="object-cover" /></div>
            <div className="relative col-span-2 overflow-hidden rounded-3xl bg-olive p-6 text-cream md:col-span-1">
              <p className="display text-3xl">+40%</p>
              <p className="mt-1 text-sm text-cream/80">more energy return vs. our previous foam.</p>
            </div>
          </div>
        </section>

        {/* 8. New arrivals */}
        <section className="bg-stone/40 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle lead="New" accent="Arrivals" sub="Fresh off the line. Lock in your size before they’re gone." />
            <ProductRail products={newArrivals} viewAllHref="/shop?sort=newest" />
          </div>
        </section>

        {/* 9a. Reviews */}
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="display text-5xl sm:text-6xl">
              What our <span className="outline-text">customers</span> say
            </h2>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex text-ember">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={18} className="fill-current" />)}</div>
              <p className="text-sm text-muted"><strong className="text-ink">4.8/5</strong> from 1,100+ verified buyers</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {REVIEWS.map((r) => (
                <figure key={r.name} className="rounded-3xl bg-white p-6 shadow-sm">
                  <Quote size={22} className="text-ember" />
                  <blockquote className="mt-3 text-sm leading-relaxed">{r.text}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <Image src={r.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold">{r.name}</p>
                      <p className="text-xs text-muted">Verified · {r.product}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem]">
            <Image src={u("1494790108377-be9c29b29330", 900)} alt="Happy customer" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </section>

        {/* 9b. Sports grid */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <SectionTitle lead="Engineered for" accent="Every" tail="Game" sub="A collection built for speed, strength and endurance — so you perform at your best in every sport." />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {SPORTS.map((s, i) => (
              <Link key={s.label} href={s.href} className={`group block ${i % 2 ? "lg:mt-10" : ""}`}>
                <div className={`relative aspect-[3/4] overflow-hidden rounded-3xl ${s.tone}`}>
                  <Image src={s.img} alt={s.label} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-3 flex items-center justify-between text-sm font-semibold">
                  {s.label} <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
