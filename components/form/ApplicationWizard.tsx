"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Stepper } from "./Stepper";
import { StepContact, StepQualification, StepSchedule } from "./steps";
import { SuccessState } from "./SuccessState";
import { IneligibleState } from "./IneligibleState";
import {
  applicationSchema,
  emptyApplication,
  type ApplicationData,
} from "@/lib/validation";
import { evaluateEligibility, type RejectionKind } from "@/lib/eligibility";
import { flags, formMeta } from "@/lib/config";
import { formatUsPhone, scrollToApply } from "@/lib/utils";
import { newEventId, trackSubscribe } from "@/lib/meta-pixel";

const DRAFT_KEY = "apex-application-draft-v4";

/** Only restore contact fields from draft — avoids stale qualification answers blocking progress. */
const DRAFT_RESTORE_KEYS: (keyof ApplicationData)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "state",
  "telegram",
  "referralSource",
];
const STEP_LABELS = [...formMeta.steps];

const STEP_FIELDS: FieldPath<ApplicationData>[][] = [
  ["firstName", "lastName", "email", "phone", "state", "telegram", "referralSource", "website"],
  [
    "creditRange",
    "incomeRange",
    "ageRange",
    "merchantAccount",
    "bankruptcyLiens",
    "convictedFelony",
    "priorIboProgram",
    "resellerInHousehold",
    "bankStatements",
    "dailyCommitment",
  ],
  ["callSlotId"],
];

type Status = "form" | "success" | "ineligible";

export function ApplicationWizard() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("form");
  const [applicationId, setApplicationId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rejectionKind, setRejectionKind] = useState<RejectionKind>("credit");
  const [failedCriterion, setFailedCriterion] = useState<string | undefined>();
  const [direction, setDirection] = useState(1);
  const submittedRef = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(0);
  const prevStatusRef = useRef<Status>("form");

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ApplicationData>;
      DRAFT_RESTORE_KEYS.forEach((k) => {
        if (parsed[k] !== undefined) {
          setValue(k, parsed[k] as never, { shouldValidate: false });
        }
      });
      toast({ type: "info", title: "Draft restored", message: "We saved your progress." });
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sub = watch((values) => {
      try {
        const { website: _hp, ...safe } = values;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(safe));
      } catch {
        /* non-fatal */
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const phoneValue = watch("phone");
  useEffect(() => {
    const formatted = formatUsPhone(phoneValue ?? "");
    if (formatted !== phoneValue) {
      setValue("phone", formatted, { shouldValidate: false });
    }
  }, [phoneValue, setValue]);

  useEffect(() => {
    const stepChanged = prevStepRef.current !== step;
    const statusChanged = prevStatusRef.current !== status;
    prevStepRef.current = step;
    prevStatusRef.current = status;

    if (stepChanged && step > 0) {
      scrollToApply();
    } else if (statusChanged && (status === "success" || status === "ineligible")) {
      scrollToApply();
    }
  }, [step, status]);

  const focusErrorSummary = useCallback(() => {
    window.requestAnimationFrame(() => errorRef.current?.focus());
  }, []);

  async function next() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) {
      focusErrorSummary();
      return;
    }

    if (step === 1 && flags.enableEligibilityGate) {
      const values = getValues();
      const outcome = evaluateEligibility(values);
      if (!outcome.eligible) {
        setRejectionKind(outcome.rejectionKind ?? "credit");
        setFailedCriterion(outcome.failedCriterion);
        setStatus("ineligible");
        return;
      }
    }

    setDirection(1);
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function back() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function startOver() {
    submittedRef.current = false;
    setRejectionKind("credit");
    setFailedCriterion(undefined);
    setStatus("form");
    setStep(0);
    reset(emptyApplication);
    localStorage.removeItem(DRAFT_KEY);
  }

  const onSubmit = useCallback(
    async (data: ApplicationData) => {
      if (submittedRef.current || submitting) return;
      setSubmitting(true);
      // Shared id so the browser Pixel event and the server Conversions API
      // event are deduplicated by Meta into a single conversion.
      const metaEventId = newEventId();
      try {
        const res = await fetch("/api/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, submittedAt: new Date().toISOString(), metaEventId }),
        });

        const payload = (await res.json().catch(() => ({}))) as {
          applicationId?: string;
          eligible?: boolean;
          error?: string;
        };

        if (res.status === 429) {
          toast({ type: "error", title: "Too many attempts", message: "Please wait a few minutes." });
          return;
        }
        if (res.status === 400) {
          toast({ type: "error", title: "Please review your answers", message: payload.error });
          focusErrorSummary();
          return;
        }
        if (!res.ok) {
          toast({ type: "error", title: "Something went wrong", message: "Please try again shortly." });
          return;
        }

        submittedRef.current = true;
        localStorage.removeItem(DRAFT_KEY);

        if (payload.eligible === false) {
          const live = evaluateEligibility(getValues());
          setRejectionKind(live.rejectionKind ?? "credit");
          setFailedCriterion(live.failedCriterion);
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
    },
    [focusErrorSummary, getValues, submitting, toast],
  );

  const handleCalendlyScheduled = useCallback(
    ({ uri, startTime }: { uri: string; startTime?: string }) => {
      if (submittedRef.current || submitting) return;
      setValue("callSlotId", uri, { shouldValidate: true });
      setValue("calendlyStartTime", startTime ?? "", { shouldValidate: false });
      const data = getValues();
      void onSubmit({
        ...data,
        callSlotId: uri,
        calendlyStartTime: startTime ?? "",
      });
    },
    [getValues, onSubmit, setValue, submitting],
  );

  const stepErrors = STEP_FIELDS[step]
    .map((f) => errors[f]?.message)
    .filter(Boolean) as string[];

  const firstName = watch("firstName");

  if (status === "success") {
    return (
      <div className="glass-strong border-gradient p-6 sm:p-10">
        <SuccessState applicationId={applicationId} firstName={firstName} />
      </div>
    );
  }

  if (status === "ineligible") {
    return (
      <div className="glass-strong border-gradient p-6 sm:p-10">
        <IneligibleState
          rejectionKind={rejectionKind}
          failedCriterion={failedCriterion}
          onStartOver={startOver}
        />
      </div>
    );
  }

  const isLast = step === STEP_LABELS.length - 1;

  return (
    <div className="glass-strong border-gradient p-5 sm:p-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500">
          Step {step + 1} of {STEP_LABELS.length} · {STEP_LABELS[step]}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="text-xs font-medium text-slate-500 transition-colors hover:text-ink-950"
          >
            ← Back
          </button>
        )}
      </div>

      <Stepper steps={STEP_LABELS} current={step} />

      <AnimatePresence>
        {stepErrors.length > 0 && (
          <motion.div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden rounded-xl border border-rose-200 bg-rose-50 outline-none"
          >
            <div className="flex gap-3 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
              <div>
                <p className="text-sm font-semibold text-rose-800">
                  Please fill in the highlighted fields
                </p>
                <ul className="mt-1 list-inside list-disc text-xs text-rose-700">
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
              {step === 1 && <StepQualification register={register} errors={errors} />}
              {step === 2 && (
                <StepSchedule
                  name={`${watch("firstName")} ${watch("lastName")}`.trim()}
                  email={watch("email")}
                  onScheduled={handleCalendlyScheduled}
                  error={errors.callSlotId?.message}
                  submitting={submitting}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {!isLast && (
          <div className="mt-8 flex justify-end">
            <Button type="button" onClick={next}>
              Continue →
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
