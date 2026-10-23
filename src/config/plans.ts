/**
 * Pricing plans configuration — single source of truth for plan names, limits, and prices.
 * Prices are placeholders; founder to confirm before launch.
 * Checkout is NOT integrated yet — all buttons route to /app/upgrade stub.
 */

export type PlanId = "demo" | "monthly" | "lifetime";

export interface Plan {
  id: PlanId;
  name: string;
  price: number | null; // USD; null = free
  interval: "month" | "once" | "free";
  /** Initial credits granted on signup */
  initialCredits: number;
  /** Soft daily cap on analyses; null = no cap */
  dailyCap: number | null;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  demo: {
    id: "demo",
    name: "Free Taste",
    price: null,
    interval: "free",
    initialCredits: 1,
    dailyCap: 1,
    features: [
      "1 full analysis (no credit card required)",
      "All market packs",
      "Educational trade plan",
      "Data-quality gate",
    ],
  },
  monthly: {
    id: "monthly",
    name: "Monthly",
    price: 39, // founder to confirm
    interval: "month",
    initialCredits: 999, // effectively unlimited
    dailyCap: 50, // soft fair-use cap
    features: [
      "Unlimited analyses (50/day fair use)",
      "All 8 market packs incl. India options",
      "Multi-timeframe confluence (up to 3 charts)",
      "History, journal & academy",
      "Priority support",
    ],
    highlighted: true,
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime",
    price: 179, // founder to confirm
    interval: "once",
    initialCredits: 999999,
    dailyCap: 50,
    features: [
      "Everything in Monthly — forever",
      "All future market packs",
      "Early access to new features",
      "Priority support",
    ],
  },
};

export const DEFAULT_PLAN: PlanId = "demo";
