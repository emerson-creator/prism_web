"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

/**
 * Reads the persisted session from localStorage once, on app load,
 * so the Header/UI knows immediately whether there's a logged-in user
 * instead of always starting as "signed out" until some interaction.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
