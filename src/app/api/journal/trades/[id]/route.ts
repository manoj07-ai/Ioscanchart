import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { TradeSchema } from "@/lib/journal/schema";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();

    const partialSchema = TradeSchema.partial();
    const parsed = partialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatePayload = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseServer.from("trades") as any)
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("[api/journal/trades/[id] PATCH] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ trade: data });
  } catch (err) {
    console.error("[api/journal/trades/[id] PATCH] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    // Hard delete per spec
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseServer.from("trades") as any)
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("[api/journal/trades/[id] DELETE] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[api/journal/trades/[id] DELETE] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
