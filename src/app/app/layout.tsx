"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopBar } from "@/components/app/AppTopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("ioscan_sidebar_collapsed") === "true") {
        setCollapsed(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ioscan_sidebar_collapsed", String(next));
      } catch {
        // Ignore write error
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-0)] text-[var(--text-1)]">
      {/* Sidebar */}
      <AppSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main View Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto focus:outline-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
