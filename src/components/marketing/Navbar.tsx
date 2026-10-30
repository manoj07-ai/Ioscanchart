"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics/track";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Markets", href: "#markets" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-[var(--bg-0)]/85 backdrop-blur-md border-b border-[var(--line)] py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => track("nav_logo_clicked")}
          className="focus-visible:outline-none"
        >
          <Logo size={32} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-[var(--text-1)] hover:text-[var(--text-0)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/app">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => track("nav_signin_clicked")}
            >
              Sign In
            </Button>
          </Link>
          <Link href="/app">
            <Button
              variant="primary-gradient"
              size="sm"
              onClick={() => track("nav_analyze_clicked")}
            >
              Analyze a chart
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[var(--text-1)] hover:text-[var(--text-0)] focus-visible:outline-none"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-1)] border-b border-[var(--line)] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-[var(--text-1)] hover:text-[var(--text-0)] py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-[var(--line)]/50 flex flex-col gap-2.5">
            <Link href="/app" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="secondary" size="md" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/app" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary-gradient" size="md" className="w-full">
                Analyze a chart
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
