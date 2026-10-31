export const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export type Category = "Running" | "Casual" | "Basketball";
export type Gender = "Men" | "Women" | "Unisex";
export type Brand = "Nike" | "Adidas" | "New Balance" | "Asics" | "Puma" | "Converse" | "Vans";

export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: Category;
  gender: Gender;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  colors: Color[];
  tag?: "New" | "Best Seller";
  /** Higher = more recently released; drives the "Newest" sort. */
  released: number;
  description: string;
  /** Sizes that exist but are sold out. */
  soldOut: number[];
}

export const SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13];

const C = {
  black: { name: "Black", hex: "#0d0d0d" },
  white: { name: "White", hex: "#fbf9f6" },
  red: { name: "Red", hex: "#d62f2f" },
  blue: { name: "Blue", hex: "#2a3fa0" },
  orange: { name: "Orange", hex: "#e2541b" },
  olive: { name: "Olive", hex: "#6b7238" },
  grey: { name: "Grey", hex: "#b5b5b5" },
  sand: { name: "Sand", hex: "#d8c7a8" },
} satisfies Record<string, Color>;

export const products: Product[] = [
  { id: "sus-aero-run", name: "Aero Run 2", brand: "Nike", category: "Running", gender: "Men", price: 6450, rating: 4.8, reviews: 312, image: u("1542291026-7eec264c27ff", 800), colors: [C.red, C.black, C.white], tag: "Best Seller", released: 4, description: "Responsive foam midsole with a breathable engineered mesh upper for daily miles.", soldOut: [7, 12] },
  { id: "sus-court-classic", name: "Court Classic Lo", brand: "Vans", category: "Casual", gender: "Unisex", price: 4290, rating: 4.6, reviews: 198, image: u("1525966222134-fcfa99b8ae77", 800), colors: [C.black, C.white], tag: "Best Seller", released: 2, description: "Low-profile canvas skate silhouette with a vulcanized gum sole.", soldOut: [9.5] },
  { id: "sus-velocity", name: "Velocity Knit", brand: "Adidas", category: "Running", gender: "Women", price: 5890, rating: 4.7, reviews: 241, image: u("1606107557195-0e29a4b5b4aa", 800), colors: [C.blue, C.white, C.orange], tag: "Best Seller", released: 5, description: "Sock-like knit upper and a rocker geometry built for tempo days.", soldOut: [13] },
  { id: "sus-hoop-elite", name: "Hoop Elite Mid", brand: "Nike", category: "Basketball", gender: "Men", price: 7990, rating: 4.9, reviews: 156, image: u("1600185365483-26d7a4cc7519", 800), colors: [C.white, C.black], tag: "Best Seller", released: 3, description: "Mid-cut lockdown, zoned cushioning and herringbone traction for hard cuts.", soldOut: [8, 10.5] },
  { id: "sus-urban-glide", name: "Urban Glide", brand: "New Balance", category: "Casual", gender: "Women", price: 3990, rating: 4.4, reviews: 87, image: u("1549298916-b41d501d3772", 800), colors: [C.olive, C.sand], tag: "New", released: 13, description: "Suede-and-mesh street runner with an everyday comfort footbed.", soldOut: [] },
  { id: "sus-pulse-trainer", name: "Pulse Trainer", brand: "Puma", category: "Running", gender: "Unisex", price: 5490, rating: 4.5, reviews: 64, image: u("1595950653106-6c9ebd614d3a", 800), colors: [C.orange, C.black], tag: "New", released: 14, description: "Stable platform and grippy outsole for gym sessions and short runs.", soldOut: [7.5, 11] },
  { id: "sus-skyline-hi", name: "Skyline Hi", brand: "Adidas", category: "Basketball", gender: "Men", price: 8490, rating: 4.7, reviews: 52, image: u("1608231387042-66d1773070a5", 800), colors: [C.blue, C.white], tag: "New", released: 15, description: "High-top leather build with a cushioned heel for all-game support.", soldOut: [12, 13] },
  { id: "sus-daybreak", name: "Daybreak Low", brand: "Converse", category: "Casual", gender: "Women", price: 3590, rating: 4.3, reviews: 41, image: u("1460353581641-37baddab0fa2", 800), colors: [C.grey, C.orange], tag: "New", released: 16, description: "Lightweight lifestyle sneaker that pairs with anything.", soldOut: [8.5] },
  { id: "sus-ridge-runner", name: "Ridge Runner GTX", brand: "Asics", category: "Running", gender: "Men", price: 7290, rating: 4.6, reviews: 118, image: u("1491553895911-0055eca6402d", 800), colors: [C.olive, C.black], released: 9, description: "Waterproof trail runner with lugged outsole and rock plate for technical terrain.", soldOut: [7, 7.5] },
  { id: "sus-summit-lite", name: "Summit Lite", brand: "Asics", category: "Running", gender: "Women", price: 6190, rating: 4.5, reviews: 73, image: u("1514989940723-e8e51635b782", 800), colors: [C.sand, C.orange], released: 10, description: "Featherweight trail shoe with a cushioned, rockered ride for long days out.", soldOut: [11, 12, 13] },
  { id: "sus-canyon-mule", name: "Canyon Slip-On", brand: "New Balance", category: "Casual", gender: "Unisex", price: 3290, rating: 4.2, reviews: 39, image: u("1552346154-21d32810aba3", 800), colors: [C.sand, C.olive], released: 7, description: "Easy slip-on recovery shoe with a grippy outsole for post-hike comfort.", soldOut: [] },
  { id: "sus-rally-w", name: "Rally Court W", brand: "Puma", category: "Basketball", gender: "Women", price: 6890, rating: 4.7, reviews: 66, image: u("1556906781-9a412961c28c", 800), colors: [C.white, C.red], released: 11, description: "Women's-specific last, responsive forefoot and a supportive mid-cut collar.", soldOut: [10, 10.5] },
  { id: "sus-blacktop", name: "Blacktop Low", brand: "Adidas", category: "Basketball", gender: "Unisex", price: 5290, rating: 4.4, reviews: 92, image: u("1606107557195-0e29a4b5b4aa", 800), colors: [C.black, C.orange], released: 6, description: "Durable outdoor rubber and a low-cut build for quick guards.", soldOut: [9] },
  { id: "sus-metro-knit", name: "Metro Knit", brand: "New Balance", category: "Casual", gender: "Men", price: 4590, rating: 4.5, reviews: 110, image: u("1595950653106-6c9ebd614d3a", 800), colors: [C.grey, C.black], released: 8, description: "One-piece knit commuter with a memory-foam insole.", soldOut: [12] },
  { id: "sus-tempo-w", name: "Tempo Racer W", brand: "Asics", category: "Running", gender: "Women", price: 8990, rating: 4.9, reviews: 48, image: u("1542291026-7eec264c27ff", 800), colors: [C.red, C.white], released: 12, description: "Carbon-plated race-day flat with supercritical foam.", soldOut: [7, 9.5] },
  { id: "sus-heritage", name: "Heritage 86", brand: "Converse", category: "Casual", gender: "Men", price: 3890, rating: 4.3, reviews: 205, image: u("1525966222134-fcfa99b8ae77", 800), colors: [C.white, C.blue], released: 1, description: "A retro court silhouette with suede overlays, back from the archive.", soldOut: [] },
];

