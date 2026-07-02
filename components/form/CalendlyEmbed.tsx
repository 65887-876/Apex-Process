"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { calendlyUrl } from "@/lib/config";

type ScheduledPayload = {
  uri: string;
  startTime?: string;
};

function buildEmbedUrl(name?: string, email?: string): string {
  const url = new URL(calendlyUrl);
  // Required for postMessage events (calendly.event_scheduled) to reach the parent page.
  // https://community.calendly.com/developer-faq-62/embed-i-am-not-receiving-parent-window-notifications-i-cannot-hide-the-cookie-banner-629
  url.searchParams.set("embed_domain", window.location.host || "localhost");
  url.searchParams.set("embed_type", "Inline");
  url.searchParams.set("hide_gdpr_banner", "1");
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim();
  if (trimmedName) url.searchParams.set("name", trimmedName);
  if (trimmedEmail) url.searchParams.set("email", trimmedEmail);
  return url.toString();
}

function parseCalendlyMessage(data: unknown): ScheduledPayload | null {
  if (typeof data === "string") {
    try {
      return parseCalendlyMessage(JSON.parse(data) as unknown);
    } catch {
      return null;
    }
  }
  if (typeof data !== "object" || data === null) return null;
  const msg = data as {
    event?: string;
    payload?: { event?: { uri?: string; start_time?: string } };
  };
  if (msg.event !== "calendly.event_scheduled") return null;
  return {
    uri: msg.payload?.event?.uri ?? `calendly:scheduled:${Date.now()}`,
    startTime: msg.payload?.event?.start_time,
  };
}

function isCalendlyOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return host === "calendly.com" || host.endsWith(".calendly.com");
  } catch {
    return false;
  }
}

export function CalendlyEmbed({
  name,
  email,
  onScheduled,
  error,
  scheduledMessage,
  submitting,
}: {
  name?: string;
  email?: string;
  onScheduled: (payload: ScheduledPayload) => void;
  error?: string;
  scheduledMessage?: string;
  submitting?: boolean;
}) {
  const [iframeSrc, setIframeSrc] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const onScheduledRef = useRef(onScheduled);
  useEffect(() => {
    onScheduledRef.current = onScheduled;
  }, [onScheduled]);

  useEffect(() => {
    if (!calendlyUrl) return;
    // buildEmbedUrl reads window.location.host, so it must run on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIframeSrc(buildEmbedUrl(name, email));
  }, [name, email]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isCalendlyOrigin(event.origin)) return;
      const payload = parseCalendlyMessage(event.data);
      if (!payload) return;

      setScheduled(true);
      onScheduledRef.current(payload);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function manualComplete() {
    if (submitting) return;
    setScheduled(true);
    onScheduledRef.current({
      uri: `calendly:manual:${Date.now()}`,
      startTime: new Date().toISOString(),
    });
  }

  if (!calendlyUrl) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-medium">Calendly is not configured yet.</p>
        <p className="mt-1 text-amber-800">
          Add <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_CALENDLY_URL</code> to your
          environment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scheduled && (
        <div className="flex items-center gap-2 rounded-xl border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm font-medium text-emerald-900">
          <CalendarCheck className="h-5 w-5 shrink-0 text-cyan" aria-hidden />
          {scheduledMessage ??
            (submitting
              ? "Submitting your application…"
              : "Call booked — submitting your application…")}
        </div>
      )}

      {iframeSrc && (
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          title="Schedule your discovery call"
          className="w-full rounded-xl border border-slate-200 bg-white"
          style={{ minWidth: "280px", height: "min(680px, 72vh)" }}
        />
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
        <p className="text-xs text-slate-600">
          {scheduled
            ? "Finishing your application…"
            : "After you see “You are scheduled” above, tap below to submit."}
        </p>
        <Button
          type="button"
          className="mt-3 w-full sm:w-auto"
          magnetic={false}
          disabled={submitting}
          onClick={manualComplete}
        >
          {submitting ? "Submitting…" : "I scheduled my call — submit application"}
        </Button>
      </div>

      <p className="text-center text-xs text-slate-500">
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-cyan underline-offset-2 hover:underline"
        >
          Open Calendly in a new tab
        </a>
      </p>

      {error && !scheduled && (
        <p role="alert" className="text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}
