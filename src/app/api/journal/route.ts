import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { calculateJournalStats, type JournalEntryRecord, type JournalOutcome } from "@/server/journal/stats";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rows, error } = await (supabaseServer.from("journal_entries") as any)
      .select("id, analysis_id, outcome, r_multiple, notes, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/journal GET] Error fetching entries:", error);
      return NextResponse.json({ entries: [], stats: calculateJournalStats([]) });
    }

    // Fetch linked analyses metadata
    const analysisIds = (rows || [])
      .map((r: { analysis_id: string | null }) => r.analysis_id)
      .filter(Boolean) as string[];

    const analysisMap = new Map<string, { instrument: string; marketPack: string; timeframe: string }>();

    if (analysisIds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: analyses } = await (supabaseServer.from("analyses") as any)
        .select("id, instrument, market_pack, timeframe")
        .in("id", analysisIds);

      if (analyses) {
        for (const a of analyses) {
          analysisMap.set(a.id, {
            instrument: a.instrument || "Chart",
            marketPack: a.market_pack || "us-equities",
            timeframe: a.timeframe || "1D",
          });
        }
      }
    }

    // Format entries for client and stats calculation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries: JournalEntryRecord[] = (rows || []).map((r: any) => {
      const linked = r.analysis_id ? analysisMap.get(r.analysis_id) : null;
      return {
        id: r.id,
        userId: user.id,
        analysisId: r.analysis_id,
        outcome: r.outcome as JournalOutcome,
        rMultiple: r.r_multiple !== null ? Number(r.r_multiple) : null,
        notes: r.notes || "",
        createdAt: r.created_at,
        instrument: linked?.instrument || null,
        marketPack: linked?.marketPack || null,
        timeframe: linked?.timeframe || null,
      };
    });

    const stats = calculateJournalStats(entries);

    return NextResponse.json({ entries, stats });
  } catch (err) {
    console.error("[api/journal GET] Unexpected error:", err);
    return NextResponse.json({ entries: [], stats: calculateJournalStats([]) });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const outcome = body.outcome as JournalOutcome;
    const validOutcomes: JournalOutcome[] = ["win", "loss", "breakeven", "skipped"];

    if (!outcome || !validOutcomes.includes(outcome)) {
      return NextResponse.json(
        { error: "Outcome must be one of: win, loss, breakeven, skipped" },
        { status: 400 }
      );
    }

    let rMultiple: number | null = null;
    if (outcome !== "skipped" && body.rMultiple !== undefined && body.rMultiple !== null && body.rMultiple !== "") {
      const parsedR = parseFloat(String(body.rMultiple));
      if (!isNaN(parsedR)) {
        rMultiple = Math.round(parsedR * 100) / 100;
      }
    }

    const analysisId = body.analysisId || null;
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseServer.from("journal_entries") as any)
      .insert({
        user_id: user.id,
        analysis_id: analysisId,
        outcome,
        r_multiple: rMultiple,
        notes,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[api/journal POST] Insert error:", error.message);
      return NextResponse.json({ error: "Failed to log trade to journal." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      id: data?.id,
      message: "Trade outcome successfully logged in your journal.",
    });
  } catch (err) {
    console.error("[api/journal POST] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
