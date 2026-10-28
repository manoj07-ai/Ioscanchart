import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { getEntitlement } from "@/server/billing";
import { PlanSwitcher } from "./PlanSwitcher";

export const metadata = {
  title: "Dev Plan Switcher — Iosnapchart",
};

export default async function DevPlanPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const user = await getCurrentUser().catch(() => null);
  const entitlement = user?.id ? await getEntitlement(user.id) : null;

  return (
    <main className="min-h-screen bg-[var(--bg-0)] text-[var(--text-0)] p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium mb-3">
            DEV ONLY • NODE_ENV !== production
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Plan Switcher</h1>
          <p className="text-sm text-[var(--text-2)] mt-1">
            Simulate paywalls, credit consumption, and daily caps for user testing.
          </p>
        </div>

        <PlanSwitcher
          initialUser={user ? { id: user.id, displayName: user.displayName ?? "Dev User" } : null}
          initialEntitlement={
            entitlement
              ? {
                  plan: entitlement.plan,
                  creditsRemaining:
                    entitlement.creditsRemaining === Infinity
                      ? 999999
                      : entitlement.creditsRemaining,
                  isInfinite: entitlement.creditsRemaining === Infinity,
                  dailyCap: entitlement.dailyCap,
                  dailyUsed: entitlement.dailyUsed,
                }
              : null
          }
        />
      </div>
    </main>
  );
}
