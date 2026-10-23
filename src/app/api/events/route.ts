import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getCurrentUser } from "@/server/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getCurrentUser().catch(() => null);

    if (user?.id && body?.name) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseServer.from("events") as any).insert({
        user_id: user.id,
        name: String(body.name),
        props: body.props ?? {},
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // Fail silently so client is unaffected
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
