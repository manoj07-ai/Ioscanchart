import type { Trade } from "./schema";
import { parseAmountInput } from "./format";

export const CSV_HEADER =
  "Date,Symbol,P&L,R,Direction,Market,Entry,Exit,Quantity,Multiplier,Fees,Risk,SetupTags,MistakeTags,FollowedPlan,Notes";

export function generateCsvTemplate(): string {
  const sample1 =
    "2026-10-24,NIFTY,450.00,2.25,long,india-indices,24100,24250,75,1,12.50,200.00,Trend pullback,None,yes,Clean higher low retest";
  const sample2 =
    "2026-10-25,AAPL,-150.00,-1.0,short,us-equities,230.50,233.50,50,1,2.00,150.00,Breakout & retest,Early exit,partly,Exited prematurely before target";
  const sample3 =
    "2026-10-26,BTCUSDT,820.00,3.2,long,crypto,67000,69500,0.5,1,8.00,250.00,Liquidity sweep,None,yes,Weekend sweep of Asian lows";

  return [CSV_HEADER, sample1, sample2, sample3].join("\n");
}

export function exportTradesToCsv(trades: Trade[]): string {
  const rows = trades.map((t) => {
    const date = t.trade_date;
    const symbol = t.symbol;
    const pnl = t.pnl;
    const r = t.r_multiple !== null && t.r_multiple !== undefined ? t.r_multiple : "";
    const direction = t.direction || "";
    const market = t.market || "";
    const entry = t.entry_price || "";
    const exit = t.exit_price || "";
    const qty = t.quantity || "";
    const mult = t.multiplier || 1;
    const fees = t.fees || 0;
    const risk = t.risk_amount || "";
    const setupTags = (t.setup_tags || []).join(";");
    const mistakeTags = (t.mistake_tags || []).join(";");
    const followed = t.followed_plan || "";
    const note = t.note ? `"${t.note.replace(/"/g, '""')}"` : "";

    return [
      date,
      symbol,
      pnl,
      r,
      direction,
      market,
      entry,
      exit,
      qty,
      mult,
      fees,
      risk,
      setupTags,
      mistakeTags,
      followed,
      note,
    ].join(",");
  });

  return [CSV_HEADER, ...rows].join("\n");
}

export interface CsvValidationError {
  row: number;
  field: string;
  reason: string;
}

export interface CsvImportResult {
  validTrades: Omit<Trade, "id" | "user_id">[];
  errors: CsvValidationError[];
}

/**
 * Parses raw CSV text into rows, handling commas inside quotes.
 */
function parseCsvLines(csvText: string): string[][] {
  const lines: string[][] = [];
  const rawLines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

  for (const line of rawLines) {
    const row: string[] = [];
    let insideQuotes = false;
    let current = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip escaped quote
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    lines.push(row);
  }

  return lines;
}

