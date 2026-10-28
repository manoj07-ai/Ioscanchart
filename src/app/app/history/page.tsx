import { HistoryView } from "@/components/history/HistoryView";

export const metadata = {
  title: "Analysis History — Iosnapchart",
  description: "Review, filter, and track all your previous technical chart analyses.",
};

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-0)] text-[var(--text-0)]">
      <HistoryView />
    </main>
  );
}
