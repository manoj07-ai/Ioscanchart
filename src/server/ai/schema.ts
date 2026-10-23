/**
 * Zod schema for analysis results + JSON schema for Gemini responseSchema.
 *
 * 🔒 SERVER ONLY — never import in client components.
 */

import { z } from "zod";
import type { MarketPackId } from "@/config/markets";

// ---------------------------------------------------------------------------
// Primitive types
// ---------------------------------------------------------------------------

const BiasSchema = z.enum(["bull", "bear", "neutral"]);
const StanceSchema = z.enum(["long", "short", "wait"]);
const StrengthSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
const ConfidenceLevelSchema = z.enum(["low", "medium", "high"]);

const MarketPackIdSchema = z.enum([
  "us-equities",
  "forex",
  "crypto",
  "commodities",
  "global-indices",
  "india-indices",
  "india-equities",
  "india-options",
] as const satisfies readonly [MarketPackId, ...MarketPackId[]]);

// ---------------------------------------------------------------------------
// Sub-schemas
// ---------------------------------------------------------------------------

const DataQualitySchema = z.object({
  readable: z.boolean(),
  score: z.number().int().min(0).max(100),
  detected: z.object({
    symbol: z.string().optional(),
    market: MarketPackIdSchema.optional(),
    timeframe: z.string().optional(),
    priceScaleVisible: z.boolean(),
    indicatorsSeen: z.array(z.string()),
  }),
  issues: z.array(z.string()),
  userActionNeeded: z.string().optional(),
});

const InstrumentSchema = z.object({
  symbol: z.string(),
  market: MarketPackIdSchema,
  timeframe: z.string(),
  currency: z.string().optional(),
  lastPrice: z.number().optional(),
});

const StructureSchema = z.object({
  trend: z.enum(["up", "down", "range", "transition"]),
  phase: z.string(),
  summary: z.string(),
  keyObservations: z.array(z.string()),
});

const LevelSchema = z.object({
  type: z.enum([
    "support",
    "resistance",
    "pivot",
    "supply_zone",
    "demand_zone",
    "fib",
    "moving_average",
    "liquidity",
  ]),
  price: z.number().optional(),
  zone: z.tuple([z.number(), z.number()]).optional(),
  strength: StrengthSchema,
  reason: z.string(),
  visibleEvidence: z.string(),
});

const IndicatorSchema = z.object({
  name: z.string(),
  reading: z.string(),
  implication: z.string(),
  bias: BiasSchema,
});

const ScenarioSchema = z.object({
  name: z.string(),
  bias: BiasSchema,
  trigger: z.string(),
  path: z.string(),
  targets: z.array(z.number()),
  modelConfidence: ConfidenceLevelSchema,
  confidenceNote: z.string(),
});

const EntrySchema = z.object({
  type: z.enum(["zone", "level", "breakout", "pullback"]),
  priceOrZone: z.union([z.number(), z.tuple([z.number(), z.number()])]),
  reasoning: z.string(),
});

const TargetSchema = z.object({
  price: z.number(),
  rr: z.number(),
});

const PlanSchema = z.object({
  stance: StanceSchema,
  entry: EntrySchema.optional(),
  stop: z
    .object({
      price: z.number(),
      reasoning: z.string(),
    })
    .optional(),
  targets: z.array(TargetSchema).optional(),
  riskPercent: z.number().optional(),
  invalidation: z.string(),
  summary: z.string(),
});

const MetaSchema = z.object({
  promptVersion: z.string(),
  marketPack: MarketPackIdSchema,
  analysisId: z.string().optional(),
  disclaimer: z.string(),
});

// ---------------------------------------------------------------------------
// Main schema (without refinements first — for composability)
// ---------------------------------------------------------------------------

const AnalysisResultBaseSchema = z.object({
  dataQuality: DataQualitySchema,
  instrument: InstrumentSchema,
  structure: StructureSchema,
  levels: z.array(LevelSchema),
  indicators: z.array(IndicatorSchema),
  scenarios: z.array(ScenarioSchema),
  plan: PlanSchema,
  meta: MetaSchema,
});

