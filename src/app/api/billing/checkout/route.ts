import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/billing/checkout
 * Stubbed checkout endpoint.
 * Returns 501 { code: 'PAYMENTS_NOT_CONFIGURED' } per Prompt 08 spec.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    const body = await req.json().catch(() => ({}));
    const planId = body.planId || "monthly";

    // Track upgrade click attempt
    if (user?.id) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabaseServer.from("events") as any).insert({
          user_id: user.id,
          name: "upgrade_clicked",
          props: { planId },
        });
      } catch {
        // Ignore analytics failure
      }
    }

    return NextResponse.json(
      {
        code: "PAYMENTS_NOT_CONFIGURED",
        message:
          "Payments launch soon. Join the early-access list to lock in founding member pricing.",
      },
      { status: 501 }
    );
  } catch (err) {
    console.error("[api/billing/checkout] Error:", err);
    return NextResponse.json(
      { code: "PAYMENTS_NOT_CONFIGURED", message: "Payments not configured" },
      { status: 501 }
    );
  }
}
