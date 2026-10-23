/**
 * Market packs — injected context for the Gemini prompt based on the detected market.
 * Full pack content (sessions, lot sizes, expiry, etc.) built in Prompt 04.
 */

import type { MarketPackId } from "@/config/markets";

export interface MarketPackContext {
  id: MarketPackId;
  systemContext: string; // injected into Gemini system prompt
}

/** Stub — full pack content implemented in Prompt 04 */
export function getMarketPackContext(packId: MarketPackId): MarketPackContext {
  return {
    id: packId,
    systemContext: `[Market Pack: ${packId}] — Full context will be added in Prompt 04.`,
  };
}
