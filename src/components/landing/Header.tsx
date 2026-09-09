"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartCount } from "@/store/cart-store";

const links = [
  { label: "New", href: "/new" },
  { label: "Catalog", href: "/products" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/us" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useCartCount();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setAccountOpen(false);
      }
      if (event.key !== "Tab" || !drawerOpen || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>('a, button, input, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    drawerRef.current?.querySelector<HTMLElement>("button")?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = originalOverflow; };
  }, [drawerOpen]);

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout();
    router.push("/");
  };
  const isActive = (href: string) => pathname === href || (href === "/products" && pathname.startsWith("/products"));

  return (
    <>
      <a href="#main-content" className="sr-only z-[60] rounded bg-black px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      <header className={`sticky top-0 z-40 w-full transition-[background-color,box-shadow,border-color] duration-200 ease-out ${scrolled ? "border-b border-border bg-white/85 shadow-sm backdrop-blur-md" : "border-b border-transparent bg-transparent"}`}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:h-16">
          <Brand />
          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            {links.map((link) => <NavLink key={link.href} {...link} active={isActive(link.href)} />)}
          </nav>
          <div className="flex items-center gap-1">
            <div className="hidden items-center sm:flex">
              <button type="button" aria-label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"><Search className="h-5 w-5" /></button>
              <input aria-label="Search products" tabIndex={searchOpen ? 0 : -1} className={`h-9 rounded-full border border-border bg-white px-3 text-sm outline-none transition-[width,opacity,margin] duration-200 focus:border-foreground ${searchOpen ? "ml-1 w-40 opacity-100 md:w-48" : "ml-0 w-0 border-transparent p-0 opacity-0"}`} placeholder="Search" />
            </div>
            <div className="relative hidden sm:block">
              <button type="button" aria-label="Account" aria-expanded={accountOpen} onClick={() => isHydrated && (user ? setAccountOpen((open) => !open) : router.push("/login"))} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"><User className="h-5 w-5" /></button>
              {accountOpen && user && <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-border bg-white p-1 shadow-lg"><Link href="/orders" onClick={() => setAccountOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-muted">Orders</Link><Link href="/profile" onClick={() => setAccountOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-muted">Settings</Link><button type="button" onClick={handleLogout} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">Logout</button></div>}
            </div>
            <Link href="/cart" aria-label={`Cart, ${cartCount} items`} className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"><ShoppingCart className="h-5 w-5" />{cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] animate-[check-in_300ms_ease-out] items-center justify-center rounded-full bg-black px-1 text-xs font-medium text-white">{cartCount}</span>}</Link>
            <button type="button" aria-label="Open menu" aria-expanded={drawerOpen} aria-controls="mobile-navigation" onClick={() => setDrawerOpen(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black md:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </header>
      <div className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 md:hidden ${drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <aside ref={drawerRef} id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!drawerOpen} className={`fixed right-0 top-0 z-[51] h-dvh w-4/5 max-w-sm bg-white p-6 shadow-xl transition-transform duration-200 ease-out md:hidden ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)} className="ml-auto flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"><X className="h-5 w-5" /></button>
        <nav className="mt-8 flex flex-col" aria-label="Mobile main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)} className={isActive(link.href) ? "border-b border-border py-3 text-lg font-medium text-black underline decoration-2 underline-offset-4" : "border-b border-border py-3 text-lg font-medium text-foreground/75"}>
              {link.label}
            </Link>
          ))}
          <Link href={user ? "/profile" : "/login"} onClick={() => setDrawerOpen(false)} className="border-b border-border py-3 text-lg font-medium text-foreground/75">
            {user ? "Account" : "Sign in"}
          </Link>
        </nav>
      </aside>
    </>
  );
}

function NavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  const className = active
    ? "relative py-2 text-sm font-medium text-foreground transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-center after:scale-x-100 after:bg-current after:transition-transform after:duration-200"
    : "relative py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-center after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:after:scale-x-100";
  return <Link href={href} className={className}>{label}</Link>;
}

function Brand() {
  return <Link href="/" aria-label="Prism Home" className="group flex shrink-0 items-center gap-2"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M1 14h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="m9 4 9 10-9 10z" className="fill-foreground transition-colors group-hover:fill-none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m18 14 9-6M18 14h9m-9 0 9 6" className="stroke-transparent transition-colors group-hover:stroke-accent" strokeWidth="1.5" strokeLinecap="round" /></svg><span className="font-heading text-lg font-semibold tracking-tight">Prism</span></Link>;
}
