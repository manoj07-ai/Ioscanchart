import * as React from "react";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils/cn";

export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  showText?: boolean;
  className?: string;
}

/**
 * Original Iosnapchart Brand Mark:
 * A stylized candlestick body with an upward pilot-arrow wick.
 * Clean, modern, distinct from competitor bulls and 'U' shapes.
 */
export function LogoMark({
  size = 32,
  className,
  ...props
}: {
  size?: number;
  className?: string;
} & React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-label={`${brand.name} logo mark`}
      {...props}
    >
      <defs>
        <linearGradient id="logo-candle-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5BE38C" />
          <stop offset="100%" stopColor="#B4F25C" />
        </linearGradient>
        <linearGradient id="logo-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#17231B" />
          <stop offset="100%" stopColor="#0B120D" />
        </linearGradient>
      </defs>

      {/* Rounded container with subtle border */}
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="10"
        fill="url(#logo-bg-grad)"
        stroke="#2C4132"
        strokeWidth="1.5"
      />

      {/* Lower wick */}
      <line
        x1="20"
        y1="31"
        x2="20"
        y2="34"
        stroke="#5BE38C"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Candlestick Body */}
      <rect
        x="14"
        y="15"
        width="12"
        height="15"
        rx="3"
        fill="url(#logo-candle-grad)"
      />

      {/* Upper wick that transforms into an upward pilot arrow */}
      <path
        d="M20 15V7M20 7L16 11M20 7L24 11"
        stroke="#B4F25C"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner spark / highlight on candle body */}
      <rect
        x="16"
        y="17"
        width="3"
        height="5"
        rx="1"
        fill="#FFFFFF"
        fillOpacity="0.35"
      />
    </svg>
  );
}

export function Logo({
  size = 32,
  showText = true,
  className,
}: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <LogoMark size={size} />
      {showText && (
        <span className="font-bold text-base tracking-tight text-[var(--text-0)] font-sans">
          {brand.name}
        </span>
      )}
    </div>
  );
}
