import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error,
      helperText,
      startAdornment,
      endAdornment,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col space-y-1.5">
        <div className="relative flex items-center w-full">
          {startAdornment && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--text-2)] text-sm">
              {startAdornment}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--bg-3)] px-3.5 py-2 text-sm text-[var(--text-0)] placeholder:text-[var(--text-2)]",
              "transition-all duration-150 ease-out",
              "hover:border-[var(--line-strong)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--candle)] focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              Boolean(startAdornment) && "pl-10",
              Boolean(endAdornment) && "pr-10",
              Boolean(error) && "border-[var(--bear)] focus-visible:ring-[var(--bear)]",
              className
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-[var(--text-2)] text-sm">
              {endAdornment}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-[var(--bear)] font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-[var(--text-2)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
