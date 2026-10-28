"use client";

import React from "react";

interface LessonContentProps {
  content: string;
}

export function LessonContent({ content }: LessonContentProps) {
  // Parse markdown content line-by-line / block-by-block
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];
  let inOrderedList = false;
  let orderedItems: React.ReactNode[] = [];

  function flushLists() {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-3 space-y-1.5 list-disc list-inside text-sm text-[var(--text-1)] pl-2">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
    if (inOrderedList && orderedItems.length > 0) {
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-3 space-y-1.5 list-decimal list-inside text-sm text-[var(--text-1)] pl-2">
          {orderedItems}
        </ol>
      );
      orderedItems = [];
      inOrderedList = false;
    }
  }

  function formatInline(text: string): React.ReactNode {
    // Process bold, italic, code
    const parts: React.ReactNode[] = [];
    const current = text;
    let keyIdx = 0;

    // Simple regex replacements for bold **...** and `code`
    const tokens = current.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    for (const token of tokens) {
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={keyIdx++} className="font-bold text-[var(--text-0)]">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 rounded text-xs font-mono bg-[var(--bg-2)] text-[var(--candle)] border border-[var(--line)]"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <em key={keyIdx++} className="italic text-[var(--text-1)]">
            {token.slice(1, -1)}
          </em>
        );
      } else {
        parts.push(token);
      }
    }

    return <>{parts}</>;
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushLists();
      continue;
    }

    // Headers
    if (line.startsWith("### ")) {
      flushLists();
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-lg font-bold text-[var(--text-0)] mt-6 mb-2 tracking-tight"
        >
          {formatInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith("#### ")) {
      flushLists();
      elements.push(
        <h4
          key={`h4-${i}`}
          className="text-sm font-bold uppercase tracking-wider text-[var(--candle)] mt-4 mb-2"
        >
          {formatInline(line.slice(5))}
        </h4>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushLists();
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-xl font-extrabold text-[var(--text-0)] mt-8 mb-3 tracking-tight border-b border-[var(--line)] pb-1.5"
        >
          {formatInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushLists();
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="p-3 my-4 border-l-2 border-[var(--candle)] bg-[var(--bg-2)]/60 text-xs italic text-[var(--text-1)] rounded-r-lg"
        >
          {formatInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered list item
    if (line.startsWith("- ")) {
      if (inOrderedList) flushLists();
      inList = true;
      listItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {formatInline(line.slice(2))}
        </li>
      );
      continue;
    }

    // Ordered list item
    const matchOrdered = line.match(/^(\d+)\.\s+(.*)$/);
    if (matchOrdered) {
      if (inList) flushLists();
      inOrderedList = true;
      orderedItems.push(
        <li key={`oli-${i}`} className="leading-relaxed">
          {formatInline(matchOrdered[2])}
        </li>
      );
      continue;
    }

    // Math block or formula display
    if (line.startsWith("$$") && line.endsWith("$$")) {
      flushLists();
      const formula = line.slice(2, -2).trim();
      elements.push(
        <div
          key={`math-${i}`}
          className="my-4 p-4 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] font-mono text-center text-sm sm:text-base text-[var(--text-0)] overflow-x-auto"
        >
          {formula}
        </div>
      );
      continue;
    }

    // Default: paragraph
    flushLists();
    elements.push(
      <p
        key={`p-${i}`}
        className="text-sm text-[var(--text-1)] leading-relaxed my-3"
      >
        {formatInline(line)}
      </p>
    );
  }

  flushLists();

  return <div className="space-y-1">{elements}</div>;
}
