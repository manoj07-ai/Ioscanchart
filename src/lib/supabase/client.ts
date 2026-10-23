/**
 * Supabase browser client — uses ANON key.
 * Safe to use in client components for non-privileged reads.
 * For auth-gated data, server actions (using supabase/server.ts) are preferred.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Client-side Supabase instance (singleton) */
export const supabaseBrowser = createClient<Database>(supabaseUrl, supabaseAnonKey);
