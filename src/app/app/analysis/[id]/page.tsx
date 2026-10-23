import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisResultPage(props: PageProps) {
  const { id } = await props.params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-0)]">
            Analysis Result
          </h1>
          <p className="text-xs text-[var(--text-2)] font-mono mt-0.5">
            ID: {id}
          </p>
        </div>
        <Link href="/app">
          <Button variant="secondary" size="sm">
            ← Analyze another chart
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-8 text-center space-y-3">
        <div className="text-3xl">📊</div>
        <h2 className="text-sm font-semibold text-[var(--text-0)]">
          Analysis generated successfully
        </h2>
        <p className="text-xs text-[var(--text-2)] max-w-md mx-auto leading-relaxed">
          The full interactive breakdown view (interactive candlestick chart with overlays, level cards, scenario pathways, and trading journal sync) will be built in Prompt 06.
        </p>
      </div>
    </div>
  );
}
