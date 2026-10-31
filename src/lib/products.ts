export const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export type Category = "Running" | "Casual" | "Basketball";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  tag?: "New" | "Best Seller";
  description: string;
  /** Sizes that exist but are sold out. */
  soldOut: number[];
}

export const SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13];

export const products: Product[] = [
  { id: "sus-aero-run", name: "Aero Run 2", brand: "Step-Up Labs", category: "Running", price: 6450, rating: 4.8, reviews: 312, image: u("1542291026-7eec264c27ff", 800), colors: ["#d62f2f", "#0d0d0d", "#fbf9f6"], tag: "Best Seller", description: "Responsive foam midsole with a breathable engineered mesh upper for daily miles.", soldOut: [7, 12] },
  { id: "sus-court-classic", name: "Court Classic Lo", brand: "Step-Up Originals", category: "Casual", price: 4290, rating: 4.6, reviews: 198, image: u("1525966222134-fcfa99b8ae77", 800), colors: ["#0d0d0d", "#fbf9f6"], tag: "Best Seller", description: "Low-profile canvas skate silhouette with a vulcanized gum sole.", soldOut: [9.5] },
  { id: "sus-velocity", name: "Velocity Knit", brand: "Step-Up Labs", category: "Running", price: 5890, rating: 4.7, reviews: 241, image: u("1606107557195-0e29a4b5b4aa", 800), colors: ["#2a3fa0", "#fbf9f6", "#e2541b"], tag: "Best Seller", description: "Sock-like knit upper and a rocker geometry built for tempo days.", soldOut: [13] },
  { id: "sus-hoop-elite", name: "Hoop Elite Mid", brand: "Step-Up Court", category: "Basketball", price: 7990, rating: 4.9, reviews: 156, image: u("1600185365483-26d7a4cc7519", 800), colors: ["#fbf9f6", "#0d0d0d"], tag: "Best Seller", description: "Mid-cut lockdown, zoned cushioning and herringbone traction for hard cuts.", soldOut: [8, 10.5] },
  { id: "sus-urban-glide", name: "Urban Glide", brand: "Step-Up Originals", category: "Casual", price: 3990, rating: 4.4, reviews: 87, image: u("1549298916-b41d501d3772", 800), colors: ["#6b7238", "#ebe6de"], tag: "New", description: "Suede-and-mesh street runner with an everyday comfort footbed.", soldOut: [] },
  { id: "sus-pulse-trainer", name: "Pulse Trainer", brand: "Step-Up Labs", category: "Running", price: 5490, rating: 4.5, reviews: 64, image: u("1595950653106-6c9ebd614d3a", 800), colors: ["#e2541b", "#0d0d0d"], tag: "New", description: "Stable platform and grippy outsole for gym sessions and short runs.", soldOut: [7.5, 11] },
  { id: "sus-skyline-hi", name: "Skyline Hi", brand: "Step-Up Court", category: "Basketball", price: 8490, rating: 4.7, reviews: 52, image: u("1608231387042-66d1773070a5", 800), colors: ["#2a3fa0", "#fbf9f6"], tag: "New", description: "High-top leather build with a cushioned heel for all-game support.", soldOut: [12, 13] },
  { id: "sus-daybreak", name: "Daybreak Low", brand: "Step-Up Originals", category: "Casual", price: 3590, rating: 4.3, reviews: 41, image: u("1460353581641-37baddab0fa2", 800), colors: ["#d4d4d4", "#e2541b"], tag: "New", description: "Lightweight lifestyle sneaker that pairs with anything.", soldOut: [8.5] },
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
