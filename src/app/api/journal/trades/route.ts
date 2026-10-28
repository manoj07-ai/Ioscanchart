import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { TradeSchema } from "@/lib/journal/schema";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const symbol = searchParams.get("symbol")?.toUpperCase();
    const tag = searchParams.get("tag");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabaseServer.from("trades") as any)
      .select("*")
      .eq("user_id", user.id)
      .order("trade_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1000);

    if (from) query = query.gte("trade_date", from);
    if (to) query = query.lte("trade_date", to);
    if (symbol) query = query.ilike("symbol", `%${symbol}%`);
    if (tag) query = query.or(`setup_tags.cs.{${tag}},mistake_tags.cs.{${tag}}`);

    const { data: trades, error } = await query;
    if (error) {
      console.error("[api/journal/trades GET] Error:", error);
      return NextResponse.json({ trades: [] }, { status: 200 });
    }

    return NextResponse.json({ trades: trades || [] });
  } catch (err) {
    console.error("[api/journal/trades GET] Error:", err);
    return NextResponse.json({ trades: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = TradeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const tradeData = {
      ...parsed.data,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseServer.from("trades") as any)
      .insert(tradeData)
      .select()
      .single();

    if (error) {
      console.error("[api/journal/trades POST] Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ trade: data }, { status: 201 });
  } catch (err) {
    console.error("[api/journal/trades POST] Error:", err);
    return NextResponse.json({ error: "Failed to create trade" }, { status: 500 });
  }
}
