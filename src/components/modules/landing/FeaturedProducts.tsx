import Link from "next/link";

const products = [
  { name: "Wireless earbuds", price: "$48" },
  { name: "Portable power bank", price: "$132" },
  { name: "Smart desk lamp", price: "$96" },
  { name: "USB-C hub", price: "$38" },
];

export function FeaturedProducts() {
  return (
    <section className="bg-muted/40 border-y border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Featured products
          </h2>
          <Link href="/catalog" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {products.map((p) => (
            <div key={p.name} className="group">
              <div className="aspect-square rounded-md bg-background border border-border transition-colors group-hover:border-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">
                {p.name}
              </p>
              <p className="text-sm text-muted-foreground">{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
