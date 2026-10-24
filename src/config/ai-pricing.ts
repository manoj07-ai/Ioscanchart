/**
 * AI model pricing configuration.
 * TODO: Fill real prices from Google AI Studio pricing page before launch.
 * See docs/BACKLOG.md for this item.
 */

// TODO: Fill real prices from Google AI Studio pricing page before launch
// See docs/BACKLOG.md for this item
export interface ModelPricing {
  inputPerMillionTokens: number; // USD
  outputPerMillionTokens: number; // USD
}

export const AI_PRICING: Record<string, ModelPricing> = {
  "gemini-3.8-flash": { inputPerMillionTokens: 0, outputPerMillionTokens: 0 },
  "gemini-2.5-flash": { inputPerMillionTokens: 0, outputPerMillionTokens: 0 },
  "gemini-2.5-pro": { inputPerMillionTokens: 0, outputPerMillionTokens: 0 },
};

export function computeCostUsd(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = AI_PRICING[model] ?? {
    inputPerMillionTokens: 0,
    outputPerMillionTokens: 0,
  };
  return (
    (inputTokens * pricing.inputPerMillionTokens +
      outputTokens * pricing.outputPerMillionTokens) /
    1_000_000
  );
}
