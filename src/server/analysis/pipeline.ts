/**
 * Analysis pipeline — stub.
 * Full implementation in Prompt 04.
 *
 * Pipeline:
 * 1. validateUpload → storeImage → create analyses row (queued)
 * 2. detectMarket   → choose Market Pack(s)
 * 3. buildPrompt    → Gemini vision call with JSON schema
 * 4. parseAndValidate with Zod (retry once on failure)
 * 5. Persist result, decrement credit only on success
 * 6. Return analysis_id; client polls until done
 */

export type AnalysisStatus = "queued" | "reading" | "done" | "failed";

export interface CreateAnalysisInput {
  userId: string;
  imageFiles: File[];
  marketHint?: string;
  tvLink?: string;
  accountSize?: number;
  riskPercent?: number;
}

/** Stub — will be implemented in Prompt 04 */
export async function createAnalysis(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _input: CreateAnalysisInput
): Promise<{ analysisId: string }> {
  throw new Error("Analysis pipeline not yet implemented — see Prompt 04.");
}

/** Stub — will be implemented in Prompt 04 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAnalysisResult(_analysisId: string, _userId: string) {
  throw new Error("Not yet implemented — see Prompt 04.");
}
