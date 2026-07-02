import { cn } from "@/lib/utils";

/** Apex Process mark — an abstract upward "A" apex node. Original artwork. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="apex-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3ce7ff" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="10" stroke="url(#apex-g)" strokeOpacity="0.5" strokeWidth="1.5" />
      {/* Apex chevron */}
      <path
        d="M20 9 L31 30 H25.5 L20 19 L14.5 30 H9 Z"
        fill="url(#apex-g)"
      />
      {/* Node dot at the apex */}
      <circle cx="20" cy="9" r="2.4" fill="#3ce7ff" />
    </svg>
  );
}
