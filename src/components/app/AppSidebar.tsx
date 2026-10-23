"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

export interface AnalysisHistoryItem {
  id: string;
  instrument: string;
  marketPack: string;
  timeframe: string;
  status: "queued" | "reading" | "done" | "failed";
  createdAt: string;
  stance?: "long" | "short" | "wait";
}

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [creditsRemaining, setCreditsRemaining] = useState<number>(1);
  const [planName, setPlanName] = useState<string>("Demo plan");

  // Fetch recent history and user entitlement
  useEffect(() => {
    async function loadData() {
      try {
        const [historyRes, userRes] = await Promise.all([
          fetch("/api/analyses"),
          fetch("/api/user/me"),
        ]);

        if (historyRes.ok) {
          const data = await historyRes.json();
          if (data.analyses) setHistory(data.analyses);
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.entitlement) {
            setCreditsRemaining(userData.entitlement.creditsRemaining);
            const plan = userData.entitlement.plan;
            setPlanName(
              plan === "lifetime"
                ? "Lifetime plan"
                : plan === "monthly"
                ? "Monthly plan"
                : "Demo plan"
            );
          }
        }
      } catch (err) {
        console.error("Failed to load sidebar history:", err);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadData();

    // Listen for custom analysis created event to refresh history
    const handleRefresh = () => loadData();
    window.addEventListener("analysis-created", handleRefresh);
    return () => window.removeEventListener("analysis-created", handleRefresh);
  }, []);

  const navLinks = [
    {
      name: "Analyses",
      href: "/app/history",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: "Journal",
      href: "/app/journal",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: "Academy",
      href: "/app/academy",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/app/settings",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-all duration-200 ease-in-out md:static",
          "border-[var(--line)] bg-[var(--bg-1)]",
          collapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand header */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-[var(--line)]">
          <Link
            href="/app"
            className="flex items-center gap-2 overflow-hidden focus-visible:outline-[var(--candle)]"
          >
            <Logo size={28} />
            {!collapsed && (
              <span className="font-semibold text-sm tracking-tight text-[var(--text-0)] truncate">
                {brand.name}
              </span>
            )}
          </Link>

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-md text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar collapse"
          >
            <svg
              className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-md text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)]"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Primary CTA: New Analysis */}
        <div className="p-3">
          <Link href="/app" onClick={() => onClose()}>
            <Button
              variant="primary-gradient"
              className={cn(
                "w-full font-semibold shadow-xs flex items-center justify-center gap-2",
                collapsed ? "px-0" : "px-3"
              )}
              title="New analysis"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {!collapsed && <span>New analysis</span>}
            </Button>
          </Link>
        </div>

        {/* Navigation & History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Main workspace navigation */}
          <div className="space-y-1">
            {navLinks.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-colors",
                    active
                      ? "bg-[var(--bg-2)] text-[var(--candle)] font-semibold shadow-2xs"
                      : "text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)]"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* History Section (last 10 analyses) */}
          {!collapsed && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--text-2)]">
                  Recent analyses
                </span>
                <Link
                  href="/app/history"
                  className="text-[10px] text-[var(--text-2)] hover:text-[var(--text-0)] transition-colors"
                >
                  View all
                </Link>
              </div>

              {loadingHistory ? (
                <div className="space-y-2 py-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-7 rounded-sm bg-[var(--bg-2)] animate-pulse" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-[var(--text-2)] px-1 py-2 italic">
                  No charts analyzed yet.
                </p>
              ) : (
                <div className="space-y-1">
                  {history.slice(0, 10).map((item) => {
                    const isCurrent = pathname === `/app/analysis/${item.id}`;
                    return (
                      <Link
                        key={item.id}
                        href={`/app/analysis/${item.id}`}
                        onClick={() => onClose()}
                        className={cn(
                          "flex items-center justify-between px-2 py-1.5 rounded-sm text-xs transition-colors group",
                          isCurrent
                            ? "bg-[var(--bg-2)] text-[var(--candle)] font-medium"
                            : "text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)]"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono font-medium text-[var(--text-0)] text-xs">
                            {item.instrument}
                          </span>
                          <span className="text-[10px] text-[var(--text-2)] uppercase">
                            {item.timeframe}
                          </span>
                        </div>
                        {item.stance && (
                          <span
                            className={cn(
                              "text-[9px] font-mono font-semibold px-1 py-0.5 rounded-xs shrink-0",
                              item.stance === "long"
                                ? "bg-[var(--candle)]/10 text-[var(--candle)]"
                                : item.stance === "short"
                                ? "bg-[var(--bear)]/10 text-[var(--bear)]"
                                : "bg-[var(--bg-3)] text-[var(--text-2)]"
                            )}
                          >
                            {item.stance.toUpperCase()}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plan & Upgrade Card */}
        <div className="p-3 border-t border-[var(--line)]">
          {!collapsed ? (
            <div className="rounded-lg p-3 bg-[var(--bg-2)] border border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-0)]">{planName}</span>
                <Badge variant={creditsRemaining > 0 ? "bull" : "amber"} className="text-[10px] px-1.5 py-0">
                  {creditsRemaining} credit{creditsRemaining === 1 ? "" : "s"}
                </Badge>
              </div>
              <p className="text-[11px] text-[var(--text-2)] leading-tight">
                {creditsRemaining > 0
                  ? "Credits refresh on billing cycle or on new pack purchase."
                  : "You have used your free analysis credit."}
              </p>
              <Link href="/app/upgrade" onClick={() => onClose()}>
                <Button variant="secondary" size="sm" className="w-full text-xs mt-1">
                  Upgrade
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link href="/app/upgrade" title="Upgrade plan">
                <div className="w-8 h-8 rounded-md bg-[var(--bg-2)] flex items-center justify-center text-[var(--candle)] border border-[var(--line)] hover:border-[var(--candle)] transition-colors">
                  ⚡
                </div>
              </Link>
            </div>
          )}

          {/* User identifier stub */}
          {!collapsed && (
            <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--text-2)]">
              <div className="flex items-center gap-2 truncate">
                <div className="w-5 h-5 rounded-full bg-[var(--bg-3)] border border-[var(--line)] flex items-center justify-center text-[10px] text-[var(--text-0)] font-bold">
                  D
                </div>
                <span className="truncate">Dev User</span>
              </div>
              <span className="text-[9px] px-1 rounded-xs bg-[var(--bg-3)] font-mono">v1.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
