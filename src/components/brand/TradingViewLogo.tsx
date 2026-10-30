import React from "react";

interface TradingViewLogoProps {
  className?: string;
  size?: number;
}

export function TradingViewLogo({ className = "w-4 h-4", size }: TradingViewLogoProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="TradingView Logo"
    >
      <path d="M19.743 14.512c-1.42 0-2.57 1.15-2.57 2.57s1.15 2.57 2.57 2.57 2.57-1.15 2.57-2.57-1.15-2.57-2.57-2.57zm-1.04-10.158L13.125 18.52h3.045l5.578-14.166h-3.045zm-7.665 0H2v4.832h6.059V18.52h3.044V4.354h-.065z" />
    </svg>
  );
}
