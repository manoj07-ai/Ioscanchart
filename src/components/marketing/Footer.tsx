import * as React from "react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { DISCLAIMER_SHORT } from "@/config/legal";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-0)] pt-16 pb-24 md:pb-16 text-xs text-[var(--text-2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Logo size={32} />
            <p className="text-xs text-[var(--text-1)] max-w-sm leading-relaxed">
              {brand.tagline}
            </p>
            <div className="text-[11px] font-mono text-[var(--text-2)]">
              Support:{" "}
              <a
                href={`mailto:${brand.supportEmail}`}
                className="text-[var(--text-1)] hover:text-[var(--candle)] transition-colors underline"
              >
                {brand.supportEmail}
              </a>
            </div>
          </div>

          <div>
            <div className="font-semibold text-[var(--text-0)] text-xs uppercase tracking-wider mb-3">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#demo" className="hover:text-[var(--text-0)] transition-colors">
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[var(--text-0)] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[var(--text-0)] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[var(--text-0)] transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-[var(--text-0)] text-xs uppercase tracking-wider mb-3">
              Markets
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#markets" className="hover:text-[var(--text-0)] transition-colors">
                  US Equities &amp; ETFs
                </a>
              </li>
              <li>
                <a href="#markets" className="hover:text-[var(--text-0)] transition-colors">
                  Indian Indices (NIFTY)
                </a>
              </li>
              <li>
                <a href="#markets" className="hover:text-[var(--text-0)] transition-colors">
                  NSE/BSE Equities
                </a>
              </li>
              <li>
                <a href="#markets" className="hover:text-[var(--text-0)] transition-colors">
                  Option Chains &amp; OI
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-[var(--text-0)] text-xs uppercase tracking-wider mb-3">
              Legal &amp; Compliance
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/disclaimer" className="hover:text-[var(--text-0)] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/risk" className="hover:text-[var(--text-0)] transition-colors">
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--text-0)] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--text-0)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Callout Box */}
        <div className="p-4 rounded-xl bg-[var(--bg-1)] border border-[var(--line)] text-[11px] leading-relaxed text-[var(--text-2)]">
          <strong className="text-[var(--text-1)] block mb-1">Regulatory Notice:</strong>
          {DISCLAIMER_SHORT}
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[var(--line)]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {currentYear} {brand.name}. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/disclaimer" className="hover:text-[var(--text-0)]">
              Disclaimer
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[var(--text-0)]">
              Terms
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[var(--text-0)]">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
