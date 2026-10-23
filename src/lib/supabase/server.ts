/**
 * Supabase server client — uses SERVICE ROLE key.
 *
 * ⚠️  SERVER-ONLY: never import this in client components or expose to the browser.
 * ⚠️  MOCK AUTH NOTE: While auth is mocked (Prompt 01–09), this client bypasses RLS
 *     by using the service role key. All queries MUST manually filter by user_id
 *     using getCurrentUser() to maintain the same security boundary as real RLS.
 *     When real Supabase Auth is swapped in (Prompt 10), switch to a per-request
 *     client that uses the user's JWT so RLS enforces itself automatically.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
  );
}

/**
 * Singleton service-role client for server-side operations.
 * Always scope queries with `.eq('user_id', userId)`.
 */
export const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