// ---------------------------------------------------------------------------
// Helper: get lowest bound of entry priceOrZone
// ---------------------------------------------------------------------------

function getEntryLow(priceOrZone: number | [number, number]): number {
  if (Array.isArray(priceOrZone)) return Math.min(...priceOrZone);
  return priceOrZone;
}

function getEntryHigh(priceOrZone: number | [number, number]): number {
  if (Array.isArray(priceOrZone)) return Math.max(...priceOrZone);
  return priceOrZone;
}

function getEntryMid(priceOrZone: number | [number, number]): number {
  if (Array.isArray(priceOrZone)) return (priceOrZone[0] + priceOrZone[1]) / 2;
  return priceOrZone;
}

// ---------------------------------------------------------------------------
// Main schema WITH refinements
// ---------------------------------------------------------------------------

export const AnalysisResultSchema = AnalysisResultBaseSchema.superRefine(
  (data, ctx) => {
    // Refinement 1: unreadable → stance must be 'wait'
    if (!data.dataQuality.readable && data.plan.stance !== "wait") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["plan", "stance"],
        message:
          "When dataQuality.readable is false, plan.stance must be 'wait'.",
      });
    }

    // Refinements 2 & 3: stop placement
    if (data.plan.stance === "long" && data.plan.stop && data.plan.entry) {
      const entryLow = getEntryLow(data.plan.entry.priceOrZone);
      if (data.plan.stop.price >= entryLow) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["plan", "stop", "price"],
          message:
            "For a long stance, stop.price must be BELOW the entry price (or lowest bound of the entry zone).",
        });
      }
    }

    if (data.plan.stance === "short" && data.plan.stop && data.plan.entry) {
      const entryHigh = getEntryHigh(data.plan.entry.priceOrZone);
      if (data.plan.stop.price <= entryHigh) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["plan", "stop", "price"],
          message:
            "For a short stance, stop.price must be ABOVE the entry price (or highest bound of the entry zone).",
        });
      }
    }
  }
)
  // Refinement 4: Recompute all plan.targets[].rr from entry/stop
  .transform((data) => {
    if (
      data.plan.entry &&
      data.plan.stop &&
      data.plan.targets &&
      data.plan.targets.length > 0
    ) {
      const entryMid = getEntryMid(data.plan.entry.priceOrZone);
      const stopPrice = data.plan.stop.price;
      const risk = Math.abs(entryMid - stopPrice);

      if (risk > 0) {
        data.plan.targets = data.plan.targets.map((t) => {
          const reward = Math.abs(t.price - entryMid);
          return { ...t, rr: Math.round((reward / risk) * 100) / 100 };
        });
      }
    }
    return data;
  });

// Export the inferred type
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// ---------------------------------------------------------------------------
// TV Link validation (exported for tests)
// ---------------------------------------------------------------------------

export const TV_LINK_REGEX = /^https:\/\/www\.tradingview\.com\/x\/[a-zA-Z0-9]+\/?$/;

export function validateTvLink(link: string): boolean {
  return TV_LINK_REGEX.test(link);
}

// ---------------------------------------------------------------------------
// JSON Schema for Gemini responseSchema field
// Manually written to match the Zod schema above (no zod-to-json-schema)
// ---------------------------------------------------------------------------

