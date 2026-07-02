import type { ApplicationData } from "./validation";
import { formOptions } from "./config";

/**
 * Hard gates — ineligible applicants see the declined screen (no waitlist).
 */
export type EligibilityReasonCode = "rejected";
export type RejectionKind = "credit" | "merchant" | "background" | "operational";

const BANK_STATEMENTS_YES = formOptions.bankStatements[0];

export type EligibilityOutcome = {
  eligible: boolean;
  reasonCode?: EligibilityReasonCode;
  rejectionKind?: RejectionKind;
  failedCriterion?: string;
};

const BELOW_600 = formOptions.creditRanges[0];

const BACKGROUND_CHECKS: {
  field: keyof Pick<
    ApplicationData,
    "bankruptcyLiens" | "convictedFelony" | "priorIboProgram" | "resellerInHousehold"
  >;
  label: string;
}[] = [
  { field: "bankruptcyLiens", label: "Bankruptcy / liens (5y)" },
  { field: "convictedFelony", label: "Convicted felony" },
  { field: "priorIboProgram", label: "Prior IBO program" },
  { field: "resellerInHousehold", label: "Reseller in household" },
];

function normalizeCredit(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u2013\u2014–—]/g, "-")
    .replace(/\s+/g, " ");
}

function hasPriorMerchantAccount(merchantAccount: string): boolean {
  return (
    merchantAccount === "Yes, but closed" ||
    merchantAccount === "Yes, currently active"
  );
}

export function evaluateEligibility(
  data: Pick<
    ApplicationData,
    | "creditRange"
    | "merchantAccount"
    | "bankruptcyLiens"
    | "convictedFelony"
    | "priorIboProgram"
    | "resellerInHousehold"
    | "bankStatements"
  >,
): EligibilityOutcome {
  const credit = normalizeCredit(data.creditRange);

  if (
    credit === normalizeCredit(BELOW_600) ||
    credit.includes("below 600")
  ) {
    return {
      eligible: false,
      reasonCode: "rejected",
      rejectionKind: "credit",
      failedCriterion: "Credit score below 600",
    };
  }

  if (hasPriorMerchantAccount(data.merchantAccount)) {
    return {
      eligible: false,
      reasonCode: "rejected",
      rejectionKind: "merchant",
      failedCriterion: "Prior merchant account",
    };
  }

  for (const check of BACKGROUND_CHECKS) {
    if (data[check.field] === "Yes") {
      return {
        eligible: false,
        reasonCode: "rejected",
        rejectionKind: "background",
        failedCriterion: check.label,
      };
    }
  }

  if (data.bankStatements !== BANK_STATEMENTS_YES) {
    return {
      eligible: false,
      reasonCode: "rejected",
      rejectionKind: "operational",
      failedCriterion: "3 months of bank statements (account active)",
    };
  }

  return { eligible: true };
}
