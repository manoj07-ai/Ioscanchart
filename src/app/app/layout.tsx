/**
 * App layout — wraps all authenticated workspace pages.
 * Will receive sidebar nav, header, and entitlement gate in Prompt 05.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg-0)" }}>
      {/* Sidebar + main shell added in Prompt 05 */}
      {children}
    </div>
  );
}
