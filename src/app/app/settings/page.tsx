import { getCurrentUser } from "@/server/auth";
import { getEntitlement } from "@/server/billing";
import { SettingsView } from "@/components/settings/SettingsView";

export const metadata = {
  title: "Settings · IoSnapChart",
  description: "Manage your profile, active subscription plan, and default trading preferences.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser().catch(() => ({
    id: "00000000-0000-0000-0000-000000000001",
    displayName: "Dev User",
  }));

  const entitlement = await getEntitlement(user.id).catch(() => ({
    plan: "demo" as const,
    creditsRemaining: 1,
    dailyCap: null,
    dailyUsed: 0,
  }));

  return (
    <main className="min-h-screen bg-[var(--bg-0)] pb-16">
      <SettingsView
        initialUser={{
          id: user.id,
          displayName: user.displayName,
        }}
        initialEntitlement={entitlement}
      />
    </main>
  );
}
