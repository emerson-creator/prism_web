"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to detect the current vertical scroll position of the page.
 * Returns the scrollY value. Useful for animations, glassmorphism headers, etc.
 */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const frameId = window.requestAnimationFrame(handleScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollY;
}
