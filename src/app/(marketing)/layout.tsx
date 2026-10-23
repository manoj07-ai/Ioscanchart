import * as React from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { StickyMobileCta } from "@/components/marketing/StickyMobileCta";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--bg-0)] text-[var(--text-1)] selection:bg-[var(--candle-dim)] selection:text-[var(--text-0)]">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <StickyMobileCta />
    </div>
  );
}
