import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Collections", href: "/collections" },
  { label: "About Prism", href: "/about" },
  { label: "My orders", href: "/orders" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-2.5"
            aria-label="Prism — home"
          >
            <PrismMark />
            <span className="font-heading text-[1.05rem] font-semibold tracking-tight text-foreground">
              Prism
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Prism Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/** Same monochrome mark as the header, without the hover reveal — quiet here on purpose. */
function PrismMark() {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M9 12L1 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="text-foreground/40"
      />
      <path d="M9 3L16.5 12L9 21Z" className="fill-foreground/80" />
    </svg>
  );
}
