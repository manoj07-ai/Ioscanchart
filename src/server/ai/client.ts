/**
 * Gemini AI adapter — single entry point for all LLM calls.
 * Model ID is read from env GEMINI_MODEL for easy upgrades.
 *
 * ⚠️  SERVER ONLY — the API key must never reach the client bundle.
 */

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // Only throw at runtime, not at build time (Vercel preview)
  if (process.env.NODE_ENV !== "test") {
    console.warn("[ai] GEMINI_API_KEY not set — AI calls will fail.");
  }
}

/** The configured model ID. Falls back to a known-good vision model. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

/** Lazy-initialised Gemini client */
let _client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!_client) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Add it to your .env.local file.");
    }
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}
