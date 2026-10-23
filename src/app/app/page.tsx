import { brand } from "@/config/brand";

export default function NewAnalysisPage() {
  return (
    <main style={{ padding: "2rem", color: "var(--text-1)" }}>
      <h1 style={{ color: "var(--text-0)" }}>New Analysis</h1>
      <p>Chart uploader will be built in Prompt 05.</p>
      <p style={{ color: "var(--text-2)", fontSize: "0.875rem" }}>
        {brand.name} — workspace
      </p>
    </main>
  );
}
