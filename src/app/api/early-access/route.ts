import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/early-access
 * Records early access waitlist submissions when checkout is stubbed.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const planInterest = typeof body.planInterest === "string" ? body.planInterest : "monthly";
    const consent = Boolean(body.consent);

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Consent is required to receive early access communications." },
        { status: 400 }
      );
    }

    const user = await getCurrentUser().catch(() => null);

    // Insert into early_access table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabaseServer.from("early_access") as any).insert({
      email,
      plan_interest: planInterest,
      consent: true,
    });

    if (insertError) {
      console.warn("[api/early-access] DB insert warning:", insertError.message);
    }

    // Track analytics event: early_access_submitted
    if (user?.id) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabaseServer.from("events") as any).insert({
          user_id: user.id,
          name: "early_access_submitted",
          props: { email, planInterest },
        });
      } catch {
        // Ignore analytics failure
      }
    }

    return NextResponse.json({
      ok: true,
      message: "You're on the list! We will notify you as soon as payments open.",
    });
  } catch (err) {
    console.error("[api/early-access] Error:", err);
    return NextResponse.json(
      { error: "Failed to record early access request. Please try again." },
      { status: 500 }
    );
  }
}
