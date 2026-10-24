import React from "react";
import { AnalysisView } from "@/components/analysis/AnalysisView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Analysis Breakdown | Ioscanchart",
  description: "Detailed trade plan with levels, scenarios, and invalidation rules.",
};

export default async function AnalysisResultPage(props: PageProps) {
  const { id } = await props.params;

  return <AnalysisView analysisId={id} />;
}
