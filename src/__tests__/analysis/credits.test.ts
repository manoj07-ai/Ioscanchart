import { describe, it, expect, vi, beforeEach } from "vitest";
import { consumeCredit } from "@/server/billing";
import { supabaseServer } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({
  supabaseServer: {
    rpc: vi.fn(),
  },
}));

describe("Billing & Credit Consumption Rules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls consume_credit RPC and returns true on success", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabaseServer.rpc as any).mockResolvedValueOnce({
      data: true,
      error: null,
    });

    const result = await consumeCredit("user-123");
    expect(result).toBe(true);
    expect(supabaseServer.rpc).toHaveBeenCalledWith("consume_credit", {
      p_user_id: "user-123",
    });
  });

  it("returns false when user has insufficient credits", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabaseServer.rpc as any).mockResolvedValueOnce({
      data: false,
      error: null,
    });

    const result = await consumeCredit("user-123");
    expect(result).toBe(false);
  });

  it("handles RPC errors gracefully and returns false", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabaseServer.rpc as any).mockResolvedValueOnce({
      data: null,
      error: { message: "Database connection failure" },
    });

    const result = await consumeCredit("user-123");
    expect(result).toBe(false);
  });
});
