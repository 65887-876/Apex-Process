"use client";

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function IneligibleState({
  onJoinWaitlist,
  waitlisted,
}: {
  onJoinWaitlist: () => void;
  waitlisted: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sky-400/15 text-sky-400">
        <Clock3 className="h-9 w-9" />
      </div>

      <h3 className="text-2xl font-semibold text-white sm:text-3xl">
        Let&apos;s revisit this soon
      </h3>
      <p className="mt-3 max-w-md text-slate-400">
        Based on the information provided, now may not be the right time to move
        forward. This is common, and it isn&apos;t a reflection of you.
      </p>

      {waitlisted ? (
        <div className="mt-8 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
          You&apos;re on the waitlist. We&apos;ll reach out if a future window
          opens that fits your situation.
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button onClick={onJoinWaitlist}>Join the waitlist</Button>
          <p className="text-xs text-slate-500">
            No commitment — we&apos;ll simply keep your details on file for a
            future review.
          </p>
        </div>
      )}
    </motion.div>
  );
}
