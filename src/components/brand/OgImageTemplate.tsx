import * as React from "react";
import { brand } from "@/config/brand";

export interface OgImageProps {
  title?: string;
  subtitle?: string;
  badge?: string;
}

/**
 * Standard 1200x630 OpenGraph / Social preview card template.
 */
export function OgImageTemplate({
  title = brand.name,
  subtitle = brand.tagline,
  badge = "AI Chart Analysis Terminal",
}: OgImageProps) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#060A07",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(91, 227, 140, 0.12), transparent 45%), radial-gradient(circle at 15% 85%, rgba(180, 242, 92, 0.08), transparent 45%)",
        color: "#F2F7F3",
        fontFamily: "Geist, sans-serif",
        border: "1px solid #1F2E24",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: "#111A14",
              border: "1.5px solid #2C4132",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 28, color: "#5BE38C" }}>▲</span>
          </div>
          <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: "#F2F7F3" }}>
            {brand.name}
          </span>
        </div>

        <div
          style={{
            padding: "8px 18px",
            borderRadius: 9999,
            backgroundColor: "#17231B",
            border: "1px solid #2C4132",
            fontSize: 16,
            fontWeight: 600,
            color: "#B4F25C",
          }}
        >
          {badge}
        </div>
      </div>

      {/* Main Pitch */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "#F2F7F3",
            margin: 0,
            maxWidth: 950,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 24,
            lineHeight: 1.5,
            color: "#BFCBC3",
            margin: 0,
            maxWidth: 880,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Footer Info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #1F2E24",
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", gap: 28, fontSize: 16, color: "#7F8F85" }}>
          <span>Wall Street to Dalal Street</span>
          <span>•</span>
          <span>Market Structure</span>
          <span>•</span>
          <span>Key Levels & Invalidation</span>
        </div>
        <div style={{ fontSize: 16, color: "#5BE38C", fontWeight: 600 }}>
          {brand.domain}
        </div>
      </div>
    </div>
  );
}
