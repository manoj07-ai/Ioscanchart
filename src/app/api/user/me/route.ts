import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { getEntitlement } from "@/server/billing";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entitlement = await getEntitlement(user.id);

    return NextResponse.json({
      user,
      entitlement,
    });
  } catch (err) {
    console.error("[api/user/me GET] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
