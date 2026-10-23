export default function AnalysisResultPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main style={{ padding: "2rem", color: "var(--text-1)" }}>
      <h1 style={{ color: "var(--text-0)" }}>Analysis Result</h1>
      <p>ID: {params.id}</p>
      <p>Result UI will be built in Prompt 06.</p>
    </main>
  );
}