export function parseAndValidateCsv(csvText: string): CsvImportResult {
  const lines = parseCsvLines(csvText);
  if (lines.length < 2) {
    return {
      validTrades: [],
      errors: [{ row: 0, field: "header", reason: "CSV must contain a header and at least one data row" }],
    };
  }

  const rawHeaders = lines[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const headerMap: Record<string, number> = {};

  rawHeaders.forEach((h, idx) => {
    if (h.includes("date")) headerMap["date"] = idx;
    else if (h.includes("sym") || h.includes("ticker")) headerMap["symbol"] = idx;
    else if (h === "pl" || h.includes("pnl") || h.includes("profit") || h.includes("loss")) headerMap["pnl"] = idx;
    else if (h === "r" || h.includes("multiple")) headerMap["r"] = idx;
    else if (h.includes("dir") || h.includes("side") || h.includes("type")) headerMap["direction"] = idx;
    else if (h.includes("market")) headerMap["market"] = idx;
    else if (h.includes("entry")) headerMap["entry"] = idx;
    else if (h.includes("exit")) headerMap["exit"] = idx;
    else if (h.includes("qty") || h.includes("quantity") || h.includes("size") || h.includes("shares") || h.includes("lots")) headerMap["quantity"] = idx;
    else if (h.includes("mult") || h.includes("lotsize")) headerMap["multiplier"] = idx;
    else if (h.includes("fee") || h.includes("comm")) headerMap["fees"] = idx;
    else if (h.includes("risk")) headerMap["risk"] = idx;
    else if (h.includes("setup")) headerMap["setup_tags"] = idx;
    else if (h.includes("mistake")) headerMap["mistake_tags"] = idx;
    else if (h.includes("follow") || h.includes("plan")) headerMap["followed_plan"] = idx;
    else if (h.includes("note") || h.includes("comment")) headerMap["note"] = idx;
  });

  if (headerMap["date"] === undefined || headerMap["symbol"] === undefined || headerMap["pnl"] === undefined) {
    return {
      validTrades: [],
      errors: [
        {
          row: 1,
          field: "header",
          reason: "Required columns missing. CSV must include Date, Symbol, and P&L columns.",
        },
      ],
    };
  }

  const validTrades: Omit<Trade, "id" | "user_id">[] = [];
  const errors: CsvValidationError[] = [];

  for (let r = 1; r < lines.length; r++) {
    const row = lines[r];
    const rowNum = r + 1; // 1-based index including header

    const rawDate = row[headerMap["date"]] || "";
    const rawSymbol = row[headerMap["symbol"]] || "";
    const rawPnl = row[headerMap["pnl"]] || "";

    // Validate Date
    let dateStr = rawDate.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      // Attempt conversion from DD/MM/YYYY or MM/DD/YYYY if possible
      const parts = dateStr.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          dateStr = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
        }
      }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      errors.push({
        row: rowNum,
        field: "date",
        reason: `Invalid date "${rawDate}". Format must be YYYY-MM-DD.`,
      });
      continue;
    }

    // Validate Symbol
    const symbol = rawSymbol.trim().toUpperCase();
    if (!symbol) {
      errors.push({ row: rowNum, field: "symbol", reason: "Symbol cannot be empty." });
      continue;
    }

    // Validate P&L
    const parsedPnl = parseAmountInput(rawPnl);
    if (!parsedPnl.ok) {
      errors.push({ row: rowNum, field: "pnl", reason: parsedPnl.error });
      continue;
    }

    // Optional fields
    let rMultiple: number | null = null;
    if (headerMap["r"] !== undefined && row[headerMap["r"]]) {
      const numR = parseFloat(row[headerMap["r"]]);
      if (!isNaN(numR)) rMultiple = numR;
    }

    let direction: "long" | "short" | null = null;
    if (headerMap["direction"] !== undefined && row[headerMap["direction"]]) {
      const dirLower = row[headerMap["direction"]].toLowerCase().trim();
      if (dirLower.startsWith("l") || dirLower === "buy") direction = "long";
      else if (dirLower.startsWith("s") || dirLower === "sell") direction = "short";
    }

    const market = headerMap["market"] !== undefined ? row[headerMap["market"]] || null : null;
    const entry = headerMap["entry"] !== undefined && row[headerMap["entry"]] ? parseFloat(row[headerMap["entry"]]) : null;
    const exit = headerMap["exit"] !== undefined && row[headerMap["exit"]] ? parseFloat(row[headerMap["exit"]]) : null;
    const quantity = headerMap["quantity"] !== undefined && row[headerMap["quantity"]] ? parseFloat(row[headerMap["quantity"]]) : null;
    const multiplier = headerMap["multiplier"] !== undefined && row[headerMap["multiplier"]] ? parseFloat(row[headerMap["multiplier"]]) || 1 : 1;
    const fees = headerMap["fees"] !== undefined && row[headerMap["fees"]] ? parseFloat(row[headerMap["fees"]]) || 0 : 0;
    const risk = headerMap["risk"] !== undefined && row[headerMap["risk"]] ? parseFloat(row[headerMap["risk"]]) : null;

    const setupTags =
      headerMap["setup_tags"] !== undefined && row[headerMap["setup_tags"]]
        ? row[headerMap["setup_tags"]]
            .split(/[;,]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0 && s.toLowerCase() !== "none")
        : [];

    const mistakeTags =
      headerMap["mistake_tags"] !== undefined && row[headerMap["mistake_tags"]]
        ? row[headerMap["mistake_tags"]]
            .split(/[;,]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0 && s.toLowerCase() !== "none")
        : [];

    let followedPlan: "yes" | "partly" | "no" | null = null;
    if (headerMap["followed_plan"] !== undefined && row[headerMap["followed_plan"]]) {
      const f = row[headerMap["followed_plan"]].toLowerCase().trim();
      if (f.startsWith("y")) followedPlan = "yes";
      else if (f.startsWith("p")) followedPlan = "partly";
      else if (f.startsWith("n")) followedPlan = "no";
    }

    const note = headerMap["note"] !== undefined ? row[headerMap["note"]] || null : null;

    validTrades.push({
      trade_date: dateStr,
      symbol,
      pnl: parsedPnl.value,
      currency: "USD",
      r_multiple: rMultiple,
      direction,
      market,
      entry_price: entry,
      exit_price: exit,
      quantity,
      multiplier,
      fees,
      risk_amount: risk,
      setup_tags: setupTags,
      mistake_tags: mistakeTags,
      followed_plan: followedPlan,
      note,
    });
  }

  return { validTrades, errors };
}
