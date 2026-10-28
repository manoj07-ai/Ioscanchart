import { JournalPage } from "@/components/journal/JournalPage";

export const metadata = {
  title: "Trading Journal & P&L Calendar — Iosnapchart",
  description: "Log trades, visualize your monthly P&L calendar, track equity curves, and review execution discipline.",
};

export default function AuthenticatedJournalPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-0)] text-[var(--text-0)]">
      <JournalPage mode="api" isGuest={false} />
    </main>
  );
}
