"use client";

import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Lock } from "lucide-react";
import { Field, Input, Select } from "@/components/ui/Field";
import { formOptions } from "@/lib/config";
import type { ApplicationData } from "@/lib/validation";
import { CalendlyEmbed } from "@/components/form/CalendlyEmbed";

type Reg = UseFormRegister<ApplicationData>;
type Errs = FieldErrors<ApplicationData>;

function SectionBlock({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 text-xs font-semibold text-white">
          {number}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-950">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

/* ── Step 1: Contact ─────────────────────────────────────────────────────── */
export function StepContact({ register, errors }: { register: Reg; errors: Errs }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="First name" htmlFor="firstName" required error={errors.firstName?.message}>
        <Input id="firstName" autoComplete="given-name" hasError={!!errors.firstName}
          {...register("firstName")} />
      </Field>
      <Field label="Last name" htmlFor="lastName" required error={errors.lastName?.message}>
        <Input id="lastName" autoComplete="family-name" hasError={!!errors.lastName}
          {...register("lastName")} />
      </Field>
      <Field label="Email address" htmlFor="email" required error={errors.email?.message}>
        <Input id="email" type="email" inputMode="email" autoComplete="email"
          hasError={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Phone (US)" htmlFor="phone" required error={errors.phone?.message}>
        <Input id="phone" type="tel" inputMode="tel" autoComplete="tel"
          placeholder="(555) 123-4567" hasError={!!errors.phone} {...register("phone")} />
      </Field>
      <Field label="State" htmlFor="state" required error={errors.state?.message}>
        <Select id="state" options={formOptions.states} hasError={!!errors.state}
          {...register("state")} />
      </Field>
      <Field label="Telegram (optional)" htmlFor="telegram" error={errors.telegram?.message}
        hint="Your @username for quick updates.">
        <Input id="telegram" autoComplete="off" placeholder="@username"
          hasError={!!errors.telegram} {...register("telegram")} />
      </Field>
      <Field label="How did you hear about us?" htmlFor="referralSource" required
        className="sm:col-span-2" error={errors.referralSource?.message}>
        <Select id="referralSource" placeholder="Select source"
          options={formOptions.referralSources} hasError={!!errors.referralSource}
          {...register("referralSource")} />
      </Field>

      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website (do not fill)</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off"
          {...register("website")} />
      </div>

      <p className="sm:col-span-2 flex items-center gap-2 text-xs text-slate-500">
        <Lock className="h-3.5 w-3.5 shrink-0 text-cyan" aria-hidden />
        SSL · No SSN · No credit hit · ~60 sec
      </p>
    </div>
  );
}

/* ── Step 2: Qualification (11 questions) ────────────────────────────────── */
export function StepQualification({ register, errors }: { register: Reg; errors: Errs }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">Please answer all 11 questions to continue.</p>

      <SectionBlock number="1" title="Financial qualification">
        <Field label="Credit score" htmlFor="creditRange" required error={errors.creditRange?.message}>
          <Select id="creditRange" placeholder="Select credit score"
            options={formOptions.creditRanges} hasError={!!errors.creditRange}
            {...register("creditRange")} />
        </Field>
        <Field label="Annual income" htmlFor="incomeRange" required error={errors.incomeRange?.message}>
          <Select id="incomeRange" placeholder="Select income range"
            options={formOptions.incomeRanges} hasError={!!errors.incomeRange}
            {...register("incomeRange")} />
        </Field>
        <Field label="Age range" htmlFor="ageRange" required error={errors.ageRange?.message}>
          <Select id="ageRange" placeholder="Select age range"
            options={formOptions.ageRanges} hasError={!!errors.ageRange}
            {...register("ageRange")} />
        </Field>
        <Field label="Have you ever had a merchant account?" htmlFor="merchantAccount" required
          error={errors.merchantAccount?.message}>
          <Select id="merchantAccount" placeholder="Select an answer"
            options={formOptions.merchantAccount} hasError={!!errors.merchantAccount}
            {...register("merchantAccount")} />
        </Field>
      </SectionBlock>

      <SectionBlock number="2" title="Background check">
        <Field label="Bankruptcy / liens (5y)" htmlFor="bankruptcyLiens" required
          error={errors.bankruptcyLiens?.message}>
          <Select id="bankruptcyLiens" placeholder="Answer"
            options={formOptions.yesNo} hasError={!!errors.bankruptcyLiens}
            {...register("bankruptcyLiens")} />
        </Field>
        <Field label="Convicted felony" htmlFor="convictedFelony" required
          error={errors.convictedFelony?.message}>
          <Select id="convictedFelony" placeholder="Answer"
            options={formOptions.yesNo} hasError={!!errors.convictedFelony}
            {...register("convictedFelony")} />
        </Field>
        <Field label="Prior IBO program" htmlFor="priorIboProgram" required
          error={errors.priorIboProgram?.message}>
          <Select id="priorIboProgram" placeholder="Answer"
            options={formOptions.yesNo} hasError={!!errors.priorIboProgram}
            {...register("priorIboProgram")} />
        </Field>
        <Field label="Reseller in household" htmlFor="resellerInHousehold" required
          error={errors.resellerInHousehold?.message}>
          <Select id="resellerInHousehold" placeholder="Answer"
            options={formOptions.yesNo} hasError={!!errors.resellerInHousehold}
            {...register("resellerInHousehold")} />
        </Field>
      </SectionBlock>

      <SectionBlock number="3" title="Operational readiness">
        <Field label="3 months of bank statements (account active)" htmlFor="bankStatements" required
          error={errors.bankStatements?.message}>
          <Select id="bankStatements" placeholder="Select an answer"
            options={formOptions.bankStatements} hasError={!!errors.bankStatements}
            {...register("bankStatements")} />
        </Field>
        <Field label="Can you commit 1–2 hours per day?" htmlFor="dailyCommitment" required
          error={errors.dailyCommitment?.message}>
          <Select id="dailyCommitment" placeholder="Select an answer"
            options={formOptions.dailyCommitment} hasError={!!errors.dailyCommitment}
            {...register("dailyCommitment")} />
        </Field>
        <p className="sm:col-span-2 text-xs leading-relaxed text-slate-500">
          Mostly for paperwork review and bank notifications — never operational work.
        </p>
      </SectionBlock>

      <p className="flex items-center gap-2 text-xs text-slate-500">
        <Lock className="h-3.5 w-3.5 shrink-0 text-cyan" aria-hidden />
        Soft credit pull only — no impact on your score
      </p>
    </div>
  );
}

/* ── Step 3: Calendly ────────────────────────────────────────────────────── */
export function StepSchedule({
  name,
  email,
  onScheduled,
  error,
  submitting,
}: {
  name?: string;
  email?: string;
  onScheduled: (payload: { uri: string; startTime?: string }) => void;
  error?: string;
  submitting?: boolean;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        30-minute video call with our matching team.{" "}
        <strong className="font-medium text-ink-950">No sales pitch</strong> — we review your
        file together.{" "}
        <strong className="font-medium text-ink-950">
          Picking a time submits your application automatically.
        </strong>
      </p>
      <CalendlyEmbed
        name={name}
        email={email}
        onScheduled={onScheduled}
        error={error}
        scheduledMessage={
          submitting
            ? "Submitting your application…"
            : "Call booked — submitting your application…"
        }
      />
      <p className="flex items-center gap-2 text-xs text-slate-500">
        <Lock className="h-3.5 w-3.5 shrink-0 text-cyan" aria-hidden />
        Secured by Calendly · calendar invite sent automatically · cancel anytime
      </p>
    </div>
  );
}
