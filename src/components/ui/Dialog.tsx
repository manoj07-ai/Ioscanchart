"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newVal: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(newVal);
      }
      onOpenChange?.(newVal);
    },
    [controlledOpen, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  asChild,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("DialogTrigger must be used inside Dialog");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    ctx.onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as { onClick?: (e: React.MouseEvent) => void };
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
      onClick: (e: React.MouseEvent) => {
        childProps.onClick?.(e);
        ctx.onOpenChange(true);
      },
    });
  }

  return (
    <button type="button" onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}

export function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("DialogContent must be used inside Dialog");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ctx.open) {
        ctx.onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ctx]);

  if (!ctx.open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => ctx.onOpenChange(false)}
        aria-hidden="true"
      />
      {/* Content panel */}
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-1)] p-6 shadow-2xl card-highlight",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          className
        )}
        {...props}
      >
        <button
          type="button"
          onClick={() => ctx.onOpenChange(false)}
          className="absolute top-4 right-4 text-[var(--text-2)] hover:text-[var(--text-0)] p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-4 text-left", className)} {...props} />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold tracking-tight text-[var(--text-0)]", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-[var(--text-2)] leading-relaxed", className)} {...props} />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-end space-x-2 pt-4 border-t border-[var(--line)]/40 mt-6", className)}
      {...props}
    />
  );
}
