"use client";

import Link from "next/link";
import { Camera, Check, ChevronDown, MessageCircle, Video } from "lucide-react";
import { FormEvent, useState } from "react";

const columns = [
  {
    title: "Shop",
    links: [
      ["New", "/new"],
      ["Catalog", "/products"],
      ["Collections", "/collections"],
      ["Best Sellers", "/products"],
    ],
  },
  {
    title: "Support",
    links: [
      ["FAQ", "/faq"],
      ["Shipping", "/shipping"],
      ["Returns", "/returns"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/us"],
      ["Careers", "/careers"],
      ["Press", "/press"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Cookies", "/cookies"],
    ],
  },
] as const;

export function NewsletterFooter() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [openColumns, setOpenColumns] = useState<Record<string, boolean>>({});

  const toggleColumn = (title: string) => {
    setOpenColumns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSuccess(true);
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="bg-[#171717] px-6 py-16 text-white border-b border-white/5">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            Get 10% off your first order
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base">
            Join 15,000+ creators getting early access to drops and exclusive
            deals.
          </p>

          {success ? (
            <p className="mt-8 flex items-center justify-center gap-2 font-medium text-green-400 transition-all duration-300">
              <Check className="h-5 w-5" /> You&apos;re in! Check your inbox.
            </p>
          ) : (
            <form onSubmit={submit} className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className={`min-w-0 flex-1 rounded-lg border bg-white/10 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors ${
                    error ? "border-red-500" : "border-white/20"
                  }`}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
                >
                  Subscribe
                </button>
              </div>
              {error && (
                <p className="mt-2 text-left text-sm text-red-400">{error}</p>
              )}
              <label className="mt-4 flex items-center justify-center gap-2 text-left text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-transparent text-black accent-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>I want product recommendations tailored to me</span>
              </label>
            </form>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#0a0a0a] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:order-last sm:col-span-2 lg:col-span-1">
              <Brand />
              <p className="mt-2 text-sm text-zinc-500">
                Clarity you can wear.
              </p>
              <div className="mt-4 flex gap-4">
                <SocialIcon label="Twitter">
                  <MessageCircle className="h-5 w-5" />
                </SocialIcon>
                <SocialIcon label="Instagram">
                  <Camera className="h-5 w-5" />
                </SocialIcon>
                <SocialIcon label="YouTube">
                  <Video className="h-5 w-5" />
                </SocialIcon>
              </div>
            </div>

            {/* Link Columns */}
            {columns.map((column) => {
              const isOpen = !!openColumns[column.title];
              return (
                <div
                  key={column.title}
                  className="border-b border-white/10 sm:border-none pb-4 sm:pb-0"
                >
                  {/* Mobile Trigger / Tablet & Desktop Title */}
                  <button
                    type="button"
                    onClick={() => toggleColumn(column.title)}
                    className="flex w-full items-center justify-between text-left sm:pointer-events-none sm:block"
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {column.title}
                    </h3>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform duration-200 sm:hidden ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Links List */}
                  <ul
                    className={`mt-4 space-y-2 transition-all duration-200 sm:block ${
                      isOpen ? "block" : "hidden"
                    }`}
                  >
                    {column.links.map(([label, href]) => (
                      <li key={label}>
                        <Link
                          href={href}
                          className="text-sm text-zinc-400 transition-colors hover:text-white"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 Prism Store. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <button
                type="button"
                className="transition-colors hover:text-white cursor-pointer"
              >
                EN / ES
              </button>
              <button
                type="button"
                className="transition-colors hover:text-white cursor-pointer"
              >
                USD / EUR
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function Brand() {
  return (
    <Link
      href="/"
      aria-label="Prism Home"
      className="flex items-center gap-2 font-heading text-lg font-semibold"
    >
      <span className="relative h-6 w-6" aria-hidden="true">
        <span className="absolute left-0 top-3 h-px w-2 bg-white" />
        <span className="absolute left-2 top-1 h-4 w-4 rotate-45 border border-white" />
      </span>
      Prism
    </Link>
  );
}

function SocialIcon({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="text-zinc-400 transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}
