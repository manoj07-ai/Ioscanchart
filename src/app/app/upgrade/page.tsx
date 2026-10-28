import { getCurrentUser } from "@/server/auth";
import { getEntitlement } from "@/server/billing";
import { UpgradeView } from "@/components/billing/UpgradeView";

export const metadata = {
  title: "Upgrade Plan — Iosnapchart",
  description: "Upgrade to Monthly or Lifetime for unlimited AI chart analyses across 8 global market packs.",
};

export default async function UpgradePage() {
  const user = await getCurrentUser().catch(() => null);
  const entitlement = user?.id ? await getEntitlement(user.id) : null;

  return (
    <main className="min-h-screen bg-[var(--bg-0)] text-[var(--text-0)]">
      <UpgradeView
        currentPlan={entitlement?.plan ?? "demo"}
        creditsRemaining={
          entitlement?.creditsRemaining === Infinity
            ? 999999
            : entitlement?.creditsRemaining ?? 0
        }
      />
    </main>
  );
}
