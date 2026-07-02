"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Stepper } from "./Stepper";
import {
  StepContact,
  StepEligibility,
  StepDocuments,
  StepCall,
} from "./steps";
import { SuccessState } from "./SuccessState";
import { IneligibleState } from "./IneligibleState";
import {
  applicationSchema,
  emptyApplication,
  type ApplicationData,
} from "@/lib/validation";
import { formatUsPhone } from "@/lib/utils";
import { newEventId, trackSubscribe } from "@/lib/meta-pixel";

const DRAFT_KEY = "apex-application-draft-v1";
const STEP_LABELS = ["Contact", "Eligibility", "Documents", "Schedule"];

// Fields validated per step before advancing.
const STEP_FIELDS: FieldPath<ApplicationData>[][] = [
  ["firstName", "lastName", "email", "phone", "state", "preferredContact", "referralSource", "website"],
  ["ageRange", "creditRange", "incomeRange", "experience", "callAvailability", "usResident", "accurateInfo"],
  ["idReady", "addressReady", "bankStatementsReady", "taxDocsReady", "entityDocsReady", "consentReview", "consentPrivacy", "acknowledgeNoGuarantee"],
  ["callSlotId"],
];

type Status = "form" | "success" | "ineligible";

export function ApplicationWizard() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("form");
  const [applicationId, setApplicationId] = useState("");
  const [waitlisted, setWaitlisted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const submittedRef = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: emptyApplication,
    mode: "onBlur",
  });

  // ── Restore draft from localStorage on mount ──────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ApplicationData>;
      // Only restore known keys; never trust shape blindly.
      (Object.keys(emptyApplication) as (keyof ApplicationData)[]).forEach((k) => {
        if (parsed[k] !== undefined) {
          setValue(k, parsed[k] as never, { shouldValidate: false });
        }
      });
      toast({ type: "info", title: "Draft restored", message: "We saved your progress." });
    } catch {
      // Corrupt draft — clear it silently.
      localStorage.removeItem(DRAFT_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist draft on change (excludes honeypot) ───────────────────────
  useEffect(() => {
    const sub = watch((values) => {
      try {
        const { website: _hp, ...safe } = values;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(safe));
      } catch {
        /* storage full / unavailable — non-fatal */
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  // Phone formatting as the user types.
  const phoneValue = watch("phone");
  useEffect(() => {
    const formatted = formatUsPhone(phoneValue ?? "");
    if (formatted !== phoneValue) {
      setValue("phone", formatted, { shouldValidate: false });
    }
  }, [phoneValue, setValue]);

  const callSlotId = watch("callSlotId");

  const focusErrorSummary = useCallback(() => {
    window.requestAnimationFrame(() => errorRef.current?.focus());
  }, []);

  async function next() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) {
      focusErrorSummary();
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function back() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data: ApplicationData) {
    if (submittedRef.current || submitting) return; // duplicate guard
    setSubmitting(true);
    // Shared id so the browser Pixel event and the server Conversions API
    // event are deduplicated by Meta into a single conversion.
    const metaEventId = newEventId();
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
          metaEventId,
        }),
      });

      const payload = (await res.json().catch(() => ({}))) as {
        applicationId?: string;
        eligible?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (res.status === 429) {
        toast({ type: "error", title: "Too many attempts", message: "Please wait a few minutes and try again." });
        return;
      }
      if (res.status === 400) {
        toast({ type: "error", title: "Please review your answers", message: payload.error ?? "Some fields need attention." });
        focusErrorSummary();
        return;
      }
      if (!res.ok) {
        toast({ type: "error", title: "Something went wrong", message: "Please try again shortly." });
        return;
      }

      // Success path
      submittedRef.current = true;
      localStorage.removeItem(DRAFT_KEY);

      if (payload.eligible === false) {
        setStatus("ineligible");
        return;
      }
      setApplicationId(payload.applicationId ?? "");
      setStatus("success");
      // Fire the Meta Pixel Subscribe event (browser side). The server fires
      // the matching Conversions API event with the same id for dedupe.
      trackSubscribe({ eventId: metaEventId });
      toast({ type: "success", title: "Application submitted" });
    } catch {
      toast({ type: "error", title: "Network error", message: "Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  // Flatten errors for the summary box (current step only).
  const stepErrors = STEP_FIELDS[step]
    .map((f) => errors[f]?.message)
    .filter(Boolean) as string[];

  if (status === "success") {
    return (
      <div className="glass-strong border-gradient p-6 sm:p-10">
        <SuccessState applicationId={applicationId} />
      </div>
    );
  }

  if (status === "ineligible") {
    return (
      <div className="glass-strong border-gradient p-6 sm:p-10">
        <IneligibleState
          waitlisted={waitlisted}
          onJoinWaitlist={() => {
            setWaitlisted(true);
            // TODO: POST to a waitlist endpoint / CRM here.
            toast({ type: "success", title: "Added to waitlist" });
          }}
        />
      </div>
    );
  }

  const isLast = step === STEP_LABELS.length - 1;

  return (
    <div className="glass-strong border-gradient p-5 sm:p-8">
      <Stepper steps={STEP_LABELS} current={step} />

      {/* Error summary */}
      <AnimatePresence>
        {stepErrors.length > 0 && (
          <motion.div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden rounded-xl border border-rose-400/30 bg-rose-500/10 outline-none"
          >
            <div className="flex gap-3 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <div>
                <p className="text-sm font-semibold text-rose-200">
                  Please fix the following before continuing:
                </p>
                <ul className="mt-1 list-inside list-disc text-xs text-rose-300/90">
                  {stepErrors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && <StepContact register={register} errors={errors} />}
              {step === 1 && <StepEligibility register={register} errors={errors} />}
              {step === 2 && <StepDocuments register={register} errors={errors} />}
              {step === 3 && (
                <StepCall
                  selected={callSlotId}
                  onSelect={(id) => setValue("callSlotId", id, { shouldValidate: true })}
                  error={errors.callSlotId?.message}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            magnetic={false}
            onClick={back}
            disabled={step === 0 || submitting}
            className={step === 0 ? "invisible" : ""}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {!isLast ? (
            <Button type="button" onClick={next}>
              Continue
            </Button>
          ) : (
            <Button type="submit" loading={submitting} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit application"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
