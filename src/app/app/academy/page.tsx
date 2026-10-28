import { getAllLessons } from "@/server/academy/lessons";
import { AcademyView } from "@/components/academy/AcademyView";

export const metadata = {
  title: "Trading Academy · IoSnapChart",
  description: "Bite-sized, high-leverage lessons on market structure, execution, and risk management.",
};

export default function AcademyPage() {
  const lessons = getAllLessons();

  return (
    <main className="min-h-screen bg-[var(--bg-0)] pb-16">
      <AcademyView lessons={lessons} />
    </main>
  );
}
