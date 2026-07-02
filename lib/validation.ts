import { z } from "zod";
import { formOptions } from "./config";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Apex Process — Validation Schemas (Zod)
 * ─────────────────────────────────────────────────────────────────────────
 * Used on BOTH the client (React Hook Form resolver) and the server
 * (app/api/apply/route.ts). Enums are derived from lib/config.ts so options
 * and validation never drift apart.
 */

// Helper: build a Zod enum from a readonly string tuple in config.
const asEnum = <T extends readonly [string, ...string[]]>(arr: T) =>
  z.enum(arr);

const states = asEnum(formOptions.states as unknown as [string, ...string[]]);
const contactMethods = asEnum(
  formOptions.contactMethods as unknown as [string, ...string[]],
);
const referralSources = asEnum(
  formOptions.referralSources as unknown as [string, ...string[]],
);
const ageRanges = asEnum(
  formOptions.ageRanges as unknown as [string, ...string[]],
);
const creditRanges = asEnum(
  formOptions.creditRanges as unknown as [string, ...string[]],
);
const incomeRanges = asEnum(
  formOptions.incomeRanges as unknown as [string, ...string[]],
);
const experienceLevels = asEnum(
  formOptions.experienceLevels as unknown as [string, ...string[]],
);
const callAvailability = asEnum(
  formOptions.callAvailability as unknown as [string, ...string[]],
);
const readiness = asEnum(
  formOptions.readiness as unknown as [string, ...string[]],
);

const freeText = (max = 120) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    // Reject obvious markup / injection attempts in free-text.
    .refine((v) => !/[<>]/.test(v), "Please remove < and > characters.");

const requiredTrue = (msg: string) =>
  z.boolean().refine((v) => v === true, { message: msg });

// US phone: accepts formatted or raw, validates 10 digits (optionally +1).
const usPhone = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, "").replace(/^1(?=\d{10})/, ""))
  .refine((v) => v.length === 10, "Enter a valid 10-digit US phone number.");

// ── Step 1: Contact & location ──────────────────────────────────────────
export const step1Schema = z.object({
  firstName: freeText(60).pipe(z.string().min(1, "First name is required.")),
  lastName: freeText(60).pipe(z.string().min(1, "Last name is required.")),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  phone: usPhone,
  state: states,
  preferredContact: contactMethods,
  referralSource: referralSources,
  // Honeypot — must stay empty. Real users never see this field.
  website: z.string().max(0).optional().default(""),
});

// ── Step 2: Eligibility profile ─────────────────────────────────────────
export const step2Schema = z.object({
  ageRange: ageRanges,
  creditRange: creditRanges,
  incomeRange: incomeRanges,
  experience: experienceLevels,
  callAvailability: callAvailability,
  usResident: requiredTrue("You must confirm U.S. residency to continue."),
  accurateInfo: requiredTrue(
    "Please acknowledge that your information is accurate.",
  ),
});

// ── Step 3: Documents readiness & consent ───────────────────────────────
export const step3Schema = z.object({
  idReady: readiness,
  addressReady: readiness,
  bankStatementsReady: readiness,
  taxDocsReady: readiness,
  entityDocsReady: readiness,
  consentReview: requiredTrue("Consent to application review is required."),
  consentPrivacy: requiredTrue("You must accept the privacy policy."),
  acknowledgeNoGuarantee: requiredTrue(
    "Please acknowledge this is a review, not a guarantee.",
  ),
});

// ── Step 4: Discovery call ──────────────────────────────────────────────
export const step4Schema = z.object({
  callSlotId: z.string().min(1, "Please select a call time."),
});

// ── Full application (server-authoritative) ─────────────────────────────
export const applicationSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .extend({
    // Client-generated timestamp; informational only.
    submittedAt: z.string().datetime().optional(),
  });

export type Step1 = z.infer<typeof step1Schema>;
export type Step2 = z.infer<typeof step2Schema>;
export type Step3 = z.infer<typeof step3Schema>;
export type Step4 = z.infer<typeof step4Schema>;
export type ApplicationData = z.infer<typeof applicationSchema>;

/** Default empty values for the wizard / draft restore. */
export const emptyApplication: ApplicationData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  state: formOptions.states[0],
  preferredContact: formOptions.contactMethods[0],
  referralSource: formOptions.referralSources[0],
  website: "",
  ageRange: formOptions.ageRanges[0],
  creditRange: formOptions.creditRanges[0],
  incomeRange: formOptions.incomeRanges[0],
  experience: formOptions.experienceLevels[0],
  callAvailability: formOptions.callAvailability[0],
  usResident: false,
  accurateInfo: false,
  idReady: formOptions.readiness[0],
  addressReady: formOptions.readiness[0],
  bankStatementsReady: formOptions.readiness[0],
  taxDocsReady: formOptions.readiness[0],
  entityDocsReady: formOptions.readiness[0],
  consentReview: false,
  consentPrivacy: false,
  acknowledgeNoGuarantee: false,
  callSlotId: "",
} as ApplicationData;
