/**
 * Billing service — auditable credit ledger, plan entitlements, and fair-use caps.
 *
 * Requirements (Prompt 08):
 * - type Plan = 'demo' | 'monthly' | 'lifetime'
 * - getEntitlement(userId): Promise<{ plan: Plan; creditsRemaining: number; dailyCap: number | null; dailyUsed: number }>
 * - consumeCredit(userId, analysisId): Promise<void> // idempotent per analysisId
 * - refundCredit(userId, analysisId): Promise<void>  // idempotent per analysisId
 * - canAnalyze(userId): Promise<{ ok: true } | { ok: false; reason: 'NO_CREDITS' | 'DAILY_CAP' }>
 *
 * 🔒 SERVER ONLY — never import into client components.
 */

import { supabaseServer } from "@/lib/supabase/server";
import { PLANS, type PlanId } from "@/config/plans";

export type Plan = "demo" | "monthly" | "lifetime";

export interface Entitlement {
  plan: Plan;
  creditsRemaining: number;
  /** Soft daily cap on analyses; null = no cap */
  dailyCap: number | null;
  /** Total analyses run today (UTC) */
  dailyUsed: number;
  /** Helper for backwards compatibility */
  canAnalyse?: boolean;
}

/**
 * Get the entitlement for a user.
 * Demo plan has finite credits; Paid plans have Infinity credits with dailyCap.
 */
export async function getEntitlement(userId: string): Promise<Entitlement> {
  const { data: profile, error } = await supabaseServer
    .from("profiles")
    .select("plan, credits")
    .eq("id", userId)
    .single<{ plan: string; credits: number }>();

  if (error || !profile) {
    return {
      plan: "demo",
      creditsRemaining: 0,
      dailyCap: 1,
      dailyUsed: 0,
      canAnalyse: false,
    };
  }

  const plan = (profile.plan as Plan) || "demo";

  // Calculate daily usage from the credit_ledger
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  let dailyUsed = 0;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count, error: countError } = await (supabaseServer.from("credit_ledger") as any)
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("reason", "consume")
      .gte("created_at", startOfDay.toISOString());

    if (!countError && typeof count === "number") {
      dailyUsed = count;
    }
  } catch (err) {
    console.warn("[billing] Could not query credit_ledger daily usage:", err);
  }

  const configuredPlan = PLANS[plan as PlanId] ?? PLANS.demo;
  const dailyCap = configuredPlan.dailyCap;

  // Paid plans have creditsRemaining: Infinity semantics
  const creditsRemaining =
    plan === "demo" ? (profile.credits ?? 0) : Infinity;

  const canAnalyse =
    (dailyCap === null || dailyUsed < dailyCap) && creditsRemaining > 0;

  return {
    plan,
    creditsRemaining,
    dailyCap,
    dailyUsed,
    canAnalyse,
  };
}

/**
 * Check whether a user is permitted to start a new analysis.
 * Distinguishes between exhausted credits (Demo) vs hitting daily fair-use cap (Paid/Demo).
 */
export async function canAnalyze(
  userId: string
): Promise<{ ok: true } | { ok: false; reason: "NO_CREDITS" | "DAILY_CAP" }> {
  const ent = await getEntitlement(userId);

  // Demo users need at least 1 credit remaining; 0 credits triggers paywall
  if (ent.plan === "demo" && ent.creditsRemaining <= 0) {
    return { ok: false, reason: "NO_CREDITS" };
  }

  // Check daily fair-use cap (applies to all plans)
  if (ent.dailyCap !== null && ent.dailyUsed >= ent.dailyCap) {
    return { ok: false, reason: "DAILY_CAP" };
  }

  return { ok: true };
}

/**
 * Decrement credit and record in ledger.
 * Idempotent: running multiple times with the same analysisId performs only 1 debit.
 */
export async function consumeCredit(
  userId: string,
  analysisId: string
): Promise<void> {
  if (!userId || !analysisId) {
    throw new Error("userId and analysisId are required to consume credit.");
  }

  // Idempotency check: look up existing consume record for this analysisId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabaseServer.from("credit_ledger") as any)
    .select("id")
    .eq("user_id", userId)
    .eq("analysis_id", analysisId)
    .eq("reason", "consume")
    .maybeSingle();

  if (existing) {
    // Already debited for this analysis
    return;
  }

  // Insert ledger entry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: ledgerError } = await (supabaseServer.from("credit_ledger") as any).insert({
    user_id: userId,
    analysis_id: analysisId,
    delta: -1,
    reason: "consume",
  });

  if (ledgerError) {
    // If unique constraint violation on (analysis_id, reason), treat as idempotent success
    if (ledgerError.code === "23505") {
      return;
    }
    console.error("[billing] consumeCredit ledger insert failed:", ledgerError.message);
  }

  // Decrement credits on profiles if demo plan or credits > 0
  const { data: profile } = await supabaseServer
    .from("profiles")
    .select("plan, credits")
    .eq("id", userId)
    .single<{ plan: string; credits: number }>();

  if (profile && (profile.plan === "demo" || profile.credits > 0)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseServer.from("profiles") as any)
      .update({ credits: Math.max(0, (profile.credits ?? 1) - 1) })
      .eq("id", userId);
  }
}

/**
 * Refund credit back to user if analysis failed or was unreadable.
 * Idempotent: safe to call repeatedly; only refunds once per analysisId.
 */
export async function refundCredit(
  userId: string,
  analysisId: string
): Promise<void> {
  if (!userId || !analysisId) return;

  // Verify that credit was actually consumed for this analysisId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: consumed } = await (supabaseServer.from("credit_ledger") as any)
    .select("id")
    .eq("user_id", userId)
    .eq("analysis_id", analysisId)
    .eq("reason", "consume")
    .maybeSingle();

  if (!consumed) {
    // Nothing was consumed; nothing to refund
    return;
  }

  // Check if refund already recorded
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: alreadyRefunded } = await (supabaseServer.from("credit_ledger") as any)
    .select("id")
    .eq("user_id", userId)
    .eq("analysis_id", analysisId)
    .eq("reason", "refund")
    .maybeSingle();

  if (alreadyRefunded) {
    return;
  }

  // Insert refund ledger entry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: refundError } = await (supabaseServer.from("credit_ledger") as any).insert({
    user_id: userId,
    analysis_id: analysisId,
    delta: 1,
    reason: "refund",
  });

  if (refundError && refundError.code !== "23505") {
    console.error("[billing] refundCredit ledger insert error:", refundError.message);
  }

  // Increment profile credits
  const { data: profile } = await supabaseServer
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single<{ credits: number }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabaseServer.from("profiles") as any)
    .update({ credits: (profile?.credits ?? 0) + 1 })
    .eq("id", userId);
}
