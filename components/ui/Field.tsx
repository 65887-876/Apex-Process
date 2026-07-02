"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-200">
        {label}
        {required && <span className="ml-0.5 text-cyan">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-xs font-medium text-rose-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const baseControl =
  "w-full rounded-xl border bg-white/[0.03] px-4 text-[15px] text-white placeholder:text-slate-500 transition-all duration-200 outline-none";
const controlState = (hasError?: boolean) =>
  hasError
    ? "border-rose-400/60 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.18)]"
    : "border-white/15 focus:border-cyan focus:shadow-[0_0_0_3px_rgba(34,211,238,0.18)]";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={hasError || undefined}
      className={cn(baseControl, "h-12", controlState(hasError), className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  options: readonly string[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, options, placeholder, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(
          baseControl,
          "h-12 appearance-none pr-10",
          controlState(hasError),
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-ink-900 text-white">
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
  ),
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
    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="group flex cursor-pointer items-start gap-3 text-sm text-slate-300"
        >
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              aria-invalid={!!error || undefined}
              className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md border border-white/20 bg-white/[0.03] transition-all checked:border-cyan checked:bg-cyan/20 focus-visible:ring-2 focus-visible:ring-cyan/70"
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
          <p role="alert" className="ml-8 text-xs font-medium text-rose-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
