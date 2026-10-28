import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { getEntitlement, type Plan } from "@/server/billing";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const plan = body.plan as Plan;
    const credits = typeof body.credits === "number" ? body.credits : (plan === "demo" ? 1 : 999);
    const resetDailyUsage = Boolean(body.resetDailyUsage);

    if (!["demo", "monthly", "lifetime"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Update profiles table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabaseServer.from("profiles") as any)
      .update({ plan, credits })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    // Optionally reset today's usage from credit_ledger
    if (resetDailyUsage) {
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseServer.from("credit_ledger") as any)
        .delete()
        .eq("user_id", user.id)
        .gte("created_at", startOfDay.toISOString());
    }

    const entitlement = await getEntitlement(user.id);

    return NextResponse.json({
      ok: true,
      entitlement,
      message: `Plan updated to ${plan} with ${credits} credits.`,
    });
  } catch (err) {
    console.error("[api/dev/set-plan] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update plan" },
      { status: 500 }
    );
  }
}
