import { createHash } from "node:crypto";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Meta Conversions API (server-side) — Subscribe event
 * ─────────────────────────────────────────────────────────────────────────
 * Sends server-side conversion events to Meta so tracking survives ad
 * blockers, cookie loss, and iOS restrictions. Paired with the browser Pixel
 * via a shared `event_id`, Meta DEDUPLICATES the two so a single conversion
 * is not double-counted.
 *
 * PII (email, phone, name, location) is SHA-256 hashed before it leaves the
 * server, per Meta's requirements. Never send raw PII.
 *
 * Configure via env:
 *   NEXT_PUBLIC_META_PIXEL_ID  — pixel id (also used by the browser)
 *   META_CAPI_ACCESS_TOKEN     — server-only access token
 *   META_TEST_EVENT_CODE       — optional; routes events to Test Events tab
 */

const GRAPH_VERSION = "v21.0";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN ?? "";
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE ?? "";

/** SHA-256 hash a normalized string (lowercased + trimmed). Undefined-safe. */
function hash(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return createHash("sha256").update(normalized).digest("hex");
}

/** Normalize a US phone to E.164 digits (11-digit, leading 1) before hashing. */
function hashPhone(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  const e164 = digits.length === 10 ? `1${digits}` : digits;
  return createHash("sha256").update(e164).digest("hex");
}

export type CapiUserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  state?: string;
  /** 2-letter country code (e.g. "us"); defaults to "us". */
  country?: string;
  /** From request headers — improves match quality. */
  clientIp?: string;
  userAgent?: string;
  /** _fbp / _fbc browser cookies, when available. */
  fbp?: string;
  fbc?: string;
};

export type CapiSubscribeInput = {
  /** MUST match the browser Pixel event's eventID for deduplication. */
  eventId: string;
  /** Absolute URL of the page where the conversion happened. */
  eventSourceUrl?: string;
  /** Unix seconds; defaults to now. */
  eventTime?: number;
  value?: number;
  currency?: string;
  user: CapiUserData;
};

/**
 * Send a `Subscribe` conversion to the Meta Conversions API.
 *
 * Returns { ok } — non-throwing on the happy path. Callers should invoke this
 * WITHOUT awaiting the response critical-path (fire-and-forget) so tracking
 * never blocks or fails the user's submission. Logs errors without PII.
 */
export async function sendSubscribeEvent(
  input: CapiSubscribeInput,
): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    // Not configured — silently skip (e.g. local dev without a token).
    return { ok: false, skipped: true };
  }

  const { user } = input;

  const userData: Record<string, unknown> = {
    em: hash(user.email),
    ph: hashPhone(user.phone),
    fn: hash(user.firstName),
    ln: hash(user.lastName),
    st: hash(user.state),
    country: hash(user.country ?? "us"),
    client_ip_address: user.clientIp,
    client_user_agent: user.userAgent,
    fbp: user.fbp,
    fbc: user.fbc,
  };

  // Drop undefined keys — Meta rejects null values in user_data.
  for (const k of Object.keys(userData)) {
    if (userData[k] === undefined) delete userData[k];
  }

  const customData: Record<string, unknown> = {
    currency: input.currency ?? "USD",
  };
  if (typeof input.value === "number") customData.value = input.value;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Subscribe",
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: customData,
      },
    ],
  };

  if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
    ACCESS_TOKEN,
  )}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        JSON.stringify({
          event: "meta_capi_error",
          status: res.status,
          // Meta's error body is safe to log (no applicant PII in it).
          detail: detail.slice(0, 500),
        }),
      );
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "meta_capi_exception",
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return { ok: false };
  }
}

/** Parse a specific cookie value from a Cookie header string. */
export function readCookie(
  cookieHeader: string | null,
  name: string,
): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}
