"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "info";
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...item, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = item.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export function Toaster() {
  const ctx = React.useContext(ToastContext);
  if (!ctx || ctx.toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none"
    >
      {ctx.toasts.map((item) => {
        const variantStyles = {
          default: "border-[var(--line-strong)] bg-[var(--bg-2)] text-[var(--text-0)]",
          success: "border-[var(--candle)]/40 bg-[var(--bg-1)] text-[var(--candle)]",
          error: "border-[var(--bear)]/40 bg-[var(--bg-1)] text-[var(--bear)]",
          info: "border-[var(--info)]/40 bg-[var(--bg-1)] text-[var(--info)]",
        }[item.variant ?? "default"];

        return (
          <div
            key={item.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start justify-between rounded-xl p-4 shadow-xl border backdrop-blur-md transition-all card-highlight",
              "animate-in fade-in-0 slide-in-from-bottom-3 duration-200",
              variantStyles
            )}
          >
            <div className="flex-1 pr-2">
              <div className="font-semibold text-xs leading-none">{item.title}</div>
              {item.description && (
                <div className="mt-1 text-xs text-[var(--text-1)] leading-relaxed">
                  {item.description}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => ctx.dismiss(item.id)}
              className="text-[var(--text-2)] hover:text-[var(--text-0)] text-xs p-0.5 cursor-pointer"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
