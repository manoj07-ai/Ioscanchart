import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { JournalSettingsSchema, DEFAULT_JOURNAL_SETTINGS } from "@/lib/journal/schema";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ settings: DEFAULT_JOURNAL_SETTINGS });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error } = await (supabaseServer.from("profiles") as any)
      .select("settings")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !profile?.settings) {
      return NextResponse.json({ settings: DEFAULT_JOURNAL_SETTINGS });
    }

    return NextResponse.json({
      settings: { ...DEFAULT_JOURNAL_SETTINGS, ...(profile.settings as Record<string, unknown>) },
    });
  } catch (err) {
    console.error("[api/journal/settings GET] Error:", err);
    return NextResponse.json({ settings: DEFAULT_JOURNAL_SETTINGS });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = JournalSettingsSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabaseServer.from("profiles") as any)
      .select("settings")
      .eq("id", user.id)
      .maybeSingle();

    const currentSettings = (profile?.settings as Record<string, unknown>) || {};
    const updatedSettings = { ...DEFAULT_JOURNAL_SETTINGS, ...currentSettings, ...parsed.data };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseServer.from("profiles") as any)
      .update({ settings: updatedSettings })
      .eq("id", user.id);

    if (error) {
      console.error("[api/journal/settings PUT] Update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: updatedSettings });
  } catch (err) {
    console.error("[api/journal/settings PUT] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
