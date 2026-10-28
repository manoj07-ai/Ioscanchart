import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ completedSlugs: [] });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseServer.from("lesson_progress") as any)
      .select("lesson_slug")
      .eq("user_id", user.id);

    if (error) {
      // Table might not exist or connection error; return empty array gracefully
      console.warn("[api/academy/progress GET] Warning fetching progress:", error.message);
      return NextResponse.json({ completedSlugs: [] });
    }

    const completedSlugs = (data || []).map((row: { lesson_slug: string }) => row.lesson_slug);
    return NextResponse.json({ completedSlugs });
  } catch (err) {
    console.error("[api/academy/progress GET] Unexpected error:", err);
    return NextResponse.json({ completedSlugs: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, completed } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid slug parameter" }, { status: 400 });
    }

    if (completed) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseServer.from("lesson_progress") as any).upsert(
        {
          user_id: user.id,
          lesson_slug: slug,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_slug" }
      );

      if (error) {
        console.warn("[api/academy/progress POST] Upsert error:", error.message);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseServer.from("lesson_progress") as any)
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_slug", slug);

      if (error) {
        console.warn("[api/academy/progress POST] Delete error:", error.message);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabaseServer.from("lesson_progress") as any)
      .select("lesson_slug")
      .eq("user_id", user.id);

    const completedSlugs = (data || []).map((row: { lesson_slug: string }) => row.lesson_slug);
    return NextResponse.json({ ok: true, completedSlugs });
  } catch (err) {
    console.error("[api/academy/progress POST] Unexpected error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
