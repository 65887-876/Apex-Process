"use client";

import { forwardRef, useRef } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "cta";
type Size = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
  > {
  variant?: Variant;
  size?: Size;
  /** Enable the cursor-following magnetic effect (default true). */
  magnetic?: boolean;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-cyan to-violet text-ink-950 font-semibold shadow-glow hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.7)]",
  cta:
    "bg-gradient-to-r from-cyan to-violet text-ink-950 font-semibold shadow-glow hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.7)]",
  secondary:
    "bg-white/[0.03] text-white border border-cyan/40 hover:border-cyan hover:shadow-glow",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  outline:
    "bg-transparent text-slate-200 border border-white/15 hover:border-cyan/60 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-lg",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-14 px-8 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      magnetic = true,
      loading = false,
      disabled,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const innerRef = useRef<HTMLButtonElement | null>(null);
    const reduceMotion = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const useMagnetic = magnetic && !reduceMotion && !disabled && !loading;

    function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
      if (!useMagnetic) return;
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      x.set(relX * 0.25);
      y.set(relY * 0.35);
    }

    function reset() {
      x.set(0);
      y.set(0);
    }

    return (
      <motion.button
        ref={(node) => {
          innerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        style={{ x, y }}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap transition-colors duration-200",
          "disabled:cursor-not-allowed disabled:opacity-60",
          sizes[size],
          variants[variant],
          className,
        )}
        {...props}
      >
        {loading && (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        <span className={cn(loading && "opacity-90")}>{children}</span>
      </motion.button>
    );
  },
);

Button.displayName = "Button";
