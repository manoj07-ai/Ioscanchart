"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}

export function Accordion({
  type = "single",
  defaultValue,
  className,
  children,
  ...props
}: AccordionProps) {
  const initialOpen = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue
    ? [defaultValue]
    : [];
  const [openItems, setOpenItems] = React.useState<string[]>(initialOpen);

  const toggleItem = React.useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        if (type === "single") {
          return prev.includes(id) ? [] : [id];
        } else {
          return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
        }
      });
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("divide-y divide-[var(--line)] border-y border-[var(--line)]", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  id,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { id: string }) {
  return (
    <div className={cn("py-2", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ itemId: string }>, { itemId: id });
        }
        return child;
      })}
    </div>
  );
}

export function AccordionTrigger({
  itemId,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { itemId?: string }) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx || !itemId) throw new Error("AccordionTrigger must be inside AccordionItem");

  const isOpen = ctx.openItems.includes(itemId);

  return (
    <button
      type="button"
      onClick={() => ctx.toggleItem(itemId)}
      aria-expanded={isOpen}
      className={cn(
        "flex w-full items-center justify-between py-3 font-medium text-sm text-[var(--text-0)] transition-colors hover:text-[var(--candle)] text-left cursor-pointer",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span
        className={cn(
          "text-xs text-[var(--text-2)] transition-transform duration-200 select-none",
          isOpen && "rotate-180 text-[var(--candle)]"
        )}
        aria-hidden="true"
      >
        ▼
      </span>
    </button>
  );
}

export function AccordionContent({
  itemId,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { itemId?: string }) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx || !itemId) throw new Error("AccordionContent must be inside AccordionItem");

  const isOpen = ctx.openItems.includes(itemId);
  if (!isOpen) return null;

  return (
    <div
      className={cn("pb-4 pt-1 text-sm text-[var(--text-1)] leading-relaxed animate-in fade-in-50 duration-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}
