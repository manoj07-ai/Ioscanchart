import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log the deletion request event for auditing and compliance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseServer.from("events") as any).insert({
      user_id: user.id,
      name: "user_data_delete_requested",
      props: {
        requested_at: new Date().toISOString(),
        user_id: user.id,
        reason: "User requested data deletion from Settings",
      },
    });

    return NextResponse.json({
      ok: true,
      message:
        "Your data deletion request has been registered and scheduled. In accordance with privacy regulations, all stored charts, analyses, and logs will be permanently expunged within 30 days.",
    });
  } catch (err) {
    console.error("[api/user/delete-data POST] Error:", err);
    return NextResponse.json(
      { error: "Failed to process data deletion request" },
      { status: 500 }
    );
  }
}
