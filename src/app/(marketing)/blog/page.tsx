import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trading Journal & Execution Blog | IoSnapChart",
  description:
    "Original, practitioner-focused research on trade logging, expectancy math, risk management, and market psychology.",
};

const POSTS = [
  {
    slug: "how-to-keep-a-trading-journal",
    title: "How to Keep a Trading Journal (With a Free Template)",
    description:
      "A step-by-step masterclass on transforming raw trade executions into an operational feedback loop. Includes downloadable CSV template.",
    readTime: "7 min read",
    date: "October 2026",
    tag: "Journaling",
  },
  {
    slug: "what-to-record-in-a-trading-journal",
    title: "What to Record in a Trading Journal: 15 Fields That Matter",
    description:
      "Beyond entry and exit prices: the quantitative and psychological metrics that reveal your actual trading edge.",
    readTime: "8 min read",
    date: "October 2026",
    tag: "Risk & Process",
  },
  {
    slug: "win-rate-vs-expectancy",
    title: "Win Rate vs Expectancy: Why a 40% Win Rate Can Still Work",
    description:
      "The mathematical reality of asymmetric risk-to-reward. Why high win rates without risk discipline guarantee account blow-ups.",
    readTime: "6 min read",
    date: "October 2026",
    tag: "Probability",
  },
  {
    slug: "how-to-read-your-trading-pnl-calendar",
    title: "How to Read Your Trading P&L Calendar",
    description:
      "Learn to interpret color tinting, intensity scaling, and weekly clustering to identify tilt and protect mental capital.",
    readTime: "6 min read",
    date: "October 2026",
    tag: "Analytics",
  },
  {
    slug: "how-to-take-a-chart-screenshot-ai-can-read",
    title: "How to Take a Chart Screenshot AI Can Read",
    description:
      "Master the 5 essential screenshot habits that ensure multimodal AI models accurately detect ticker symbols, timeframes, price scales, and indicator readings.",
    readTime: "5 min read",
    date: "October 2026",
    tag: "Image Hygiene",
  },
  {
    slug: "reading-an-option-chain-oi-pcr-max-pain",
    title: "Reading an Option Chain: Open Interest (OI), PCR, and Max Pain",
    description:
      "A practitioner's guide to deciphering option chains in Indian and US markets. Learn how Open Interest build-up and Max Pain identify institutional support and resistance.",
    readTime: "7 min read",
    date: "October 2026",
    tag: "Derivatives",
  },
  {
    slug: "why-a-good-plan-starts-with-invalidation",
    title: "Why a Good Trading Plan Starts With Invalidation, Not Entry",
    description:
      "Amateur traders obsess over finding the perfect entry price. Professional traders begin with the invalidation point. Here is why structural invalidation dictates longevity.",
    readTime: "6 min read",
    date: "October 2026",
    tag: "Risk Philosophy",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[var(--bg-2)] border border-[var(--line)] text-[var(--candle)]">
          <span>📚</span>
          <span>IoSnapChart Insights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans">
          Trading Psychology & Execution Blog
        </h1>
        <p className="text-sm text-[var(--text-2)] max-w-xl leading-relaxed">
          Rigorous, practitioner-grade guides on risk mathematics, journaling frameworks, and execution psychology.
        </p>
      </div>

      <div className="space-y-4">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--candle)]/50 hover:bg-[var(--bg-2)]/60 transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-2)]">
              <span className="px-2 py-0.5 rounded bg-[var(--bg-2)] border border-[var(--line)] text-[var(--candle)]">
                {post.tag}
              </span>
              <span>
                {post.date} · {post.readTime}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] group-hover:text-[var(--candle)] transition-colors">
              {post.title}
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-2)] leading-relaxed">
              {post.description}
            </p>

            <div className="pt-2 text-xs font-semibold text-[var(--candle)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Read Guide →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
