"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_MESSAGES = [
  "Free shipping on orders over $50",
  "New: Glide 3-Axis Gimbal now available",
  "Join Prism+ for exclusive deals",
];
const DISMISS_KEY = "prism-announcement-dismissed-at";
const DISMISS_DURATION = 24 * 60 * 60 * 1000;

export interface AnnouncementBarProps {
  messages?: string[];
  rotationInterval?: number;
}

export function AnnouncementBar({
  messages = DEFAULT_MESSAGES,
  rotationInterval = 4000,
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY));
    return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_DURATION;
  });
  const [messageIndex, setMessageIndex] = useState(0);
  const [canRotate, setCanRotate] = useState(() =>
    typeof window !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateMotionPreference = () => setCanRotate(!motionQuery.matches && !mobileQuery.matches);
    motionQuery.addEventListener("change", updateMotionPreference);
    mobileQuery.addEventListener("change", updateMotionPreference);
    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
      mobileQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (!canRotate || messages.length < 2) return;
    const timer = window.setInterval(
      () => setMessageIndex((index) => (index + 1) % messages.length),
      rotationInterval,
    );
    return () => window.clearInterval(timer);
  }, [canRotate, messages.length, rotationInterval]);

  if (dismissed || messages.length === 0) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  };

  return (
    <aside className="relative flex h-9 items-center justify-center bg-black px-10 text-center text-sm font-medium text-white" role="banner">
      <p key={messageIndex} className="animate-[fade-in_300ms_ease-out_both]">
        {messages[messageIndex]}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
