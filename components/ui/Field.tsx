"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { useFormTheme } from "@/components/form/FormTheme";

interface FieldWrapProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FieldWrapProps) {
  const theme = useFormTheme();
  const light = theme === "light";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "text-sm font-medium",
          light ? "text-slate-700" : "text-slate-200",
        )}
      >
        {label}
        {required && <span className="ml-0.5 text-cyan">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className={cn("text-xs", light ? "text-slate-500" : "text-slate-400")}>
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-xs font-medium text-rose-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function useControlStyles(hasError?: boolean) {
  const light = useFormTheme() === "light";

  const base = light
    ? "w-full rounded-xl border bg-white px-4 text-[15px] text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none"
    : "w-full rounded-xl border bg-ink-800/60 px-4 text-[15px] text-white placeholder:text-slate-500 transition-all duration-200 outline-none";

  const state = hasError
    ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
    : light
      ? "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      : "border-white/10 focus:border-cyan/70 focus:ring-2 focus:ring-cyan/20";

  return { base, state };
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    const { base, state } = useControlStyles(hasError);
    return (
      <input
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(base, "h-12", state, className)}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  options: readonly string[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, options, placeholder, ...props }, ref) => {
    const { base, state } = useControlStyles(hasError);
    const light = useFormTheme() === "light";

    return (
      <div className="relative">
        <select
          ref={ref}
          aria-invalid={hasError || undefined}
          className={cn(base, "h-12 appearance-none pr-10", state, className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt}
              value={opt}
              className={light ? "bg-white text-slate-900" : "bg-ink-800 text-white"}
            >
              {opt}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  },
);
Select.displayName = "Select";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const light = useFormTheme() === "light";

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className={cn(
            "group flex cursor-pointer items-start gap-3 text-sm",
            light ? "text-slate-700" : "text-slate-300",
          )}
        >
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              aria-invalid={!!error || undefined}
              className={cn(
                "peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md border transition-all checked:border-cyan checked:bg-cyan/20 focus-visible:ring-2 focus-visible:ring-cyan/70",
                light ? "border-slate-300 bg-white" : "border-white/20 bg-ink-800",
              )}
              {...props}
            />
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="pointer-events-none h-3 w-3 scale-0 text-cyan opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M3 8l3.5 3.5L13 4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="leading-relaxed">{label}</span>
        </label>
        {error && (
          <p role="alert" className="ml-8 text-xs font-medium text-rose-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
