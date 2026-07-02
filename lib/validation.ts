import { z } from "zod";
import { formOptions } from "./config";

const asEnum = <T extends readonly [string, ...string[]]>(arr: T) => z.enum(arr);

const states = asEnum(formOptions.states as unknown as [string, ...string[]]);
const referralSources = asEnum(
  formOptions.referralSources as unknown as [string, ...string[]],
);
const creditRanges = asEnum(
  formOptions.creditRanges as unknown as [string, ...string[]],
);
const incomeRanges = asEnum(
  formOptions.incomeRanges as unknown as [string, ...string[]],
);
const ageRanges = asEnum(formOptions.ageRanges as unknown as [string, ...string[]]);
const merchantAccount = asEnum(
  formOptions.merchantAccount as unknown as [string, ...string[]],
);
const yesNo = asEnum(formOptions.yesNo as unknown as [string, ...string[]]);
const bankStatements = asEnum(
  formOptions.bankStatements as unknown as [string, ...string[]],
);
const dailyCommitment = asEnum(
  formOptions.dailyCommitment as unknown as [string, ...string[]],
);

const freeText = (max = 120) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .refine((v) => !/[<>]/.test(v), "Please remove < and > characters.");

const pick = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string,
) => z.string().min(1, message).pipe(z.enum(values));

const usPhone = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, "").replace(/^1(?=\d{10})/, ""))
  .refine((v) => v.length === 10, "Enter a valid 10-digit US phone number.");

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
  telegram: freeText(64).optional().default(""),
  referralSource: pick(
    formOptions.referralSources as unknown as [string, ...string[]],
    "Please select how you heard about us.",
  ),
  website: z.string().max(0).optional().default(""),
});

export const step2Schema = z.object({
  creditRange: pick(formOptions.creditRanges as unknown as [string, ...string[]], "Please select credit score."),
  incomeRange: pick(formOptions.incomeRanges as unknown as [string, ...string[]], "Please select income range."),
  ageRange: pick(formOptions.ageRanges as unknown as [string, ...string[]], "Please select age range."),
  merchantAccount: pick(
    formOptions.merchantAccount as unknown as [string, ...string[]],
    "Please select an answer.",
  ),
  bankruptcyLiens: pick(formOptions.yesNo as unknown as [string, ...string[]], "Please select an answer."),
  convictedFelony: pick(formOptions.yesNo as unknown as [string, ...string[]], "Please select an answer."),
  priorIboProgram: pick(formOptions.yesNo as unknown as [string, ...string[]], "Please select an answer."),
  resellerInHousehold: pick(formOptions.yesNo as unknown as [string, ...string[]], "Please select an answer."),
  bankStatements: pick(
    formOptions.bankStatements as unknown as [string, ...string[]],
    "Please select an answer.",
  ),
  dailyCommitment: pick(
    formOptions.dailyCommitment as unknown as [string, ...string[]],
    "Please select an answer.",
  ),
});

export const step3Schema = z.object({
  callSlotId: z.string().min(1, "Please pick a discovery call slot in Calendly."),
  calendlyStartTime: z.string().optional().default(""),
});

export const applicationSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .extend({
    submittedAt: z.string().datetime().optional(),
  });

export type ApplicationData = z.infer<typeof applicationSchema>;

export const emptyApplication = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  state: formOptions.states[0],
  telegram: "",
  referralSource: "",
  website: "",
  creditRange: "",
  incomeRange: "",
  ageRange: "",
  merchantAccount: "",
  bankruptcyLiens: "",
  convictedFelony: "",
  priorIboProgram: "",
  resellerInHousehold: "",
  bankStatements: "",
  dailyCommitment: "",
  callSlotId: "",
  calendlyStartTime: "",
} as ApplicationData;
