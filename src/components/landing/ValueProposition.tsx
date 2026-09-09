import { Headphones, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

const values = [
  { icon: Truck, title: "Free Shipping", description: "On all orders over $50. No hidden fees." },
  { icon: ShieldCheck, title: "2-Year Warranty", description: "Every product backed by our hassle-free guarantee." },
  { icon: RefreshCcw, title: "30-Day Returns", description: "Not satisfied? Full refund, no questions asked." },
  { icon: Headphones, title: "Expert Support", description: "Real humans, real answers. Average response: 2 hours." },
];

export function ValueProposition() {
  return <section className="bg-[#fafafa]"><div className="mx-auto max-w-7xl px-6 py-20"><h2 className="text-center font-heading text-2xl font-bold tracking-tight md:text-3xl">Why Prism</h2><div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">{values.map(({ icon: Icon, title, description }) => <article key={title} className="text-center"><Icon className="mx-auto mb-4 h-6 w-6 text-foreground" strokeWidth={1.5} aria-hidden="true" /><h3 className="text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></article>)}</div></div></section>;
}
