import Link from "next/link";

const collections = [
  { name: "New arrivals", description: "This week's drops" },
  { name: "Everyday basics", description: "Built for repeat wear" },
  { name: "Outerwear", description: "For the in-between seasons" },
];

export function FeaturedCollections() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-heading text-2xl font-semibold text-foreground mb-8">
        Shop by collection
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {collections.map((c) => (
          <Link key={c.name} href="/collections" className="group block">
            <div className="aspect-[4/5] rounded-md bg-muted transition-colors group-hover:bg-border" />
            <p className="mt-3 font-medium text-foreground">{c.name}</p>
            <p className="text-sm text-muted-foreground">{c.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
