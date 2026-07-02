"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { RejectionKind } from "@/lib/eligibility";

export function IneligibleState({
  rejectionKind = "credit",
  failedCriterion,
  onStartOver,
}: {
  rejectionKind?: RejectionKind;
  failedCriterion?: string;
  onStartOver: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center py-4 text-center"
    >
      <p className="text-xs font-medium text-slate-500">Step 2 of 3 · Application declined</p>

      <h3 className="mt-4 text-2xl font-semibold text-ink-950 sm:text-3xl">
        Application not accepted.
      </h3>

      {rejectionKind === "merchant" ? (
        <p className="mt-3 max-w-md text-slate-600">
          This program is only available to applicants who have{" "}
          <strong className="font-semibold text-ink-950">never held a merchant account</strong>.
          Based on your answer, we cannot move forward with your application at this time.
        </p>
      ) : rejectionKind === "operational" ? (
        <p className="mt-3 max-w-md text-slate-600">
          An{" "}
          <strong className="font-semibold text-ink-950">
            active bank account with at least 3 months of statements
          </strong>{" "}
          is required. Based on your answer, we cannot move forward with your application at this
          time.
        </p>
      ) : rejectionKind === "background" ? (
        <p className="mt-3 max-w-md text-slate-600">
          Based on your background check answers, we cannot move forward with your application at
          this time.
          {failedCriterion && (
            <>
              {" "}
              Flagged item:{" "}
              <strong className="font-semibold text-ink-950">{failedCriterion}</strong>.
            </>
          )}
        </p>
      ) : (
        <p className="mt-3 max-w-md text-slate-600">
          A minimum credit score of{" "}
          <strong className="font-semibold text-ink-950">600</strong> is required to proceed.
          Based on your answer, we cannot move forward with your application at this time.
        </p>
      )}

      <div className="mt-8">
        <Button variant="ghost" magnetic={false} onClick={onStartOver}>
          Start over
        </Button>
      </div>
    </motion.div>
  );
}
