import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { exportTradesToCsv } from "@/lib/journal/csv";
import type { Trade } from "@/lib/journal/schema";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabaseServer.from("trades") as any)
      .select("*")
      .eq("user_id", user.id)
      .order("trade_date", { ascending: true })
      .order("created_at", { ascending: true });

    if (from) query = query.gte("trade_date", from);
    if (to) query = query.lte("trade_date", to);

    const { data: rawTrades, error } = await query;
    if (error) {
      console.error("[api/journal/export.csv GET] Error:", error);
      return new NextResponse("Failed to export trades", { status: 500 });
    }

    const trades: Trade[] = rawTrades || [];
    const csvContent = exportTradesToCsv(trades);

    const filename = `trades-export-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[api/journal/export.csv GET] Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
