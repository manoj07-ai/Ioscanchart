import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";

// In-memory fallback if remote table is pending migration
const inMemoryProgress = new Map<string, Set<string>>();

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ completedSlugs: [] });
    }

    const memorySet = inMemoryProgress.get(user.id) || new Set<string>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseServer.from("lesson_progress") as any)
      .select("lesson_slug")
      .eq("user_id", user.id);

    if (error) {
      // Table might not exist or schema cache miss; return in-memory set
      return NextResponse.json({ completedSlugs: Array.from(memorySet) });
    }

    const dbSlugs = (data || []).map((row: { lesson_slug: string }) => row.lesson_slug);
    const combined = Array.from(new Set([...dbSlugs, ...Array.from(memorySet)]));
    return NextResponse.json({ completedSlugs: combined });
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

    if (!inMemoryProgress.has(user.id)) {
      inMemoryProgress.set(user.id, new Set<string>());
    }
    const userMemory = inMemoryProgress.get(user.id)!;
    if (completed) {
      userMemory.add(slug);
    } else {
      userMemory.delete(slug);
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
        console.warn("[api/academy/progress POST] Upsert warning:", error.message);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseServer.from("lesson_progress") as any)
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_slug", slug);

      if (error) {
        console.warn("[api/academy/progress POST] Delete warning:", error.message);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabaseServer.from("lesson_progress") as any)
      .select("lesson_slug")
      .eq("user_id", user.id);

    const dbSlugs = (data || []).map((row: { lesson_slug: string }) => row.lesson_slug);
    const combined = Array.from(new Set([...dbSlugs, ...Array.from(userMemory)]));
    return NextResponse.json({ ok: true, completedSlugs: combined });
  } catch (err) {
    console.error("[api/academy/progress POST] Unexpected error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
