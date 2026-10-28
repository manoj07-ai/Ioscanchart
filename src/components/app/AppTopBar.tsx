"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppTopBarProps {
  onOpenMobileMenu: () => void;
}

export function AppTopBar({ onOpenMobileMenu }: AppTopBarProps) {
  const pathname = usePathname();

  // Generate simple breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = segments.map((seg, idx) => {
    const url = "/" + segments.slice(0, idx + 1).join("/");
    let label = seg.charAt(0).toUpperCase() + seg.slice(1);
    if (seg === "app") label = "Workspace";
    if (seg === "analysis") label = "Analysis";
    return { label, url, isLast: idx === segments.length - 1 };
  });

  return (
    <header className="h-14 border-b border-[var(--line)] bg-[var(--bg-1)] flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 rounded-md text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--text-2)]">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.url}>
              {index > 0 && <span className="text-[var(--text-2)]/60">/</span>}
              {item.isLast ? (
                <span className="font-medium text-[var(--text-0)] truncate max-w-[140px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-[var(--text-0)] transition-colors truncate max-w-[100px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Top right utility actions */}
      <div className="flex items-center gap-3 text-xs">
        <a
          href="https://www.tradingview.com/chart"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors border border-transparent hover:border-[var(--line)]"
          title="Open TradingView in a new tab"
        >
          <span>Open TradingView</span>
          <span className="text-[10px] text-[var(--text-2)]">↗</span>
        </a>
      </div>
    </header>
  );
}
