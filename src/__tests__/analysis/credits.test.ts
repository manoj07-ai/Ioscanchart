import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getEntitlement,
  canAnalyze,
  consumeCredit,
  refundCredit,
} from "@/server/billing";

interface MockProfile {
  id: string;
  plan: "demo" | "monthly" | "lifetime";
  credits: number;
}

interface MockLedgerEntry {
  id: string;
  user_id: string;
  analysis_id: string;
  delta: number;
  reason: string;
  created_at: string;
}

// In-memory test store
let mockProfiles: Record<string, MockProfile> = {};
let mockLedger: MockLedgerEntry[] = [];

vi.mock("@/lib/supabase/server", () => ({
  supabaseServer: {
    from: vi.fn((table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: (_field: string, id: string) => ({
              single: async () => {
                const profile = mockProfiles[id];
                if (!profile) return { data: null, error: { message: "Not found" } };
                return { data: { ...profile }, error: null };
              },
            }),
          }),
          update: (fields: Partial<MockProfile>) => ({
            eq: async (_field: string, id: string) => {
              if (mockProfiles[id]) {
                mockProfiles[id] = { ...mockProfiles[id], ...fields };
              }
              return { error: null };
            },
          }),
        };
      }

      if (table === "credit_ledger") {
        return {
          select: (_cols?: string, opts?: { count?: string; head?: boolean }) => {
            const filters: Record<string, unknown> = {};
            const builder = {
              eq: (col: string, val: unknown) => {
                filters[col] = val;
                return builder;
              },
              gte: (col: string, val: unknown) => {
                filters[`${col}_gte`] = val;
                return builder;
              },
              maybeSingle: async () => {
                const found = mockLedger.find(
                  (entry) =>
                    (!filters.user_id || entry.user_id === filters.user_id) &&
                    (!filters.analysis_id || entry.analysis_id === filters.analysis_id) &&
                    (!filters.reason || entry.reason === filters.reason)
                );
                return { data: found ? { id: found.id } : null, error: null };
              },
              then: (resolve: (val: unknown) => void) => {
                if (opts?.count === "exact") {
                  const matches = mockLedger.filter((entry) => {
                    const matchUser = !filters.user_id || entry.user_id === filters.user_id;
                    const matchReason = !filters.reason || entry.reason === filters.reason;
                    return matchUser && matchReason;
                  });
                  return resolve({ count: matches.length, error: null });
                }
                return resolve({ data: mockLedger, error: null });
              },
            };
            return builder;
          },
          insert: async (entry: Omit<MockLedgerEntry, "id" | "created_at">) => {
            // Check unique constraint on (analysis_id, reason)
            const exists = mockLedger.some(
              (e) => e.analysis_id === entry.analysis_id && e.reason === entry.reason
            );
            if (exists) {
              return { error: { code: "23505", message: "Duplicate key violates unique constraint" } };
            }

            const newEntry: MockLedgerEntry = {
              id: `ledger-${mockLedger.length + 1}`,
              user_id: entry.user_id,
              analysis_id: entry.analysis_id,
              delta: entry.delta,
              reason: entry.reason,
              created_at: new Date().toISOString(),
            };
            mockLedger.push(newEntry);
            return { error: null };
          },
          delete: () => ({
            eq: () => ({
              gte: async () => {
                mockLedger = [];
                return { error: null };
              },
            }),
          }),
        };
      }

      return {};
    }),
  },
}));

