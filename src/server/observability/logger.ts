/**
 * Structured Logging & Error Tracking for Analysis Lifecycle
 */

export interface AnalysisLifecycleLog {
  analysisId: string;
  userId?: string;
  marketPack: string;
  stage: "started" | "reading" | "completed" | "failed";
  latencyMs?: number;
  costUsd?: number;
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  outcome?: "long" | "short" | "wait";
  dataQualityScore?: number;
  error?: string;
}

export function logAnalysisLifecycle(event: AnalysisLifecycleLog): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: "analysis_lifecycle",
    ...event,
  };

  if (process.env.NODE_ENV === "production") {
    // Structured JSON log output for CloudWatch, GCP Logging, or Datadog ingestion
    console.log(JSON.stringify(logEntry));
  } else {
    console.log(
      `[Analysis ${event.stage.toUpperCase()}] ID: ${event.analysisId} | Pack: ${event.marketPack}${
        event.latencyMs !== undefined ? ` | Latency: ${event.latencyMs}ms` : ""
      }${event.costUsd !== undefined ? ` | Cost: $${event.costUsd.toFixed(5)}` : ""}${
        event.outcome ? ` | Stance: ${event.outcome}` : ""
      }${event.dataQualityScore !== undefined ? ` | Quality: ${event.dataQualityScore}/100` : ""}${
        event.error ? ` | Error: ${event.error}` : ""
      }`
    );
  }

  if (event.error && process.env.SENTRY_DSN) {
    reportToSentry(new Error(event.error), { extra: event });
  }
}

/**
 * Sentry error reporting placeholder behind SENTRY_DSN env var.
 */
export function reportToSentry(err: unknown, context?: Record<string, unknown>): void {
  if (!process.env.SENTRY_DSN) return;

  // When @sentry/nextjs is configured in production:
  // Sentry.captureException(err, { extra: context });
  console.warn(
    `[Sentry Error Captured] ${err instanceof Error ? err.message : String(err)}`,
    context
  );
}
