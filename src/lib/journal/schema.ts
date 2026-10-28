import { z } from "zod";

export const CURRENCIES = ["USD", "INR", "EUR", "GBP", "AUD", "JPY", "POINTS"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const MISTAKE_TAGS = [
  "FOMO",
  "Moved stop",
  "Oversized",
  "Early exit",
  "Revenge trade",
  "No setup / Boredom",
  "Chased breakout",
  "Ignored higher TF",
] as const;
export type MistakeTag = (typeof MISTAKE_TAGS)[number];

export const COMMON_SETUP_TAGS = [
  "Trend pullback",
  "Breakout & retest",
  "Supply rejection",
  "Demand bounce",
  "Liquidity sweep",
  "Range reversal",
  "Opening drive",
  "VWAP cross",
] as const;

export const TradeSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().optional(),
  analysis_id: z.string().uuid().nullable().optional(),
  trade_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((dateStr) => {
      // Reject dates more than 1 day in the future
      const target = new Date(dateStr + "T00:00:00Z");
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(23, 59, 59, 999);
      return target.getTime() <= tomorrow.getTime();
    }, "Trade date cannot be in the future"),
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .max(20, "Symbol is too long")
    .transform((val) => val.trim().toUpperCase()),
  market: z.string().nullable().optional(),
  direction: z.enum(["long", "short"]).nullable().optional(),
  pnl: z
    .number()
    .min(-1e9, "Amount is too negative")
    .max(1e9, "Amount exceeds 1,000,000,000 limit"),
  currency: z.string().optional().default("USD"),
  r_multiple: z.number().nullable().optional(),
  entry_price: z.number().positive().nullable().optional(),
  exit_price: z.number().positive().nullable().optional(),
  quantity: z.number().positive().nullable().optional(),
  multiplier: z.number().positive().optional().default(1),
  fees: z.number().nonnegative().optional().default(0),
  risk_amount: z.number().positive().nullable().optional(),
  setup_tags: z.array(z.string()).optional().default([]),
  mistake_tags: z.array(z.string()).optional().default([]),
  followed_plan: z.enum(["yes", "partly", "no"]).nullable().optional(),
  note: z.string().max(2000, "Note too long").nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export interface Trade {
  id?: string;
  user_id?: string;
  analysis_id?: string | null;
  trade_date: string;
  symbol: string;
  market?: string | null;
  direction?: "long" | "short" | null;
  pnl: number;
  currency?: string;
  r_multiple?: number | null;
  entry_price?: number | null;
  exit_price?: number | null;
  quantity?: number | null;
  multiplier?: number;
  fees?: number;
  risk_amount?: number | null;
  setup_tags?: string[];
  mistake_tags?: string[];
  followed_plan?: "yes" | "partly" | "no" | null;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const JournalDaySchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Day must be YYYY-MM-DD"),
  note: z.string().max(3000, "Note too long").nullable().optional(),
  mood: z.number().int().min(1).max(5).nullable().optional(),
});

export type JournalDay = z.infer<typeof JournalDaySchema>;

export const JournalSettingsSchema = z.object({
  currency: z.string().default("USD"),
  weekStart: z.union([z.literal(0), z.literal(1)]).default(1), // 1 = Monday, 0 = Sunday
  showWeekends: z.boolean().default(false),
  privacyBlur: z.boolean().default(false),
  defaultView: z.enum(["pnl", "r"]).default("pnl"),
  timezone: z.string().optional(),
});

export type JournalSettings = z.infer<typeof JournalSettingsSchema>;

export const DEFAULT_JOURNAL_SETTINGS: JournalSettings = {
  currency: "USD",
  weekStart: 1,
  showWeekends: false,
  privacyBlur: false,
  defaultView: "pnl",
};
