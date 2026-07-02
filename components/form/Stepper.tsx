"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useFormTheme } from "@/components/form/FormTheme";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  const light = useFormTheme() === "light";
  const pct = (current / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between sm:hidden">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan">
          Step {current + 1} of {steps.length}
        </span>
        <span
          className={cn(
            "text-sm font-medium",
            light ? "text-ink-950" : "text-white",
          )}
        >
          {steps[current]}
        </span>
      </div>

      <div className="relative">
        <div
          className={cn(
            "absolute left-0 right-0 top-4 h-0.5 -translate-y-1/2",
            light ? "bg-slate-200" : "bg-white/10",
          )}
        />
        <motion.div
          className="absolute left-0 top-4 h-0.5 -translate-y-1/2 bg-cyan"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        <ol className="relative flex justify-between">
          {steps.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li
                key={label}
                className="flex flex-col items-center gap-2"
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300",
                    done && "border-cyan bg-cyan text-ink-950",
                    active &&
                      (light
                        ? "border-cyan bg-white text-cyan shadow-glow"
                        : "border-cyan bg-ink-900 text-cyan shadow-glow"),
                    !done &&
                      !active &&
                      (light
                        ? "border-slate-200 bg-slate-50 text-slate-400"
                        : "border-white/15 bg-ink-800 text-slate-500"),
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-center text-xs font-medium sm:block",
                    active
                      ? light
                        ? "text-ink-950"
                        : "text-white"
                      : "text-slate-500",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
