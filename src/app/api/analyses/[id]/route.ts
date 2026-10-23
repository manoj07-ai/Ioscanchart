/**
 * GET /api/analyses/[id]
 * Polling endpoint for client to retrieve analysis status and structured result.
 * Strictly verifies ownership by user_id and strips internal backend costs/tokens.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { getAnalysisResult } from "@/server/analysis/pipeline";

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    if (!id) {
      return NextResponse.json({ error: "Missing analysis ID" }, { status: 400 });
    }

    const analysis = await getAnalysisResult(id, user.id);
    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found or unauthorized access" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: analysis.id,
      status: analysis.status,
      result: analysis.result,
      error: analysis.error,
      createdAt: analysis.createdAt,
      completedAt: analysis.completedAt,
    });
  } catch (err) {
    console.error("[api/analyses/[id] GET] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
