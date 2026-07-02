"use client";

import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Field, Input, Select, Checkbox } from "@/components/ui/Field";
import { formOptions, callSlots, legal } from "@/lib/config";
import type { ApplicationData } from "@/lib/validation";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Reg = UseFormRegister<ApplicationData>;
type Errs = FieldErrors<ApplicationData>;

/* ── Step 1: Contact & location ─────────────────────────────────────────── */
export function StepContact({
  register,
  errors,
}: {
  register: Reg;
  errors: Errs;
}) {
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
      <Field label="Email" htmlFor="email" required error={errors.email?.message}>
        <Input id="email" type="email" inputMode="email" autoComplete="email"
          hasError={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Phone" htmlFor="phone" required error={errors.phone?.message}
        hint="US number — formatting is automatic.">
        <Input id="phone" type="tel" inputMode="tel" autoComplete="tel"
          placeholder="(555) 123-4567" hasError={!!errors.phone} {...register("phone")} />
      </Field>
      <Field label="State" htmlFor="state" required error={errors.state?.message}>
        <Select id="state" options={formOptions.states} hasError={!!errors.state}
          {...register("state")} />
      </Field>
      <Field label="Preferred contact method" htmlFor="preferredContact" required
        error={errors.preferredContact?.message}>
        <Select id="preferredContact" options={formOptions.contactMethods}
          hasError={!!errors.preferredContact} {...register("preferredContact")} />
      </Field>
      <Field label="How did you hear about us?" htmlFor="referralSource"
        className="sm:col-span-2" error={errors.referralSource?.message}>
        <Select id="referralSource" options={formOptions.referralSources}
          hasError={!!errors.referralSource} {...register("referralSource")} />
      </Field>

      {/* Honeypot — visually hidden, off-screen, not announced. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website (leave blank)</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off"
          {...register("website")} />
      </div>

      <p className="sm:col-span-2 flex items-start gap-2 text-xs leading-relaxed text-slate-400">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
        {legal.privacyNotice}
      </p>
    </div>
  );
}

/* ── Step 2: Eligibility profile ────────────────────────────────────────── */
export function StepEligibility({
  register,
  errors,
}: {
  register: Reg;
  errors: Errs;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Age range" htmlFor="ageRange" required error={errors.ageRange?.message}>
        <Select id="ageRange" options={formOptions.ageRanges} hasError={!!errors.ageRange}
          {...register("ageRange")} />
      </Field>
      <Field label="Approximate credit score" htmlFor="creditRange" required
        error={errors.creditRange?.message}>
        <Select id="creditRange" options={formOptions.creditRanges}
          hasError={!!errors.creditRange} {...register("creditRange")} />
      </Field>
      <Field label="Annual income range" htmlFor="incomeRange" required
        error={errors.incomeRange?.message}>
        <Select id="incomeRange" options={formOptions.incomeRanges}
          hasError={!!errors.incomeRange} {...register("incomeRange")} />
      </Field>
      <Field label="Business / merchant experience" htmlFor="experience" required
        error={errors.experience?.message}>
        <Select id="experience" options={formOptions.experienceLevels}
          hasError={!!errors.experience} {...register("experience")} />
      </Field>
      <Field label="Availability for review calls" htmlFor="callAvailability" required
        className="sm:col-span-2" error={errors.callAvailability?.message}>
        <Select id="callAvailability" options={formOptions.callAvailability}
          hasError={!!errors.callAvailability} {...register("callAvailability")} />
      </Field>

      <div className="sm:col-span-2 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <Checkbox label="I confirm I am a U.S. resident."
          error={errors.usResident?.message} {...register("usResident")} />
        <Checkbox label="I understand the information I provide must be accurate."
          error={errors.accurateInfo?.message} {...register("accurateInfo")} />
      </div>
    </div>
  );
}

/* ── Step 3: Documents readiness & consent ──────────────────────────────── */
export function StepDocuments({
  register,
  errors,
}: {
  register: Reg;
  errors: Errs;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-400">
        No documents are uploaded now. We only request these later, and only if
        your application is eligible.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Government ID ready?" htmlFor="idReady" error={errors.idReady?.message}>
          <Select id="idReady" options={formOptions.readiness} hasError={!!errors.idReady}
            {...register("idReady")} />
        </Field>
        <Field label="Proof of address ready?" htmlFor="addressReady"
          error={errors.addressReady?.message}>
          <Select id="addressReady" options={formOptions.readiness}
            hasError={!!errors.addressReady} {...register("addressReady")} />
        </Field>
        <Field label="Recent bank statements ready?" htmlFor="bankStatementsReady"
          error={errors.bankStatementsReady?.message}>
          <Select id="bankStatementsReady" options={formOptions.readiness}
            hasError={!!errors.bankStatementsReady} {...register("bankStatementsReady")} />
        </Field>
        <Field label="Tax documents ready?" htmlFor="taxDocsReady"
          error={errors.taxDocsReady?.message}>
          <Select id="taxDocsReady" options={formOptions.readiness}
            hasError={!!errors.taxDocsReady} {...register("taxDocsReady")} />
        </Field>
        <Field label="Business / entity documents ready? (if applicable)"
          htmlFor="entityDocsReady" className="sm:col-span-2"
          error={errors.entityDocsReady?.message}>
          <Select id="entityDocsReady" options={formOptions.readiness}
            hasError={!!errors.entityDocsReady} {...register("entityDocsReady")} />
        </Field>
      </div>

      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <Checkbox label="I consent to Apex Process reviewing my application."
          error={errors.consentReview?.message} {...register("consentReview")} />
        <Checkbox label="I have read and accept the Privacy Policy."
          error={errors.consentPrivacy?.message} {...register("consentPrivacy")} />
        <Checkbox
          label="I understand this is an application review, not a guarantee of approval or income."
          error={errors.acknowledgeNoGuarantee?.message}
          {...register("acknowledgeNoGuarantee")} />
      </div>
    </div>
  );
}

/* ── Step 4: Discovery call ─────────────────────────────────────────────── */
export function StepCall({
  selected,
  onSelect,
  error,
}: {
  selected: string;
  onSelect: (id: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-400">
          Choose a tentative discovery-call window. This is a placeholder
          scheduler — replace with a Calendly embed in production.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Discovery call time"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {callSlots.map((slot) => {
          const active = selected === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(slot.id)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-200",
                active
                  ? "border-cyan bg-cyan/10 text-white shadow-glow"
                  : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-cyan/40",
              )}
            >
              <span>{slot.label}</span>
              <span
                className={cn(
                  "h-4 w-4 rounded-full border-2 transition-colors",
                  active ? "border-cyan bg-cyan" : "border-white/20",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* TODO: replace the above with a configurable Calendly embed:
          <iframe src={process.env.NEXT_PUBLIC_CALENDLY_URL} ... /> */}

      {error && (
        <p role="alert" className="text-xs font-medium text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}
