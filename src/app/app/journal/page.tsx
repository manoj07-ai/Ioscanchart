import { JournalView } from "@/components/journal/JournalView";

export const metadata = {
  title: "Trade Journal — Iosnapchart",
  description: "Audit execution discipline, log setup outcomes, and track cumulative R multiple performance.",
};

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-0)] text-[var(--text-0)]">
      <JournalView />
    </main>
  );
}
