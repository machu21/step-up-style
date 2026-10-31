import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Step-Up-Style home" className="relative inline-flex items-end leading-none">
      <span
        className={`text-2xl font-black tracking-tight ${
          light ? "text-white" : "bg-gradient-to-r from-cobalt to-navy bg-clip-text text-transparent"
        }`}
      >
        stepup
      </span>
      <span className={`-ml-1 translate-y-1 font-serif text-sm italic ${light ? "text-white/80" : "text-navy"}`}>
        style
      </span>
    </Link>
  );
}
