export interface FormatMoneyOptions {
  signDisplay?: "always" | "auto" | "never";
  compact?: boolean;
  privacyBlur?: boolean;
  decimals?: number;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  JPY: "¥",
  POINTS: "",
};

/**
 * Formats a monetary or point amount according to international currency rules.
 * CRITICAL RULE:
 * Negatives must ALWAYS render as `-$150.00`, NEVER `$-150.00`.
 * INR uses `en-IN` numbering grouping (e.g., ₹1,50,000.00).
 * If privacyBlur is on, returns '••••'.
 */
export function formatMoney(
  value: number,
  currency: string = "USD",
  opts: FormatMoneyOptions = {}
): string {
  if (opts.privacyBlur) {
    return "••••";
  }

  const { signDisplay = "auto", compact = false, decimals = 2 } = opts;
  const curr = currency.toUpperCase();
  const isPoints = curr === "POINTS";
  const sym = CURRENCY_SYMBOLS[curr] ?? (isPoints ? "" : "$");
  const isNegative = value < 0;
  const isPositive = value > 0;
  const absValue = Math.abs(value);

  const locale = curr === "INR" ? "en-IN" : "en-US";

  let numFormatted: string;
  if (compact && absValue >= 1000) {
    numFormatted = new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(absValue);
  } else {
    numFormatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: curr === "JPY" ? 0 : decimals,
      maximumFractionDigits: curr === "JPY" ? 0 : decimals,
    }).format(absValue);
  }

  let prefix = "";
  if (isNegative) {
    prefix = "-";
  } else if (isPositive && signDisplay === "always") {
    prefix = "+";
  }

  if (isPoints) {
    return `${prefix}${numFormatted} pts`;
  }

  return `${prefix}${sym}${numFormatted}`;
}

/**
 * Parses user amount inputs like:
 * - `+250`
 * - `-80`
 * - `1,250.50`
 * - `(80)` (parentheses notation for negative)
 * - `$500` or `₹1,000`
 */
export function parseAmountInput(input: string): { ok: true; value: number } | { ok: false; error: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: "Please enter an amount" };
  }

  let cleaned = trimmed.replace(/[$₹€£A\s]/g, "");

  // Parentheses notation: (80) -> -80
  if (cleaned.startsWith("(") && cleaned.endsWith(")")) {
    cleaned = "-" + cleaned.slice(1, -1);
  }

  // Remove commas used in formatting (1,250.50 -> 1250.50)
  cleaned = cleaned.replace(/,/g, "");

  const num = Number(cleaned);
  if (isNaN(num)) {
    return { ok: false, error: "Invalid numeric amount" };
  }

  if (Math.abs(num) > 1e9) {
    return { ok: false, error: "Amount cannot exceed 1,000,000,000" };
  }

  return { ok: true, value: Math.round(num * 100) / 100 };
}

/**
 * Calculates net P&L from trade fills.
 */
export function deriveFromFills(opts: {
  direction?: "long" | "short" | null;
  entry?: number | null;
  exit?: number | null;
  quantity?: number | null;
  multiplier?: number;
  fees?: number;
}): number | null {
  const { direction, entry, exit, quantity, multiplier = 1, fees = 0 } = opts;
  if (!entry || !exit || !quantity || quantity <= 0) {
    return null;
  }

  const mult = multiplier > 0 ? multiplier : 1;
  let gross = 0;
  if (direction === "short") {
    gross = (entry - exit) * quantity * mult;
  } else {
    // Default long
    gross = (exit - entry) * quantity * mult;
  }

  return Math.round((gross - (fees || 0)) * 100) / 100;
}

/**
 * Derives R-multiple given P&L and planned risk amount.
 */
export function deriveR(pnl: number, riskAmount?: number | null): number | null {
  if (!riskAmount || riskAmount <= 0) return null;
  return Math.round((pnl / riskAmount) * 1000) / 1000;
}
