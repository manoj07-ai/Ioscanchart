/**
 * POST /api/analyses
 * Accepts multipart/form-data upload or JSON with TradingView link.
 * Initiates the chart analysis pipeline.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { canAnalyze } from "@/server/billing";
import { createAnalysis } from "@/server/analysis/pipeline";
import { validateTvLink } from "@/server/ai/schema";
import { checkRateLimit } from "@/server/security/rate-limit";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting check (15 requests per minute)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkRateLimit(`analysis:${user.id}:${ip}`, 15, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many analysis requests. Please wait a moment before trying again.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: { "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString() },
        }
      );
    }

    // Check entitlement and fair-use limits before processing
    const check = await canAnalyze(user.id);
    if (!check.ok) {
      if (check.reason === "DAILY_CAP") {
        return NextResponse.json(
          {
            error: "Daily analysis limit reached. Please try again tomorrow or upgrade your plan.",
            code: "DAILY_CAP_REACHED",
          },
          { status: 429 }
        );
      }
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

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting check (15 requests per minute)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkRateLimit(`analysis:${user.id}:${ip}`, 15, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many analysis requests. Please wait a moment before trying again.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: { "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString() },
        }
      );
    }

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const market = searchParams.get("market") || "all";
    const stance = searchParams.get("stance") || "all";
    const outcome = searchParams.get("outcome") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    // Fetch user analyses that are not soft-deleted
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabaseServer.from("analyses") as any)
      .select("id, instrument, market_pack, timeframe, status, created_at, result, deleted_at")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (market !== "all") {
      query = query.eq("market_pack", market);
    }

    const { data: rawAnalyses, error } = await query;

    if (error) {
      console.error("[api/analyses GET] Error fetching history:", error);
      return NextResponse.json({ analyses: [], total: 0, page: 1, totalPages: 1 });
    }

    // Fetch matching journal entries for this user to link outcomes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: journalRows } = await (supabaseServer.from("journal_entries") as any)
      .select("id, analysis_id, outcome, r_multiple")
      .eq("user_id", user.id);

    const journalMap = new Map<string, { id: string; outcome: string; rMultiple: number | null }>();
    if (journalRows) {
      for (const j of journalRows) {
        if (j.analysis_id) {
          journalMap.set(j.analysis_id, {
            id: j.id,
            outcome: j.outcome,
            rMultiple: j.r_multiple !== null ? Number(j.r_multiple) : null,
          });
        }
      }
    }

    // Fetch images to attach thumbnails
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: images } = await (supabaseServer.from("analysis_images") as any)
      .select("analysis_id, storage_path")
      .order("created_at", { ascending: true });

    const thumbnailMap = new Map<string, string>();
    if (images) {
      for (const img of images) {
        if (!thumbnailMap.has(img.analysis_id)) {
          thumbnailMap.set(img.analysis_id, img.storage_path);
        }
      }
    }

    // Transform and apply in-memory filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items = (rawAnalyses || []).map((item: any) => {
      const itemStance = item.result?.plan?.stance || "wait";
      const journal = journalMap.get(item.id);
      return {
        id: item.id,
        instrument: item.instrument || item.result?.instrument?.symbol || "Chart",
        marketPack: item.market_pack || item.result?.instrument?.market || "us-equities",
        timeframe: item.timeframe || item.result?.instrument?.timeframe || "1D",
        status: item.status,
        createdAt: item.created_at,
        stance: itemStance,
        thumbnailUrl: thumbnailMap.get(item.id) || null,
        journal: journal || null,
      };
    });

    // Filter by search string
    if (search) {
      items = items.filter(
        (it: { instrument: string; marketPack: string; timeframe: string }) =>
          it.instrument.toLowerCase().includes(search) ||
          it.marketPack.toLowerCase().includes(search) ||
          it.timeframe.toLowerCase().includes(search)
      );
    }

    // Filter by stance
    if (stance !== "all") {
      items = items.filter((it: { stance: string }) => it.stance.toLowerCase() === stance.toLowerCase());
    }

    // Filter by journal outcome
    if (outcome !== "all") {
      if (outcome === "unlogged") {
        items = items.filter((it: { journal: unknown }) => !it.journal);
      } else {
        items = items.filter(
          (it: { journal?: { outcome: string } }) =>
            it.journal?.outcome?.toLowerCase() === outcome.toLowerCase()
        );
      }
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const paginated = items.slice(offset, offset + limit);

    return NextResponse.json({
      analyses: paginated,
      total,
      page,
      totalPages,
    });
  } catch (err) {
    console.error("[api/analyses GET] Unexpected error:", err);
    return NextResponse.json({ analyses: [], total: 0, page: 1, totalPages: 1 });
  }
}

