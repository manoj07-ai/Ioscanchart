import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { TradeSchema } from "@/lib/journal/schema";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const rawTrades = body.trades;
    if (!Array.isArray(rawTrades) || rawTrades.length === 0) {
      return NextResponse.json({ error: "Invalid trades array" }, { status: 400 });
    }

    if (rawTrades.length > 5000) {
      return NextResponse.json(
        { error: "Batch size exceeds maximum limit of 5,000 trades" },
        { status: 400 }
      );
    }

    const validated: Record<string, unknown>[] = [];
    const errors: { row: number; error: string }[] = [];

    rawTrades.forEach((raw, idx) => {
      const parsed = TradeSchema.safeParse(raw);
      if (!parsed.success) {
        errors.push({
          row: idx + 1,
          error: parsed.error.issues.map((i) => i.message).join(", "),
        });
      } else {
        validated.push({
          ...parsed.data,
          user_id: user.id,
          updated_at: new Date().toISOString(),
        });
      }
    });

    if (validated.length === 0) {
      return NextResponse.json(
        { error: "No valid trades found in batch", errors },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseServer.from("trades") as any).insert(validated);

    if (error) {
      console.error("[api/journal/trades/import POST] Batch insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      count: validated.length,
      skipped: errors.length,
      errors: errors.slice(0, 50),
    });
  } catch (err) {
    console.error("[api/journal/trades/import POST] Error:", err);
    return NextResponse.json({ error: "Failed to import trades" }, { status: 500 });
  }
}