export const bestSellers = products.filter((p) => p.tag === "Best Seller");
export const newArrivals = products.filter((p) => p.tag === "New");
export const featured = products[3];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const peso = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const FREE_SHIPPING = 5000;
export const SHIPPING = {
  standard: { label: "Standard", eta: "3–5 business days", fee: 150 },
  express: { label: "Express", eta: "1–2 business days", fee: 350 },
} as const;
export type ShippingMethod = keyof typeof SHIPPING;
export const TAX_RATE = 0.12;

/* ---------- Filtering ---------- */

export const PRICE_BANDS = [
  { id: "under-4k", label: "Under ₱4,000", min: 0, max: 4000 },
  { id: "4k-6k", label: "₱4,000 – ₱6,000", min: 4000, max: 6000 },
  { id: "6k-8k", label: "₱6,000 – ₱8,000", min: 6000, max: 8000 },
  { id: "8k-up", label: "₱8,000+", min: 8000, max: Infinity },
] as const;

const uniq = <T,>(xs: T[]) => [...new Set(xs)];

export const FILTER_OPTIONS = {
  gender: ["Men", "Women", "Unisex"] as Gender[],
  brand: uniq(products.map((p) => p.brand)).sort(),
  category: ["Running", "Casual", "Basketball"] as Category[],
  size: SIZES.map(String),
  color: uniq(products.flatMap((p) => p.colors.map((c) => c.name))),
  price: PRICE_BANDS.map((b) => b.id as string),
};

export const COLOR_HEX = Object.fromEntries(Object.values(C).map((c) => [c.name, c.hex]));

export type Facet = keyof typeof FILTER_OPTIONS;
export type ProductFilters = Record<Facet, string[]>;

export const FACETS = Object.keys(FILTER_OPTIONS) as Facet[];

export const emptyFilters = (): ProductFilters =>
  Object.fromEntries(FACETS.map((f) => [f, []])) as unknown as ProductFilters;

function matchesFacet(p: Product, facet: Facet, values: string[]): boolean {
  if (values.length === 0) return true;
  switch (facet) {
    case "gender":
      return values.includes(p.gender);
    case "brand":
      return values.includes(p.brand);
    case "category":
      return values.includes(p.category);
    // A size only matches when that size is in stock.
    case "size":
      return values.some((s) => !p.soldOut.includes(Number(s)));
    case "color":
      return p.colors.some((c) => values.includes(c.name));
    case "price":
      return PRICE_BANDS.some((b) => values.includes(b.id) && p.price >= b.min && p.price < b.max);
  }
}

/** OR within a facet, AND across facets. Pass `except` to ignore one facet (for option counts). */
export function filterProducts(list: Product[], filters: ProductFilters, except?: Facet): Product[] {
  return list.filter((p) => FACETS.every((f) => f === except || matchesFacet(p, f, filters[f])));
}

export const SORTS = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Top Rated",
  newest: "Newest",
} as const;
export type SortKey = keyof typeof SORTS;

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const out = [...list];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "rating":
      return out.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "newest":
      return out.sort((a, b) => b.released - a.released);
    default:
      return out;
  }
}

/** Human label for a filter value (price bands use ids in the URL). */
export const filterLabel = (facet: Facet, value: string) =>
  facet === "price"
    ? (PRICE_BANDS.find((b) => b.id === value)?.label ?? value)
    : facet === "size"
      ? `US ${value}`
      : value;
