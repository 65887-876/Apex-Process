"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  const pct = (current / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between sm:hidden">
        <span className="text-xs font-medium uppercase tracking-wider text-cyan">
          Step {current + 1} of {steps.length}
        </span>
        <span className="text-sm font-medium text-white">{steps[current]}</span>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-4 h-0.5 -translate-y-1/2 bg-white/10" />
        <motion.div
          className="absolute left-0 top-4 h-0.5 -translate-y-1/2 bg-gradient-to-r from-cyan to-violet"
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
                    active && "border-cyan bg-ink-900 text-cyan shadow-glow",
                    !done && !active && "border-white/15 bg-white/[0.03] text-slate-500",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-center text-xs font-medium sm:block",
                    active ? "text-white" : "text-slate-500",
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
