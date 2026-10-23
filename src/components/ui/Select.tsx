import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, error, helperText, disabled, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-[var(--text-1)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            id={id}
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full appearance-none rounded-xl border border-[var(--line)] bg-[var(--bg-3)] px-3.5 py-2 text-sm text-[var(--text-0)]",
              "transition-all duration-150 ease-out cursor-pointer",
              "hover:border-[var(--line-strong)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--candle)] focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 pr-9",
              error && "border-[var(--bear)] focus-visible:ring-[var(--bear)]",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-[var(--bg-2)] text-[var(--text-0)] py-1"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[var(--text-2)] text-xs">
            ▼
          </div>
        </div>
        {error && <p className="text-xs text-[var(--bear)] font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[var(--text-2)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
