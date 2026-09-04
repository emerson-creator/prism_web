"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

/**
 * Reads the persisted session from localStorage once, on app load,
 * so the Header/UI knows immediately whether there's a logged-in user
 * instead of always starting as "signed out" until some interaction.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated && user) fetchCart();
  }, [isHydrated, user, fetchCart]);

  return <>{children}</>;
}
