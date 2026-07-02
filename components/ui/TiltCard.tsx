"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  className?: string;
  children: React.ReactNode;
  /** Max tilt in degrees. */
  intensity?: number;
  glow?: boolean;
}

/**
 * Glass card with a subtle 3D pointer-tilt and a cursor-tracking glow.
 * Falls back to a static card when prefers-reduced-motion is set.
 */
export function TiltCard({
  className,
  children,
  intensity = 8,
  glow = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(0);

  const glowBg = useMotionTemplate`radial-gradient(220px circle at ${glowX}% ${glowY}px, rgba(34,211,238,0.14), transparent 60%)`;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * intensity * 2);
    rotateX.set((0.5 - py) * intensity * 2);
    glowX.set(px * 100);
    glowY.set(e.clientY - rect.top);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={
        reduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1000 }
      }
      className={cn(
        "glass border-gradient relative overflow-hidden p-6",
        "transition-shadow duration-300 hover:shadow-glow",
        className,
      )}
    >
      {glow && !reduceMotion && (
        <motion.div
          aria-hidden
          style={{ background: glowBg }}
          className="pointer-events-none absolute inset-0"
        />
      )}
      <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
