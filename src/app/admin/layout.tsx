"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Package, Tag, Users } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  const isAdmin = user?.Role === "ADMIN";

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/");
    }
  }, [isHydrated, user, isAdmin, router]);

  if (!isHydrated || !user || !isAdmin) {
    return (
      <main className="container mx-auto px-4 py-16 text-center text-[13px] text-muted-foreground">
        Checking access…
      </main>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
      <aside className="hidden w-56 shrink-0 border-r border-border px-4 py-8 md:block">
        <p className="px-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Admin
        </p>
        <nav className="mt-4 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 px-4 py-8 md:px-8">{children}</div>
    </div>
  );
}
