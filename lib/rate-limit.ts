/**
 * ─────────────────────────────────────────────────────────────────────────
 * Apex Process — In-memory IP rate limiter
 * ─────────────────────────────────────────────────────────────────────────
 * A simple fixed-window limiter suitable for a single Vercel serverless
 * instance / low-to-moderate traffic. Counters live in module memory and
 * reset on cold start.
 *
 * TODO (production): swap for a shared store (Upstash Redis / Vercel KV) so
 * limits hold across serverless instances and regions.
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

const MAX = Number(process.env.RATE_LIMIT_MAX ?? 5);
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000);

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
};

/** Best-effort client IP extraction from forwarding headers. */
export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return (
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

/**
 * Consume one token for the given key. Returns whether the request is allowed.
 * @param now injectable clock for testability (defaults to Date.now()).
 */
export function rateLimit(key: string, now: number = Date.now()): RateLimitResult {
  const existing = store.get(key);

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + WINDOW_MS;
    store.set(key, { count: 1, resetAt });
    return { ok: true, remaining: MAX - 1, resetAt, retryAfterSec: 0 };
  }

  if (existing.count >= MAX) {
    return {
      ok: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: MAX - existing.count,
    resetAt: existing.resetAt,
    retryAfterSec: 0,
  };
}

/** Opportunistic cleanup to keep the map from growing unbounded. */
export function sweepExpired(now: number = Date.now()): void {
  for (const [key, bucket] of store) {
    if (now >= bucket.resetAt) store.delete(key);
  }
}
