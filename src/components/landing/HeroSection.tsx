import Link from "next/link";

const avatars = [
  "linear-gradient(135deg, #fecaca, #fb7185)",
  "linear-gradient(135deg, #bfdbfe, #6366f1)",
  "linear-gradient(135deg, #fde68a, #f97316)",
  "linear-gradient(135deg, #bbf7d0, #14b8a6)",
  "linear-gradient(135deg, #e9d5ff, #a855f7)",
];

export function HeroSection() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-6 py-14 md:grid-cols-[1.1fr_.9fr] md:py-20">
        <div className="order-2 text-center md:order-1 md:text-left">
          <p className="animate-[fade-in_600ms_ease-out_both] text-sm font-medium tracking-wide text-muted-foreground">PRISM TECH</p>
          <h1 className="mt-3 animate-[fade-in_600ms_ease-out_both] font-heading text-4xl font-bold leading-tight tracking-tight text-foreground [animation-delay:100ms] md:text-5xl lg:text-6xl">
            Gear that keeps up with you.
          </h1>
          <p className="mt-4 animate-[fade-in_600ms_ease-out_both] text-lg leading-relaxed text-muted-foreground [animation-delay:200ms] md:text-xl">
            Curated tech for creators, builders, and everyday problem-solvers.
          </p>
          <div className="mt-8 flex animate-[fade-in_600ms_ease-out_both] flex-col gap-3 [animation-delay:300ms] sm:flex-row md:justify-start">
            <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
              Shop the catalog
            </Link>
            <Link href="/new" className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 text-sm font-medium text-black transition duration-200 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
              See what&apos;s new
            </Link>
          </div>
          <div className="mt-10 flex animate-[fade-in_600ms_ease-out_both] flex-col items-center gap-3 [animation-delay:400ms] md:items-start">
            <div className="flex" aria-hidden="true">
              {avatars.map((background, index) => (
                <span key={background} className={`${index ? "-ml-2" : ""} h-8 w-8 rounded-full border-2 border-white`} style={{ background }} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Trusted by 12,000+ creators</p>
          </div>
        </div>

        <div className="order-1 animate-[fade-in_700ms_ease-out_both] [animation-delay:200ms] md:order-2">
          <ProductIllustration />
        </div>
      </div>
    </section>
  );
}

function ProductIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-3/4 max-w-lg overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_38%_28%,#fff_0%,#f4f4f5_42%,#e4e4e7_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:w-full">
      <span className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur motion-safe:animate-pulse">New arrival</span>
      <svg viewBox="0 0 500 500" className="h-full w-full" role="img" aria-label="Minimal three-axis gimbal product illustration">
        <defs>
          <linearGradient id="metal" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#3f3f46" /><stop offset=".48" stopColor="#18181b" /><stop offset="1" stopColor="#09090b" /></linearGradient>
          <linearGradient id="screen" x1="0" x2="1"><stop stopColor="#a5b4fc" /><stop offset="1" stopColor="#4f46e5" /></linearGradient>
        </defs>
        <ellipse cx="250" cy="420" rx="128" ry="22" fill="#18181b" opacity=".15" />
        <path d="M247 174c45 0 82 37 82 82 0 24-10 45-27 60l-31-31c8-8 13-18 13-29 0-23-18-41-41-41s-41 18-41 41c0 14 7 27 18 34l-24 37c-24-16-39-42-39-71 0-45 37-82 82-82h8Z" fill="url(#metal)" />
        <rect x="218" y="262" width="52" height="145" rx="26" fill="url(#metal)" transform="rotate(14 244 334)" />
        <rect x="202" y="390" width="67" height="44" rx="16" fill="#18181b" transform="rotate(14 235 412)" />
        <circle cx="243" cy="256" r="51" fill="#27272a" stroke="#52525b" strokeWidth="9" />
        <circle cx="243" cy="256" r="37" fill="url(#screen)" /><circle cx="243" cy="256" r="26" fill="#111827" /><circle cx="232" cy="244" r="8" fill="#e0e7ff" opacity=".9" />
        <path d="M194 250 148 225" stroke="#27272a" strokeWidth="15" strokeLinecap="round" /><circle cx="137" cy="219" r="23" fill="#18181b" />
      </svg>
    </div>
  );
}
