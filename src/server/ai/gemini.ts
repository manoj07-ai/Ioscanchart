/**
 * Gemini AI adapter — full implementation.
 * Single entry point for all Gemini vision calls.
 *
 * 🔒 SERVER ONLY — the API key must never reach the client bundle.
 */

import { GoogleGenAI } from "@google/genai";
import { computeCostUsd } from "@/config/ai-pricing";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PROMPT_VERSION = "2026.10.1";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const TIMEOUT_MS = 60_000; // 60 seconds
const RETRY_BACKOFF_MS = 2_000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  model: string;
}

export interface AnalyzeImagesInput {
  images: Array<{ base64: string; mimeType: string }>;
  systemPrompt: string;
  userPrompt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseSchema: Record<string, any>;
}

export interface AnalyzeImagesOutput {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any;
  usage: TokenUsage;
  latencyMs: number;
}

// ---------------------------------------------------------------------------
// Error classes
// ---------------------------------------------------------------------------

export class UnreadableImageError extends Error {
  constructor(message = "The image could not be read or processed.") {
    super(message);
    this.name = "UnreadableImageError";
  }
}

export class ModelRefusedError extends Error {
  constructor(message = "The model refused to generate a response (safety block).") {
    super(message);
    this.name = "ModelRefusedError";
  }
}

export class SchemaViolationError extends Error {
  constructor(message = "The model response did not match the expected schema.") {
    super(message);
    this.name = "SchemaViolationError";
  }
}

export class UpstreamError extends Error {
  public readonly statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "UpstreamError";
    this.statusCode = statusCode;
  }
}

// ---------------------------------------------------------------------------
// Gemini client
// ---------------------------------------------------------------------------

let _client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new UpstreamError("GEMINI_API_KEY is not configured.");
    }
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Retry logic
// ---------------------------------------------------------------------------

function isRetryableError(err: unknown): boolean {
  // Retry on 429 (rate limit) or 5xx (server errors)
  if (err instanceof UpstreamError) {
    const code = err.statusCode ?? 0;
    return code === 429 || (code >= 500 && code < 600);
  }
  // Also retry on network/timeout errors
  if (err instanceof Error) {
    const retryMessages = ["ECONNRESET", "ETIMEDOUT", "socket hang up", "fetch failed"];
    return retryMessages.some((m) => err.message.includes(m));
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Core analyzeImages function
// ---------------------------------------------------------------------------

async function callGemini(input: AnalyzeImagesInput): Promise<AnalyzeImagesOutput> {
  const client = getClient();
  const startMs = Date.now();

  // Build content parts: images first, then text prompt
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentParts: any[] = input.images.map((img) => ({
    inlineData: {
      mimeType: img.mimeType,
      data: img.base64,
    },
  }));
  contentParts.push({ text: input.userPrompt });

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let responseText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawUsage: any;

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts: contentParts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: input.responseSchema,
        systemInstruction: input.systemPrompt,
      },
    });

    clearTimeout(timeoutId);

    // Check for safety/refusal blocks
    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new ModelRefusedError("No candidate returned by Gemini.");
    }

    const finishReason = candidate.finishReason;
    if (finishReason === "SAFETY" || finishReason === "RECITATION") {
      throw new ModelRefusedError(
        `Gemini refused to generate a response. Reason: ${finishReason}`
      );
    }

    responseText = response.text ?? "";

    if (!responseText || responseText.trim() === "") {
      throw new SchemaViolationError("Gemini returned an empty response.");
    }

    // Extract token usage
    rawUsage = response.usageMetadata;
  } catch (err) {
    clearTimeout(timeoutId);

    // Re-throw typed errors as-is
    if (
      err instanceof ModelRefusedError ||
      err instanceof SchemaViolationError ||
      err instanceof UnreadableImageError
    ) {
      throw err;
    }

    // Handle abort (timeout)
    if (err instanceof Error && err.name === "AbortError") {
      throw new UpstreamError("Gemini request timed out after 60 seconds.");
    }

    // Parse HTTP status from error message if available
    const errMsg = err instanceof Error ? err.message : String(err);
    const statusMatch = errMsg.match(/(\d{3})/);
    const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : undefined;

    throw new UpstreamError(
      `Gemini API error: ${errMsg}`,
      statusCode
    );
  }

  const latencyMs = Date.now() - startMs;

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new SchemaViolationError(
      `Gemini response was not valid JSON: ${responseText.slice(0, 200)}`
    );
  }

  // Compute token usage
  const inputTokens: number = rawUsage?.promptTokenCount ?? 0;
  const outputTokens: number = rawUsage?.candidatesTokenCount ?? 0;
  const totalTokens: number = rawUsage?.totalTokenCount ?? inputTokens + outputTokens;
  const costUsd = computeCostUsd(GEMINI_MODEL, inputTokens, outputTokens);

  const usage: TokenUsage = {
    inputTokens,
    outputTokens,
    totalTokens,
    costUsd,
    model: GEMINI_MODEL,
  };

  // Log token usage
  console.log(
    `[gemini] model=${GEMINI_MODEL} inputTokens=${inputTokens} outputTokens=${outputTokens} costUsd=${costUsd.toFixed(6)} latencyMs=${latencyMs}`
  );

  return { json: parsed, usage, latencyMs };
}

/**
 * Analyse chart images using Gemini vision.
 * Retries once on 429 or 5xx errors with a 2s backoff.
 * Does NOT retry on safety blocks or schema violations.
 */
export async function analyzeImages(
  input: AnalyzeImagesInput
): Promise<AnalyzeImagesOutput> {
  try {
    return await callGemini(input);
  } catch (err) {
    if (isRetryableError(err)) {
      console.warn(
        `[gemini] Retryable error, backing off ${RETRY_BACKOFF_MS}ms:`,
        err instanceof Error ? err.message : err
      );
      await sleep(RETRY_BACKOFF_MS);
      return await callGemini(input);
    }
    throw err;
  }
}
