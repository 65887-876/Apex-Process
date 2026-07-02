import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/validation";
import { generateApplicationId } from "@/lib/application-id";
import { evaluateEligibility } from "@/lib/eligibility";
import { flags } from "@/lib/config";
import { getClientIp, rateLimit, sweepExpired } from "@/lib/rate-limit";
import { sanitizeText, stableHash } from "@/lib/utils";
import { sendSubscribeEvent, readCookie } from "@/lib/meta-capi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * In-memory dedupe of recently-seen submissions (per cold start).
 * Keyed by a non-PII hash of email+phone+slot. Prevents accidental double
 * submits. TODO: replace with a DB unique constraint in production.
 */
const recentSubmissions = new Map<string, number>();
const DEDUPE_WINDOW_MS = 5 * 60 * 1000;

function isDuplicate(key: string, now: number): boolean {
  const seen = recentSubmissions.get(key);
  if (seen && now - seen < DEDUPE_WINDOW_MS) return true;
  recentSubmissions.set(key, now);
  // Opportunistic cleanup.
  if (recentSubmissions.size > 500) {
    for (const [k, t] of recentSubmissions) {
      if (now - t > DEDUPE_WINDOW_MS) recentSubmissions.delete(k);
    }
  }
  return false;
}

/** Reject anything that isn't POST. */
function methodNotAllowed() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function GET() {
  return methodNotAllowed();
}
export async function PUT() {
  return methodNotAllowed();
}
export async function DELETE() {
  return methodNotAllowed();
}

export async function POST(request: Request) {
  const now = Date.now();

  try {
    // ── Rate limiting ───────────────────────────────────────────────────
    sweepExpired(now);
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`apply:${ip}`, now);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rl.retryAfterSec),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // ── Parse JSON safely ───────────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    // ── Honeypot check (before heavy validation) ────────────────────────
    if (
      body &&
      typeof body === "object" &&
      "website" in body &&
      typeof (body as Record<string, unknown>).website === "string" &&
      (body as Record<string, string>).website.trim() !== ""
    ) {
      // Pretend success to avoid tipping off bots, but do nothing.
      return NextResponse.json(
        { applicationId: generateApplicationId(), eligible: true },
        { status: 200 },
      );
    }

    // ── Server-side validation ──────────────────────────────────────────
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      return NextResponse.json(
        { error: "Validation failed.", fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // ── Duplicate submission protection ─────────────────────────────────
    const dedupeKey = stableHash(
      `${data.email}|${data.phone}|${data.callSlotId}`,
    );
    if (isDuplicate(dedupeKey, now)) {
      return NextResponse.json(
        { error: "We already received this application moments ago." },
        { status: 409 },
      );
    }

    // ── Eligibility gate (configurable) ─────────────────────────────────
    const outcome = flags.enableEligibilityGate
      ? evaluateEligibility(data)
      : { eligible: true as const };

    const applicationId = generateApplicationId();

    // ── Privacy-conscious structured log (NO PII) ───────────────────────
    // We log only non-identifying metadata. Never log names, email, phone.
    console.info(
      JSON.stringify({
        event: "application_received",
        applicationId,
        eligible: outcome.eligible,
        state: sanitizeText(data.state),
        referralSource: sanitizeText(data.referralSource),
        ipHash: stableHash(ip),
        at: new Date(now).toISOString(),
      }),
    );

    // ── Integration hooks (all optional / no-op if unconfigured) ────────
    // The payload is validated & sanitized. Implement these as needed.
    //
    // TODO(Supabase): insert into `applications`
    //   import { createClient } from "@supabase/supabase-js";
    //   const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    //   await supabase.from("applications").insert({ application_id: applicationId, ...data });
    //
    // TODO(Airtable): POST to the Airtable REST API with AIRTABLE_API_KEY.
    //
    // TODO(Resend): notify ops
    //   await fetch("https://api.resend.com/emails", { ... RESEND_API_KEY ... });
    //
    // TODO(Slack): post to SLACK_WEBHOOK_URL (avoid sending PII to chat).
    //
    // TODO(CRM): forward to CRM_WEBHOOK_URL.

    if (!outcome.eligible) {
      return NextResponse.json(
        { applicationId, eligible: false, reasonCode: outcome.reasonCode },
        { status: 200 },
      );
    }

    // ── Meta Conversions API (server-side Subscribe) ────────────────────
    // Deduplicated against the browser Pixel event via the shared metaEventId.
    // Fire-and-forget: tracking must never block or fail the response.
    const metaEventId =
      body &&
      typeof body === "object" &&
      typeof (body as Record<string, unknown>).metaEventId === "string"
        ? ((body as Record<string, string>).metaEventId as string)
        : undefined;

    if (metaEventId) {
      const cookieHeader = request.headers.get("cookie");
      const origin =
        request.headers.get("origin") ??
        (() => {
          try {
            return new URL(request.url).origin;
          } catch {
            return undefined;
          }
        })();

      void sendSubscribeEvent({
        eventId: metaEventId,
        eventSourceUrl: origin ? `${origin}/#apply` : undefined,
        user: {
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          state: data.state,
          country: "us",
          clientIp: ip,
          userAgent: request.headers.get("user-agent") ?? undefined,
          fbp: readCookie(cookieHeader, "_fbp"),
          fbc: readCookie(cookieHeader, "_fbc"),
        },
      });
    }

    return NextResponse.json(
      { applicationId, eligible: true },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    // Never leak stack traces to the client.
    console.error(
      JSON.stringify({
        event: "application_error",
        message: err instanceof Error ? err.message : "unknown",
        at: new Date(now).toISOString(),
      }),
    );
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 },
    );
  }
}
