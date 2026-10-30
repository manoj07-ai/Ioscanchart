"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Lesson } from "@/server/academy/lessons";

interface AcademyViewProps {
  lessons: Lesson[];
}

export function AcademyView({ lessons }: AcademyViewProps) {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  const loadProgress = useCallback(async () => {
    function getMerged(apiSlugs: string[]) {
      try {
        const local = localStorage.getItem("iosnapchart_completed_lessons");
        const localSlugs: string[] = local ? JSON.parse(local) : [];
        return Array.from(new Set([...apiSlugs, ...localSlugs]));
      } catch {
        return apiSlugs;
      }
    }

    try {
      const res = await fetch("/api/academy/progress");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.completedSlugs)) {
          const merged = getMerged(json.completedSlugs);
          setCompletedSlugs(merged);
          try {
            localStorage.setItem("iosnapchart_completed_lessons", JSON.stringify(merged));
          } catch {
            // ignore
          }
          return;
        }
      }
    } catch {
      // Fallback to local storage if API fails
    }

    try {
      const local = localStorage.getItem("iosnapchart_completed_lessons");
      if (local) {
        setCompletedSlugs(JSON.parse(local));
      }
    } catch {
      // Ignore JSON error
    }
  }, []);

  useEffect(() => {
    loadProgress();

    const handleProgressUpdate = () => {
      loadProgress();
    };

    window.addEventListener("academy-progress-updated", handleProgressUpdate);
    window.addEventListener("storage", handleProgressUpdate);

    return () => {
      window.removeEventListener("academy-progress-updated", handleProgressUpdate);
      window.removeEventListener("storage", handleProgressUpdate);
    };
  }, [loadProgress]);

  const total = lessons.length;
  const completedCount = completedSlugs.filter((s) =>
    lessons.some((l) => l.slug === s)
  ).length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[var(--bg-2)] border border-[var(--line)] text-[var(--candle)]">
          <BookOpen className="w-3.5 h-3.5 text-[var(--candle)] shrink-0" />
          <span>IoSnapChart Trading Academy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-0)]">
          Master Modern Market Structure &amp; Execution
        </h1>
        <p className="text-sm text-[var(--text-2)] max-w-2xl leading-relaxed">
          Concise, high-impact lessons designed to eliminate execution errors, master risk:reward mathematics, and decipher institutional positioning.
        </p>
      </div>

      {/* Progress tracker bar */}
      <div className="p-4 sm:p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium text-[var(--text-0)]">
            <span>Course Progress</span>
            <span className="font-mono text-[var(--candle)] font-bold">
              {completedCount} of {total} Completed ({progressPercent}%)
            </span>
          </div>
          {completedCount === total && total > 0 && (
            <Badge variant="bull" size="sm" className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>All Lessons Completed</span>
            </Badge>
          )}
        </div>

        <div className="w-full h-2 rounded-full bg-[var(--bg-2)] overflow-hidden border border-[var(--line)]">
          <div
            className="h-full bg-gradient-to-r from-[var(--candle)] to-[var(--candle-strong)] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lessons.map((lesson) => {
          const isCompleted = completedSlugs.includes(lesson.slug);

          return (
            <Link
              key={lesson.slug}
              href={`/app/academy/${lesson.slug}`}
              className="group block p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--candle)]/50 hover:bg-[var(--bg-2)]/60 transition-all duration-200 relative overflow-hidden"
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                  <div className="absolute transform rotate-45 bg-[var(--candle)]/20 text-[var(--candle)] text-[9px] font-mono font-bold py-0.5 right-[-35px] top-[14px] w-[120px] text-center border-b border-[var(--candle)]/40 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 inline" />
                    <span>DONE</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-[var(--text-2)] uppercase">
                    Lesson {String(lesson.order).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-2)]">
                    {lesson.readTimeMinutes} min read
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[var(--text-0)] group-hover:text-[var(--candle)] transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-[var(--text-2)] line-clamp-2 leading-relaxed">
                    {lesson.subtitle}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)]">
                  <div className="flex flex-wrap gap-1.5">
                    {lesson.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-2)] text-[var(--text-2)] border border-[var(--line)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-[var(--candle)] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{isCompleted ? "Review" : "Start"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Disclaimers & Notes */}
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)]/50 text-xs text-[var(--text-2)] space-y-1 leading-relaxed">
        <p className="font-semibold text-[var(--text-1)]">Educational Notice</p>
        <p>
          The Academy provides educational frameworks on market mechanics, technical analysis, and risk management. It does not provide individualized financial advice or trade signals. Always size positions within your risk tolerance.
        </p>
      </div>
    </div>
  );
}
