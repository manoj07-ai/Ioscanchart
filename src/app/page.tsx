import { brand } from "@/config/brand";
import { MARKET_PACK_LIST } from "@/config/markets";

/**
 * Placeholder home page — Bootstrap (Prompt 01).
 * This will be replaced by the full marketing landing page in Prompt 03.
 * Uses brand.name — never hardcoded.
 */
export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
        background: "var(--bg-0)",
      }}
    >
      {/* Logo mark placeholder */}
      <div
        aria-hidden="true"
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: "linear-gradient(135deg, var(--candle), var(--candle-hi))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        📈
      </div>

      <div style={{ textAlign: "center", maxWidth: 640 }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text-0)",
            marginBottom: "0.75rem",
          }}
        >
          {brand.name}
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-1)",
            lineHeight: 1.6,
          }}
        >
          {brand.tagline}
        </p>
      </div>

      {/* Status badge */}
      <div
        style={{
          padding: "0.5rem 1rem",
          borderRadius: 9999,
          background: "var(--candle-dim)",
          border: "1px solid var(--candle)",
          color: "var(--candle)",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        🚧 Bootstrap — Prompt 01 complete
      </div>

      {/* Market packs preview */}
      <div style={{ maxWidth: 640, width: "100%" }}>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-2)",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "1rem",
          }}
        >
          Supported Markets ({MARKET_PACK_LIST.length} packs)
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          {MARKET_PACK_LIST.map((pack) => (
            <span
              key={pack.id}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: 9999,
                background: "var(--bg-2)",
                border: "1px solid var(--line)",
                color: pack.coverage === "beta" ? "var(--amber)" : "var(--text-1)",
                fontSize: "0.8125rem",
              }}
            >
              {pack.icon} {pack.shortName}
              {pack.coverage === "beta" && (
                <span
                  style={{
                    marginLeft: "0.375rem",
                    fontSize: "0.625rem",
                    opacity: 0.8,
                  }}
                >
                  BETA
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Health check link */}
      <a
        href="/api/health"
        style={{
          color: "var(--info)",
          fontSize: "0.875rem",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        /api/health ↗
      </a>
    </main>
  );
}
