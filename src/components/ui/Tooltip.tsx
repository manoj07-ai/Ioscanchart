"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const child = React.Children.only(children);
  const childProps = (child.props || {}) as {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  };

  const clonedChild = React.cloneElement(child as React.ReactElement<{
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  }>, {
    onMouseEnter: () => {
      childProps.onMouseEnter?.();
      handleMouseEnter();
    },
    onMouseLeave: () => {
      childProps.onMouseLeave?.();
      handleMouseLeave();
    },
    onFocus: () => {
      childProps.onFocus?.();
      handleFocus();
    },
    onBlur: () => {
      childProps.onBlur?.();
      handleBlur();
    },
  });

  return (
    <span className="relative inline-block">
      {clonedChild}
      {isVisible && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg",
            "bg-[var(--bg-3)] border border-[var(--line-strong)] text-[var(--text-0)] text-xs font-normal shadow-xl whitespace-nowrap pointer-events-none",
            "animate-in fade-in-50 zoom-in-95 duration-150",
            className
          )}
        >
          {content}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--line-strong)]"
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
}
