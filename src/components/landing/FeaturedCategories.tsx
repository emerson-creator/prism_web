import Link from "next/link";

const collections = [
  { title: "New Arrivals", subtitle: "This week's drops", href: "/new", art: "from-indigo-300 via-violet-200 to-zinc-100", shape: "bg-indigo-950/75" },
  { title: "Everyday Tech", subtitle: "Built for repeat wear", href: "/collections", art: "from-slate-300 via-zinc-100 to-white", shape: "bg-zinc-900/75" },
  { title: "Pro Gear", subtitle: "For the in-between seasons", href: "/collections", art: "from-amber-200 via-orange-100 to-stone-100", shape: "bg-amber-950/70" },
];

export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">Shop by collection</h2>
      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {collections.map((collection) => (
          <Link key={collection.title} href={collection.href} aria-label={`Explore ${collection.title} collection`} className="group relative aspect-[4/5] w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:w-auto">
            <div className={`absolute inset-0 bg-gradient-to-br ${collection.art} transition-transform duration-500 ease-out group-hover:scale-105`} />
            <CollectionArt className={collection.shape} />
            <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/20" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="text-xl font-semibold">{collection.title}</h3>
              <p className="mt-1 text-sm text-white/80">{collection.subtitle}</p>
              <span className="mt-4 block translate-y-2 text-sm font-medium opacity-0 transition-all delay-100 duration-300 group-hover:translate-y-0 group-hover:opacity-100">Explore <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CollectionArt({ className }: { className: string }) {
  return <div className="absolute inset-0 overflow-hidden" aria-hidden="true"><div className={`absolute left-[18%] top-[20%] h-[58%] w-[64%] rotate-[-18deg] rounded-[2.5rem] opacity-90 shadow-2xl ${className}`} /><div className="absolute left-[30%] top-[28%] h-[32%] w-[40%] rounded-full border-[14px] border-white/20" /></div>;
}
