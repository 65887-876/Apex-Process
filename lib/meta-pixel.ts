/**
 * ─────────────────────────────────────────────────────────────────────────
 * Meta Pixel — browser-side helpers
 * ─────────────────────────────────────────────────────────────────────────
 * The base Pixel snippet is injected once in <MetaPixel /> (see
 * components/analytics/MetaPixel.tsx). These helpers fire standard events
 * from client components.
 *
 * We pass an `eventID` so the browser Pixel event and the server-side
 * Conversions API event (see lib/meta-capi.ts) are DEDUPLICATED by Meta.
 * Generate the id once, send it to /api/apply, and use the same value here.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

// Minimal typing for the global fbq function injected by the Pixel snippet.
type Fbq = (
  method: "track" | "trackCustom" | "init" | "trackSingle",
  eventOrPixelId: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** True when the Pixel is configured and the fbq shim is available. */
function pixelReady(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.fbq === "function" &&
    META_PIXEL_ID !== ""
  );
}

/**
 * Generate a unique event id shared between the browser Pixel event and the
 * server Conversions API event. Uses crypto.randomUUID when available.
 */
export function newEventId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers — good enough for dedupe keys.
  return `evt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/**
 * Fire the standard `Subscribe` event.
 * Pass the same `eventId` you sent to the server so Meta can dedupe.
 */
export function trackSubscribe(params?: {
  eventId?: string;
  value?: number;
  currency?: string;
}): void {
  if (!pixelReady()) return;

  const { eventId, value, currency = "USD" } = params ?? {};

  const data: Record<string, unknown> = { currency };
  if (typeof value === "number") data.value = value;

  window.fbq!("track", "Subscribe", data, eventId ? { eventID: eventId } : undefined);
}
