import Link from "next/link";

const footerLinks = [
  {
    heading: "Shop",
    links: [
      { label: "New arrivals", href: "/catalog?sort=new" },
      { label: "Catalog", href: "/catalog" },
      { label: "Collections", href: "/collections" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Prism", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Shipping & returns", href: "/shipping" },
      { label: "Track an order", href: "/orders" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <p className="font-heading text-lg font-semibold">Prism</p>
            <p className="mt-2 text-sm text-primary-foreground/70 max-w-xs">
              Smart gadgets and everyday tech essentials, thoughtfully designed
              and priced fairly.
            </p>
            <form className="mt-5 flex max-w-xs gap-2">
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="flex-1 min-w-0 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 px-3 py-2 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-xs text-primary-foreground/50">
              10% off your first order. No spam.
            </p>
          </div>

          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p className="text-sm font-medium">{col.heading}</p>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-sm text-primary-foreground/50">
          &copy; {new Date().getFullYear()} Prism Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
