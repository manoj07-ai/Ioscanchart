"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LessonContent } from "@/components/academy/LessonContent";
import type { Lesson } from "@/server/academy/lessons";

interface LessonReaderProps {
  lesson: Lesson;
  prevLesson?: Lesson;
  nextLesson?: Lesson;
}

export function LessonReader({ lesson, prevLesson, nextLesson }: LessonReaderProps) {
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if completed from API or localStorage
    async function checkStatus() {
      try {
        const res = await fetch("/api/academy/progress");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.completedSlugs)) {
            if (json.completedSlugs.includes(lesson.slug)) {
              setCompleted(true);
              return;
            }
          }
        }
      } catch {
        // Fallback
      }

      try {
        const local = localStorage.getItem("iosnapchart_completed_lessons");
        if (local) {
          const slugs: string[] = JSON.parse(local);
          if (slugs.includes(lesson.slug)) {
            setCompleted(true);
          }
        }
      } catch {
        // Ignore JSON error
      }
    }

    checkStatus();
  }, [lesson.slug]);

  async function handleToggleComplete() {
    setSaving(true);
    const nextState = !completed;
    setCompleted(nextState);

    // Save to localStorage
    try {
      const local = localStorage.getItem("iosnapchart_completed_lessons");
      const currentSlugs: string[] = local ? JSON.parse(local) : [];
      let updated: string[];
      if (nextState) {
        updated = Array.from(new Set([...currentSlugs, lesson.slug]));
      } else {
        updated = currentSlugs.filter((s) => s !== lesson.slug);
      }
      localStorage.setItem("iosnapchart_completed_lessons", JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Save to API
    try {
      await fetch("/api/academy/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: lesson.slug, completed: nextState }),
      });
    } catch (err) {
      console.warn("Could not sync progress to server:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href="/app/academy"
          className="inline-flex items-center gap-1.5 text-[var(--text-2)] hover:text-[var(--text-0)] transition-colors font-medium"
        >
          <span>←</span>
          <span>Back to Academy</span>
        </Link>

        <span className="font-mono text-[var(--text-2)]">
          Lesson {String(lesson.order).padStart(2, "0")} / 05
        </span>
      </div>

      {/* Lesson Header */}
      <div className="space-y-4 pb-6 border-b border-[var(--line)]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral" size="sm">
            {lesson.readTimeMinutes} min read
          </Badge>
          {lesson.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-2)] text-[var(--text-2)] border border-[var(--line)]"
            >
              {tag}
            </span>
          ))}
          {completed && (
            <Badge variant="bull" size="sm">
              Completed ✓
            </Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-0)]">
          {lesson.title}
        </h1>

        <p className="text-sm text-[var(--text-2)] leading-relaxed">
          {lesson.subtitle}
        </p>
      </div>

      {/* Main Lesson Body */}
      <article className="prose-container py-2">
        <LessonContent content={lesson.content} />
      </article>

      {/* Completion & Next/Prev Controls */}
      <div className="pt-8 border-t border-[var(--line)] space-y-6">
        <div className="p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-sm font-bold text-[var(--text-0)] block">
              {completed ? "You completed this lesson!" : "Finished reading?"}
            </span>
            <span className="text-xs text-[var(--text-2)]">
              {completed
                ? "This lesson is marked as completed in your progress tracker."
                : "Mark as completed to track your journey through the Academy."}
            </span>
          </div>

          <Button
            variant={completed ? "secondary" : "primary-gradient"}
            size="md"
            onClick={handleToggleComplete}
            disabled={saving}
            className="shrink-0 text-xs font-semibold"
          >
            {completed ? "Completed ✓ (Click to reset)" : "Mark as Complete ✓"}
          </Button>
        </div>

        {/* Previous and Next Navigation */}
        <div className="grid grid-cols-2 gap-4">
          {prevLesson ? (
            <Link
              href={`/app/academy/${prevLesson.slug}`}
              className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--line-strong)] hover:bg-[var(--bg-2)] transition-all group"
            >
              <div className="text-[10px] font-mono uppercase text-[var(--text-2)]">
                ← Previous
              </div>
              <div className="text-xs font-bold text-[var(--text-0)] group-hover:text-[var(--candle)] truncate mt-1">
                {prevLesson.title}
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/app/academy/${nextLesson.slug}`}
              className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--line-strong)] hover:bg-[var(--bg-2)] transition-all text-right group"
            >
              <div className="text-[10px] font-mono uppercase text-[var(--text-2)]">
                Next →
              </div>
              <div className="text-xs font-bold text-[var(--text-0)] group-hover:text-[var(--candle)] truncate mt-1">
                {nextLesson.title}
              </div>
            </Link>
          ) : (
            <Link
              href="/app/academy"
              className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--line-strong)] hover:bg-[var(--bg-2)] transition-all text-right group"
            >
              <div className="text-[10px] font-mono uppercase text-[var(--text-2)]">
                Finished
              </div>
              <div className="text-xs font-bold text-[var(--text-0)] group-hover:text-[var(--candle)] truncate mt-1">
                Back to Academy Catalog →
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
