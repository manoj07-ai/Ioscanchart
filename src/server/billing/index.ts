/**
 * Billing stub — reads entitlements from the `profiles` table.
 *
 * getEntitlement, consumeCredit, and refundCredit are the ONLY billing
 * functions the rest of the app should call. The Stripe swap (Prompt 10)
 * will only change this file and supabase webhooks — not the callers.
 *
 * consumeCredit / refundCredit are intentionally transactional: we use
 * Postgres RPC with a check-and-decrement pattern to prevent race conditions.
 */

import { supabaseServer } from "@/lib/supabase/server";
import type { PlanId } from "@/config/plans";

export interface Entitlement {
  plan: PlanId;
  creditsRemaining: number;
  /** Soft daily cap on analyses; null = no cap */
  dailyCap: number | null;
  canAnalyse: boolean;
}

/**
 * Get the entitlement for a user.
 * Returns a conservative "no access" fallback if the profile doesn't exist.
 */
export async function getEntitlement(userId: string): Promise<Entitlement> {
  const { data, error } = await supabaseServer
    .from("profiles")
    .select("plan, credits")
    .eq("id", userId)
    .single<{ plan: string; credits: number }>();

  if (error || !data) {
    return {
      plan: "demo",
      creditsRemaining: 0,
      dailyCap: 1,
      canAnalyse: false,
    };
  }

  const plan = data.plan as PlanId;
  const creditsRemaining = data.credits ?? 0;

  const dailyCap: Record<PlanId, number | null> = {
    demo: 1,
    monthly: 50,
    lifetime: 50,
  };

  return {
    plan,
    creditsRemaining,
    dailyCap: dailyCap[plan],
    canAnalyse: creditsRemaining > 0,
  };
}

/**
 * Decrement a user's credit by 1.
 * Returns `true` on success, `false` if the user has no credits.
 * Uses a Postgres check-and-decrement to prevent race conditions.
 *
 * Note: rpc args cast because Database.Functions is a stub until
 * `supabase gen types` runs after migrations. See BACKLOG.md.
 */
export async function consumeCredit(userId: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseServer.rpc as any)("consume_credit", {
    p_user_id: userId,
  }) as { data: boolean | null; error: { message: string } | null };

  if (error) {
    console.error("[billing] consumeCredit error:", error.message);
    return false;
  }

  return data === true;
}

/**
 * Refund a credit (called when analysis fails validation before using LLM).
 * Idempotent — safe to call even if credit wasn't consumed.
 */
export async function refundCredit(userId: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseServer.rpc as any)("refund_credit", {
    p_user_id: userId,
  }) as { data: null; error: { message: string } | null };

  if (error) {
    console.error("[billing] refundCredit error:", error.message);
  }
}
