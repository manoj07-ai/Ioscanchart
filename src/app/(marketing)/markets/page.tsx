import { MarketsDeepDive } from "@/components/marketing/MarketsDeepDive";
import { MarketTickerStrip } from "@/components/marketing/MarketTickerStrip";

export const metadata = {
  title: "Markets Covered",
  description: "Comprehensive technical analysis across US Equities, Indian Indices, Options, Forex, Crypto, and Commodities.",
};

export default function MarketsPage() {
  return (
    <div className="py-12 space-y-12">
      <MarketTickerStrip />
      <MarketsDeepDive />
    </div>
  );
}
