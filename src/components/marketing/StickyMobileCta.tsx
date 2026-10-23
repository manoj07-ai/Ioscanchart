"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics/track";

export function StickyMobileCta() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls past ~450px (hero section)
      setIsVisible(window.scrollY > 450);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom duration-300">
      <div className="p-2 rounded-2xl bg-[var(--bg-1)]/90 backdrop-blur-md border border-[var(--candle)]/50 shadow-2xl shadow-black/80 flex items-center justify-between gap-3">
        <div className="pl-2">
          <div className="text-xs font-bold text-[var(--text-0)]">Ready to analyze?</div>
          <div className="text-[10px] text-[var(--candle)]">1 Free Full Analysis</div>
        </div>
        <Link href="/app" className="shrink-0">
          <Button
            variant="primary-gradient"
            size="sm"
            onClick={() => track("sticky_mobile_cta_clicked")}
          >
            Analyze Chart →
          </Button>
        </Link>
      </div>
    </div>
  );
}