export const ANALYSIS_RESULT_JSON_SCHEMA = {
  type: "object",
  properties: {
    dataQuality: {
      type: "object",
      properties: {
        readable: { type: "boolean" },
        score: { type: "integer", minimum: 0, maximum: 100 },
        detected: {
          type: "object",
          properties: {
            symbol: { type: "string" },
            market: {
              type: "string",
              enum: [
                "us-equities",
                "forex",
                "crypto",
                "commodities",
                "global-indices",
                "india-indices",
                "india-equities",
                "india-options",
              ],
            },
            timeframe: { type: "string" },
            priceScaleVisible: { type: "boolean" },
            indicatorsSeen: { type: "array", items: { type: "string" } },
          },
          required: ["priceScaleVisible", "indicatorsSeen"],
        },
        issues: { type: "array", items: { type: "string" } },
        userActionNeeded: { type: "string" },
      },
      required: ["readable", "score", "detected", "issues"],
    },
    instrument: {
      type: "object",
      properties: {
        symbol: { type: "string" },
        market: {
          type: "string",
          enum: [
            "us-equities",
            "forex",
            "crypto",
            "commodities",
            "global-indices",
            "india-indices",
            "india-equities",
            "india-options",
          ],
        },
        timeframe: { type: "string" },
        currency: { type: "string" },
        lastPrice: { type: "number" },
      },
      required: ["symbol", "market", "timeframe"],
    },
    structure: {
      type: "object",
      properties: {
        trend: { type: "string", enum: ["up", "down", "range", "transition"] },
        phase: { type: "string" },
        summary: { type: "string" },
        keyObservations: { type: "array", items: { type: "string" } },
      },
      required: ["trend", "phase", "summary", "keyObservations"],
    },
    levels: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: [
              "support",
              "resistance",
              "pivot",
              "supply_zone",
              "demand_zone",
              "fib",
              "moving_average",
              "liquidity",
            ],
          },
          price: { type: "number" },
          zone: {
            type: "array",
            items: { type: "number" },
            minItems: 2,
            maxItems: 2,
          },
          strength: { type: "integer", minimum: 1, maximum: 5 },
          reason: { type: "string" },
          visibleEvidence: { type: "string" },
        },
        required: ["type", "strength", "reason", "visibleEvidence"],
      },
    },
    indicators: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          reading: { type: "string" },
          implication: { type: "string" },
          bias: { type: "string", enum: ["bull", "bear", "neutral"] },
        },
        required: ["name", "reading", "implication", "bias"],
      },
    },
    scenarios: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          bias: { type: "string", enum: ["bull", "bear", "neutral"] },
          trigger: { type: "string" },
          path: { type: "string" },
          targets: { type: "array", items: { type: "number" } },
          modelConfidence: { type: "string", enum: ["low", "medium", "high"] },
          confidenceNote: { type: "string" },
        },
        required: [
          "name",
          "bias",
          "trigger",
          "path",
          "targets",
          "modelConfidence",
          "confidenceNote",
        ],
      },
    },
    plan: {
      type: "object",
      properties: {
        stance: { type: "string", enum: ["long", "short", "wait"] },
        entry: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["zone", "level", "breakout", "pullback"],
            },
            priceOrZone: {
              oneOf: [
                { type: "number" },
                {
                  type: "array",
                  items: { type: "number" },
                  minItems: 2,
                  maxItems: 2,
                },
              ],
            },
            reasoning: { type: "string" },
          },
          required: ["type", "priceOrZone", "reasoning"],
        },
        stop: {
          type: "object",
          properties: {
            price: { type: "number" },
            reasoning: { type: "string" },
          },
          required: ["price", "reasoning"],
        },
        targets: {
          type: "array",
          items: {
            type: "object",
            properties: {
              price: { type: "number" },
              rr: { type: "number" },
            },
            required: ["price", "rr"],
          },
        },
        riskPercent: { type: "number" },
        invalidation: { type: "string" },
        summary: { type: "string" },
      },
      required: ["stance", "invalidation", "summary"],
    },
    meta: {
      type: "object",
      properties: {
        promptVersion: { type: "string" },
        marketPack: {
          type: "string",
          enum: [
            "us-equities",
            "forex",
            "crypto",
            "commodities",
            "global-indices",
            "india-indices",
            "india-equities",
            "india-options",
          ],
        },
        analysisId: { type: "string" },
        disclaimer: { type: "string" },
      },
      required: ["promptVersion", "marketPack", "disclaimer"],
    },
  },
  required: [
    "dataQuality",
    "instrument",
    "structure",
    "levels",
    "indicators",
    "scenarios",
    "plan",
    "meta",
  ],
};
