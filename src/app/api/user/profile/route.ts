import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { getEntitlement } from "@/server/billing";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabaseServer.from("profiles") as any)
      .select("id, display_name, plan, credits, created_at")
      .eq("id", user.id)
      .single();

    const entitlement = await getEntitlement(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        displayName: profile?.display_name || user.displayName || "Trader",
        plan: profile?.plan || entitlement.plan,
        createdAt: profile?.created_at,
      },
      entitlement,
    });
  } catch (err) {
    console.error("[api/user/profile GET] Error:", err);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { displayName } = body;

    if (typeof displayName === "string") {
      const trimmed = displayName.trim().slice(0, 50);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseServer.from("profiles") as any)
        .update({ display_name: trimmed })
        .eq("id", user.id);

      return NextResponse.json({ ok: true, displayName: trimmed });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/user/profile PATCH] Error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