describe("Billing & Credits Specification (Prompt 08)", () => {
  const TEST_USER_ID = "user-test-01";
  const ANALYSIS_ID = "analysis-uuid-123";

  beforeEach(() => {
    vi.clearAllMocks();
    mockProfiles = {
      [TEST_USER_ID]: {
        id: TEST_USER_ID,
        plan: "demo",
        credits: 1,
      },
    };
    mockLedger = [];
  });

  describe("consumeCredit idempotency", () => {
    it("debits credit once and creates exactly one ledger entry", async () => {
      expect(mockProfiles[TEST_USER_ID].credits).toBe(1);

      await consumeCredit(TEST_USER_ID, ANALYSIS_ID);

      expect(mockProfiles[TEST_USER_ID].credits).toBe(0);
      expect(mockLedger.length).toBe(1);
      expect(mockLedger[0].analysis_id).toBe(ANALYSIS_ID);
      expect(mockLedger[0].delta).toBe(-1);
      expect(mockLedger[0].reason).toBe("consume");

      // Second call with same analysisId must be idempotent
      await consumeCredit(TEST_USER_ID, ANALYSIS_ID);

      expect(mockProfiles[TEST_USER_ID].credits).toBe(0);
      expect(mockLedger.length).toBe(1);
    });
  });

  describe("refundCredit on failure", () => {
    it("refunds consumed credit and records refund in ledger", async () => {
      // First consume
      await consumeCredit(TEST_USER_ID, ANALYSIS_ID);
      expect(mockProfiles[TEST_USER_ID].credits).toBe(0);

      // Refund
      await refundCredit(TEST_USER_ID, ANALYSIS_ID);
      expect(mockProfiles[TEST_USER_ID].credits).toBe(1);
      expect(mockLedger.length).toBe(2);
      expect(mockLedger[1].delta).toBe(1);
      expect(mockLedger[1].reason).toBe("refund");

      // Idempotent: refunding again does nothing
      await refundCredit(TEST_USER_ID, ANALYSIS_ID);
      expect(mockProfiles[TEST_USER_ID].credits).toBe(1);
      expect(mockLedger.length).toBe(2);
    });

    it("does not refund if no consume occurred for the analysisId", async () => {
      await refundCredit(TEST_USER_ID, "non-existent-analysis");
      expect(mockProfiles[TEST_USER_ID].credits).toBe(1);
      expect(mockLedger.length).toBe(0);
    });
  });

  describe("Demo → Paywall transition after 1 analysis", () => {
    it("allows first analysis, then transitions to NO_CREDITS paywall", async () => {
      // Initial state: 1 credit
      let check = await canAnalyze(TEST_USER_ID);
      expect(check.ok).toBe(true);

      // Run 1st analysis
      await consumeCredit(TEST_USER_ID, ANALYSIS_ID);

      // Second analysis attempt: credits exhausted
      check = await canAnalyze(TEST_USER_ID);
      expect(check.ok).toBe(false);
      if (!check.ok) {
        expect(check.reason).toBe("NO_CREDITS");
      }
    });
  });

  describe("Paid plans & daily fair-use cap enforcement", () => {
    it("grants unlimited analyses (creditsRemaining: Infinity) for monthly subscribers", async () => {
      mockProfiles[TEST_USER_ID] = {
        id: TEST_USER_ID,
        plan: "monthly",
        credits: 0,
      };

      const ent = await getEntitlement(TEST_USER_ID);
      expect(ent.plan).toBe("monthly");
      expect(ent.creditsRemaining).toBe(Infinity);
      expect(ent.dailyCap).toBe(50);

      const check = await canAnalyze(TEST_USER_ID);
      expect(check.ok).toBe(true);
    });

    it("enforces dailyCap limit when dailyUsed reaches cap", async () => {
      mockProfiles[TEST_USER_ID] = {
        id: TEST_USER_ID,
        plan: "monthly",
        credits: 0,
      };

      // Populate 50 ledger entries for today
      for (let i = 0; i < 50; i++) {
        mockLedger.push({
          id: `ledger-${i}`,
          user_id: TEST_USER_ID,
          analysis_id: `analysis-${i}`,
          delta: -1,
          reason: "consume",
          created_at: new Date().toISOString(),
        });
      }

      const ent = await getEntitlement(TEST_USER_ID);
      expect(ent.dailyUsed).toBe(50);
      expect(ent.dailyCap).toBe(50);

      const check = await canAnalyze(TEST_USER_ID);
      expect(check.ok).toBe(false);
      if (!check.ok) {
        expect(check.reason).toBe("DAILY_CAP");
      }
    });

    it("grants lifetime subscribers access with 50/day fair-use cap", async () => {
      mockProfiles[TEST_USER_ID] = {
        id: TEST_USER_ID,
        plan: "lifetime",
        credits: 0,
      };

      const ent = await getEntitlement(TEST_USER_ID);
      expect(ent.plan).toBe("lifetime");
      expect(ent.creditsRemaining).toBe(Infinity);
      expect(ent.dailyCap).toBe(50);

      const check = await canAnalyze(TEST_USER_ID);
      expect(check.ok).toBe(true);
    });
  });
});
