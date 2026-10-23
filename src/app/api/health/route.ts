import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Health check endpoint — used by Vercel, uptime monitors, and CI smoke tests.
 * Returns 200 with basic metadata. Does NOT check DB connectivity here
 * to keep latency low; add a /api/health/deep route if needed.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      version: process.env.npm_package_version ?? "0.1.0",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
    },
    { status: 200 }
  );
}
