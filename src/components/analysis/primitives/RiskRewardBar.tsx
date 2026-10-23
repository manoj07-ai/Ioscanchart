import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { formatRR } from "@/lib/utils/formatters";

export interface RiskRewardBarProps extends React.HTMLAttributes<HTMLDivElement> {
  riskReward: number; // e.g. 2.5 means 1:2.5
  riskLabel?: string;
  rewardLabel?: string;
}

export function RiskRewardBar({
  riskReward,
  riskLabel = "Risk (1R)",
  rewardLabel = "Reward",
  className,
  ...props
}: RiskRewardBarProps) {
  // Normalize ratio: 1 part risk, `riskReward` parts reward
  const total = 1 + Math.max(riskReward, 0.1);
  const riskPercent = (1 / total) * 100;
  const rewardPercent = (riskReward / total) * 100;

  return (
    <div className={cn("w-full flex flex-col space-y-1.5", className)} {...props}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--bear)] font-medium flex items-center gap-1">
          <span className="text-[10px]">▼</span> {riskLabel}
        </span>
        <span className="font-mono font-bold text-xs text-[var(--text-0)] px-2 py-0.5 rounded bg-[var(--bg-3)] border border-[var(--line)]">
          {formatRR(riskReward)}
        </span>
        <span className="text-[var(--candle)] font-medium flex items-center gap-1">
          {rewardLabel} <span className="text-[10px]">▲</span>
        </span>
      </div>

      <div
        className="h-3 w-full rounded-full overflow-hidden flex border border-[var(--line-strong)] bg-[var(--bg-1)] p-0.5 gap-1"
        role="meter"
        aria-label={`Risk Reward Ratio ${formatRR(riskReward)}`}
        aria-valuenow={riskReward}
      >
        {/* Risk segment (coral) */}
        <div
          style={{ width: `${riskPercent}%` }}
          className="h-full rounded-l-full bg-gradient-to-r from-[var(--bear-dim)] to-[var(--bear)] transition-all duration-300"
          title={`Risk portion: 1.0`}
        />
        {/* Reward segment (candle green) */}
        <div
          style={{ width: `${rewardPercent}%` }}
          className="h-full rounded-r-full bg-gradient-to-r from-[var(--candle)] to-[var(--candle-hi)] transition-all duration-300"
          title={`Reward portion: ${riskReward.toFixed(1)}`}
        />
      </div>
    </div>
  );
}
