/**
 * POST /api/analyses
 * Accepts multipart/form-data upload or JSON with TradingView link.
 * Initiates the chart analysis pipeline.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { getEntitlement } from "@/server/billing";
import { createAnalysis } from "@/server/analysis/pipeline";
import { validateTvLink } from "@/server/ai/schema";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check entitlement before processing
    const entitlement = await getEntitlement(user.id);
    if (!entitlement.canAnalyse) {
      return NextResponse.json(
        {
          error: "No credits remaining. Upgrade your plan to continue analyzing charts.",
          code: "INSUFFICIENT_CREDITS",
        },
        { status: 402 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    let imageFiles: File[] = [];
    let marketHint: string | undefined;
    let tvLink: string | undefined;
    let accountSize: number | undefined;
    let riskPercent: number | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const files = formData.getAll("images") as File[];
      imageFiles = files.filter((f) => f && f.size > 0);

      marketHint = (formData.get("marketHint") as string) || undefined;
      tvLink = (formData.get("tvLink") as string) || undefined;

      const accSizeStr = formData.get("accountSize") as string;
      if (accSizeStr) accountSize = parseFloat(accSizeStr);

      const riskPercentStr = formData.get("riskPercent") as string;
      if (riskPercentStr) riskPercent = parseFloat(riskPercentStr);
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      marketHint = body.marketHint;
      tvLink = body.tvLink;
      accountSize = body.accountSize;
      riskPercent = body.riskPercent;
    } else {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data or application/json" },
        { status: 400 }
      );
    }

    if (imageFiles.length === 0 && !tvLink) {
      return NextResponse.json(
        { error: "Provide at least one chart image or a TradingView link." },
        { status: 400 }
      );
    }

    if (tvLink && !validateTvLink(tvLink)) {
      return NextResponse.json(
        {
          error:
            "Invalid TradingView snapshot URL. Must match https://www.tradingview.com/x/... format.",
        },
        { status: 400 }
      );
    }

    const { analysisId, status } = await createAnalysis({
      userId: user.id,
      imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
      marketHint,
      tvLink,
      accountSize,
      riskPercent,
    });

    return NextResponse.json(
      {
        analysisId,
        status,
        message: "Analysis job started.",
      },
      { status: 202 }
    );
  } catch (err) {
    console.error("[api/analyses POST] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseServer.from("analyses") as any)
      .select("id, instrument, market_pack, timeframe, status, created_at, result")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("[api/analyses GET] Error fetching history:", error);
      return NextResponse.json({ analyses: [] });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const analyses = (data || []).map((item: any) => ({
      id: item.id,
      instrument: item.instrument || item.result?.instrument?.symbol || "Chart",
      marketPack: item.market_pack || item.result?.instrument?.market || "us-equities",
      timeframe: item.timeframe || item.result?.instrument?.timeframe || "1D",
      status: item.status,
      createdAt: item.created_at,
      stance: item.result?.plan?.stance,
    }));

    return NextResponse.json({ analyses });
  } catch (err) {
    console.error("[api/analyses GET] Unexpected error:", err);
    return NextResponse.json({ analyses: [] });
  }
}

