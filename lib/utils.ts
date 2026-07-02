import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a US phone number as the user types: (555) 123-4567.
 * Strips non-digits and ignores a leading country code "1".
 */
export function formatUsPhone(value: string): string {
  const digits = value.replace(/\D/g, "").replace(/^1(?=\d{10})/, "");
  const d = digits.slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Normalize an email: trim + lowercase. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Lightweight sanitizer for free-text fields. Strips angle brackets and
 * ASCII control characters to prevent obvious injection in logs / downstream
 * surfaces. This is defense-in-depth, NOT a substitute for output encoding.
 */
export function sanitizeText(value: string): string {
  const controlChars = /[\x00-\x1F\x7F]/g;
  return value
    .replace(/[<>]/g, "")
    .replace(controlChars, " ")
    .trim()
    .slice(0, 2000);
}

/** Stable string hash (FNV-1a) — used for non-cryptographic dedupe keys. */
export function stableHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/** Scroll to the application form (respects `#apply` scroll-margin). */
export function scrollToApply(behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById("apply");
  if (!el) return;
  el.scrollIntoView({ behavior, block: "start" });
  if (window.location.hash !== "#apply") {
    window.history.replaceState(null, "", "#apply");
  }
}

/** True when the form card is comfortably visible — used to hide duplicate mobile CTAs. */
export function isApplyFormInView(): boolean {
  const el = document.getElementById("apply");
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const header = 96;
  return rect.top < window.innerHeight - 120 && rect.bottom > header;
}
