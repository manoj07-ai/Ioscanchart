import { notFound } from "next/navigation";
import { getAllLessons, getLessonBySlug } from "@/server/academy/lessons";
import { LessonReader } from "@/components/academy/LessonReader";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: LessonPageProps) {
  const { slug } = await props.params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    return { title: "Lesson Not Found · IoSnapChart" };
  }
  return {
    title: `${lesson.title} · Academy · IoSnapChart`,
    description: lesson.subtitle,
  };
}

export default async function LessonPage(props: LessonPageProps) {
  const { slug } = await props.params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const all = getAllLessons();
  const currentIndex = all.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? all[currentIndex - 1] : undefined;
  const nextLesson = currentIndex < all.length - 1 ? all[currentIndex + 1] : undefined;

  return (
    <main className="min-h-screen bg-[var(--bg-0)] pb-16">
      <LessonReader
        lesson={lesson}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
      />
    </main>
  );
}
