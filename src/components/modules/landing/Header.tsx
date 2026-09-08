"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useCartCount } from "@/store/cart-store";

const NAV_LINKS = [
  { label: "New", href: "/new" },
  { label: "Catalog", href: "/products" },
  { label: "Collections", href: "/collections" },
  { label: "About Prism", href: "/us" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const router = useRouter();

  const cartCount = useCartCount();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = isHydrated && !!user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    setAccountMenuOpen(false);
    await logout();
    router.push("/");
  }

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
          : "bg-background border-b border-transparent",
      ].join(" ")}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 shrink-0"
            aria-label="Prism — home"
          >
            <PrismMark />
            <span className="font-heading text-[1.05rem] font-semibold tracking-tight text-foreground">
              Prism
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>

            {/* Account */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                aria-label={isAuthenticated ? "Account menu" : "Sign in"}
                onClick={() => {
                  if (!isHydrated) return;
                  if (!isAuthenticated) {
                    router.push("/login");
                    return;
                  }
                  setAccountMenuOpen((v) => !v);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>

              {accountMenuOpen && isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-background py-1.5 shadow-lg">
                  <div className="border-b border-border/70 px-3.5 py-2.5">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      {user?.name} {user?.lastName}
                    </p>
                    <p className="truncate text-[12px] text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex w-full items-center px-3.5 py-2.5 text-[13px] text-foreground/80 transition-colors hover:bg-muted"
                  >
                    My orders
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13px] text-foreground/80 transition-colors hover:bg-muted"
                  >
                    <LogOut className="h-[15px] w-[15px]" strokeWidth={1.75} />
                    Sign out
                  </button>

                  {user?.Role === "ADMIN" && (
                    <>
                      <div className="border-t border-border/70 my-1" />
                      <Link
                        href="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13px] text-foreground/80 transition-colors hover:bg-muted"
                      >
                        <ShieldCheck
                          className="h-[15px] w-[15px]"
                          strokeWidth={1.75}
                        />
                        Admin panel
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/cart"
              aria-label={`Cart, ${cartCount} items`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold leading-none text-background">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" strokeWidth={1.75} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={[
          "md:hidden overflow-hidden border-t border-border bg-background transition-[max-height,opacity] duration-300 ease-out",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="flex flex-col px-4 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-3 text-[15px] font-medium text-foreground/90 border-b border-border/70"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[15px] font-medium text-foreground/90 border-b border-border/70"
              >
                My orders
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="py-3 text-left text-[15px] font-medium text-foreground/90"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-[15px] font-medium text-foreground/90"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

/**
 * Prism mark: a single stroke that splits into three colored
 * beams — refraction as the brand's symbol. Monochrome at rest,
 * reveals the spectrum on hover.
 */
function PrismMark() {
  return (
    <svg
      width="26"
      height="24"
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
        className="text-foreground/70 transition-opacity duration-300 group-hover:opacity-40"
      />
      <path
        d="M9 3L16.5 12L9 21Z"
        className="fill-foreground transition-colors duration-300 group-hover:fill-none"
      />
      <g className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <path
          d="M16.5 12L25 6.5"
          stroke="#6366f1"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16.5 12L25 12"
          stroke="#ec4899"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16.5 12L25 17.5"
          stroke="#f59e0b"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
