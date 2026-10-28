import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { JournalDaySchema } from "@/lib/journal/schema";

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ day: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { day } = await props.params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseServer.from("journal_days") as any)
      .select("*")
      .eq("user_id", user.id)
      .eq("day", day)
      .maybeSingle();

    if (error) {
      console.warn("[api/journal/days/[day] GET] Error:", error.message);
      return NextResponse.json({ day: null });
    }

    return NextResponse.json({ day: data || null });
  } catch (err) {
    console.error("[api/journal/days/[day] GET] Error:", err);
    return NextResponse.json({ day: null });
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ day: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { day } = await props.params;
    const body = await req.json();

    const parsed = JournalDaySchema.safeParse({ day, ...body });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const payload = {
      user_id: user.id,
      day: parsed.data.day,
      note: parsed.data.note || null,
      mood: parsed.data.mood || null,
      updated_at: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseServer.from("journal_days") as any)
      .upsert(payload, { onConflict: "user_id,day" })
      .select()
      .single();

    if (error) {
      console.error("[api/journal/days/[day] PUT] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ day: data });
  } catch (err) {
    console.error("[api/journal/days/[day] PUT] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
