import { eligibilityRules } from "./config";
import type { ApplicationData } from "./validation";

/**
 * Configurable, intentionally lenient eligibility evaluation.
 *
 * IMPORTANT: This is placeholder logic for demonstrating the waitlist UX.
 * Replace with your real, lawful, non-discriminatory criteria and have it
 * reviewed by counsel. Do NOT make eligibility decisions on protected
 * characteristics.
 */
export type EligibilityOutcome = {
  eligible: boolean;
  reasonCode?: "waitlist";
};

export function evaluateEligibility(
  data: Pick<ApplicationData, "creditRange" | "experience">,
): EligibilityOutcome {
  if (
    eligibilityRules.waitlistIfCreditBelow580AndNoExperience &&
    data.creditRange === "Below 580" &&
    data.experience === "None yet"
  ) {
    return { eligible: false, reasonCode: "waitlist" };
  }
  return { eligible: true };
}
