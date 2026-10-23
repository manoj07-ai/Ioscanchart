/**
 * Analysis pipeline — full implementation for Prompt 04.
 *
 * Coordinates:
 * 1. Image upload validation & storage in Supabase storage bucket `charts`
 * 2. TV Link validation (strict regex, SSRF protection)
 * 3. Market detection & pack selection
 * 4. Gemini vision call with structured JSON output
 * 5. Zod schema validation & business logic refinements
 * 6. Transactional credit consumption ONLY for readable charts
 * 7. Result persistence in DB
 *
 * 🔒 SERVER ONLY — never import in client components.
 */

import { supabaseServer } from "@/lib/supabase/server";
import { consumeCredit } from "@/server/billing";
import { analyzeImages, PROMPT_VERSION } from "@/server/ai/gemini";
import {
  AnalysisResultSchema,
  ANALYSIS_RESULT_JSON_SCHEMA,
  validateTvLink,
  type AnalysisResult,
} from "@/server/ai/schema";
import { detectMarket, getMarketPackContext } from "@/server/markets/packs";
import { buildSystemPrompt, buildUserPrompt } from "@/server/ai/prompts";
import type { MarketPackId } from "@/config/markets";
import { DISCLAIMER_SHORT } from "@/config/legal";

export type AnalysisStatus = "queued" | "reading" | "done" | "failed";

export interface CreateAnalysisInput {
  userId: string;
  imageFiles?: File[];
  marketHint?: string;
  tvLink?: string;
  accountSize?: number;
  riskPercent?: number;
}

export interface StoredImageInfo {
  storagePath: string;
  base64: string;
  mimeType: string;
}

// Allowed image MIME types
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per Prompt 05 spec

/**
 * Validate and process uploaded image files into base64 and storage items.
 */
async function processImageFiles(
  files: File[]
): Promise<Array<{ base64: string; mimeType: string; buffer: Buffer; name: string }>> {
  if (files.length === 0) {
    throw new Error("At least one chart image is required.");
  }
  if (files.length > 3) {
    throw new Error("A maximum of 3 chart images can be uploaded for multi-timeframe analysis.");
  }

  const processed = [];
  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(`Unsupported image type: ${file.type}. Allowed: JPEG, PNG, WebP.`);
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Image ${file.name} exceeds maximum allowed size of 5MB.`);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    processed.push({
      base64,
      mimeType: file.type,
      buffer,
      name: file.name,
    });
  }

  return processed;
}

/**
 * Main entry point: creates a new analysis job and runs the pipeline.
 */
export async function createAnalysis(
  input: CreateAnalysisInput
): Promise<{ analysisId: string; status: AnalysisStatus }> {
  const { userId, imageFiles, marketHint, tvLink, accountSize, riskPercent } = input;

  // 1. Validation
  if (!imageFiles || imageFiles.length === 0) {
    if (!tvLink) {
      throw new Error("Either chart image files or a TradingView link must be provided.");
    }
  }

  if (tvLink) {
    if (!validateTvLink(tvLink)) {
      throw new Error(
        "Invalid TradingView snapshot link. Only links matching https://www.tradingview.com/x/... are allowed."
      );
    }
  }

  const processedImages = imageFiles ? await processImageFiles(imageFiles) : [];

  // Determine initial market pack
  let selectedMarketPack: MarketPackId = "us-equities";
  if (marketHint && marketHint !== "auto") {
    selectedMarketPack = marketHint as MarketPackId;
  }

  // 2. Insert analyses row with status 'queued'
  const { data: analysisRecord, error: insertError } = await (
    supabaseServer.from("analyses") as ReturnType<typeof supabaseServer.from>
  )
    .insert({
      user_id: userId,
      status: "queued",
      market_pack: selectedMarketPack,
      input_type: tvLink ? "tv_link" : "image",
      prompt_version: PROMPT_VERSION,
    })
    .select("id")
    .single();

  if (insertError || !analysisRecord) {
    console.error("[pipeline] Failed to create analysis record:", insertError);
    throw new Error("Failed to initialize analysis job.");
  }

  const analysisId = analysisRecord.id as string;

  // 3. Upload images to Supabase storage in background / synchronously
  // Path pattern: {userId}/{analysisId}/img-{index}.jpg
  const storageUploads = processedImages.map(async (img, idx) => {
    const ext = img.mimeType.split("/")[1] || "jpg";
    const storagePath = `${userId}/${analysisId}/img-${idx + 1}.${ext}`;

    const { error: uploadError } = await supabaseServer.storage
      .from("charts")
      .upload(storagePath, img.buffer, {
        contentType: img.mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.warn(`[pipeline] Chart storage upload warning: ${uploadError.message}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseServer.from("analysis_images") as any).insert({
      analysis_id: analysisId,
      storage_path: storagePath,
    });

    return storagePath;
  });

  await Promise.allSettled(storageUploads);

  // 4. Run the analysis engine
  // Run asynchronously without blocking HTTP if caller wants quick response,
  // or await it. In this pipeline we execute the prompt run and update DB.
  executeAnalysisEngine({
    analysisId,
    userId,
    processedImages,
    marketHint: selectedMarketPack,
    tvLink,
    accountSize,
    riskPercent,
  }).catch((err) => {
    console.error(`[pipeline] Unhandled background engine failure for ${analysisId}:`, err);
  });

  return { analysisId, status: "queued" };
}

/**
 * Worker function that performs the Gemini call and handles status transitions.
 */
async function executeAnalysisEngine(opts: {
  analysisId: string;
  userId: string;
  processedImages: Array<{ base64: string; mimeType: string }>;
  marketHint: MarketPackId;
  tvLink?: string;
  accountSize?: number;
  riskPercent?: number;
}) {
  const {
    analysisId,
    userId,
    processedImages,
    marketHint,
    tvLink,
    accountSize,
    riskPercent,
  } = opts;

  try {
    // Stage: reading
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseServer.from("analyses") as any)
      .update({ status: "reading" })
      .eq("id", analysisId);

    // Build context & prompts
    const packContext = getMarketPackContext(marketHint);
    const systemPrompt = buildSystemPrompt(packContext.systemContext);
    const userPrompt = buildUserPrompt({
      tvLink,
      accountSize,
      riskPercent,
    });

    // Call Gemini
    const { json, usage, latencyMs } = await analyzeImages({
      images: processedImages,
      systemPrompt,
      userPrompt,
      responseSchema: ANALYSIS_RESULT_JSON_SCHEMA,
    });

    // Validate with Zod schema (with refinements)
    const parseResult = AnalysisResultSchema.safeParse(json);

    let finalResult: AnalysisResult;

    if (!parseResult.success) {
      console.warn(
        `[pipeline] Schema refinement warning for ${analysisId}:`,
        parseResult.error.format()
      );

      // If schema violation happens, fallback gracefully if json has dataQuality
      // or rethrow to fail job
      throw new Error(
        `Analysis schema validation failed: ${parseResult.error.issues.map((i) => i.message).join(", ")}`
      );
    } else {
      finalResult = parseResult.data;
    }

    // Attach analysisId and metadata
    finalResult.meta = {
      ...finalResult.meta,
      analysisId,
      promptVersion: PROMPT_VERSION,
      disclaimer: DISCLAIMER_SHORT,
    };

    // Credit consumption logic:
    // ONLY consume credit if dataQuality.readable === true
    let creditConsumed = false;
    if (finalResult.dataQuality.readable) {
      creditConsumed = await consumeCredit(userId);
      if (!creditConsumed) {
        console.warn(`[pipeline] User ${userId} had insufficient credits after analysis.`);
      }
    } else {
      console.log(
        `[pipeline] Chart ${analysisId} was unreadable (score=${finalResult.dataQuality.score}). Zero credit consumed.`
      );
    }

    // If symbol was detected in chart, try to refine marketPack
    const detectedSymbol = finalResult.instrument?.symbol;
    const detectedMarketPack = detectedSymbol
      ? detectMarket(detectedSymbol)
      : marketHint;

    // Persist final successful state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseServer.from("analyses") as any)
      .update({
        status: "done",
        completed_at: new Date().toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result: finalResult as any,
        market_pack: detectedMarketPack,
        instrument: finalResult.instrument?.symbol ?? null,
        timeframe: finalResult.instrument?.timeframe ?? null,
        model: usage.model,
        latency_ms: latencyMs,
        cost_usd: usage.costUsd,
      })
      .eq("id", analysisId);

    console.log(
      `[pipeline] Completed analysis ${analysisId}: readable=${finalResult.dataQuality.readable} stance=${finalResult.plan.stance} latency=${latencyMs}ms creditConsumed=${creditConsumed}`
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[pipeline] Analysis ${analysisId} failed:`, errorMsg);

    // Update status to 'failed'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseServer.from("analyses") as any)
      .update({
        status: "failed",
        error: errorMsg,
        completed_at: new Date().toISOString(),
      })
      .eq("id", analysisId);
  }
}

/**
 * Retrieve analysis result for client polling.
 * Ensures the result belongs to the requesting user and strips internal/admin fields.
 */
export async function getAnalysisResult(
  analysisId: string,
  userId: string
): Promise<{
  id: string;
  status: AnalysisStatus;
  result?: AnalysisResult;
  error?: string;
  createdAt: string;
  completedAt?: string;
} | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseServer.from("analyses") as any)
    .select("id, user_id, status, result, error, created_at, completed_at")
    .eq("id", analysisId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    status: data.status,
    result: (data.result as AnalysisResult) ?? undefined,
    error: data.error ?? undefined,
    createdAt: data.created_at,
    completedAt: data.completed_at ?? undefined,
  };
}
