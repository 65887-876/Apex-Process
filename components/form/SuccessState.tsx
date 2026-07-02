"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Copy, FileSearch, FileText, Phone, ScrollText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { timeline } from "@/lib/config";

const nextSteps = [
  { icon: CheckCircle2, label: "Application received", done: true },
  { icon: FileSearch, label: "Internal review", done: false },
  { icon: FileText, label: "Document request (if eligible)", done: false },
  { icon: Phone, label: "Discovery call", done: false },
  { icon: ScrollText, label: "Agreement & legal review", done: false },
];

export function SuccessState({ applicationId }: { applicationId: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      toast({ type: "success", title: "Reference copied" });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ type: "error", title: "Couldn't copy", message: "Please copy it manually." });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400"
      >
        <CheckCircle2 className="h-9 w-9" />
      </motion.div>

      <h3 className="text-2xl font-semibold text-white sm:text-3xl">Application received</h3>
      <p className="mt-3 max-w-md text-slate-400">
        Thank you. We&apos;ve received your application and will review it against
        our published criteria, typically within {timeline.reviewWindowHours} hours.
        Keep your reference number handy.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="font-mono text-lg tracking-wider text-cyan">
          {applicationId}
        </span>
        <button
          onClick={copyId}
          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Copy reference number"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      {copied && (
        <span className="mt-1 text-xs text-emerald-400">Copied to clipboard</span>
      )}

      <div className="mt-10 w-full max-w-md text-left">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
          What happens next
        </p>
        <ol className="space-y-3">
          {nextSteps.map((step, i) => (
            <motion.li
              key={step.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  step.done
                    ? "bg-emerald-400/15 text-emerald-400"
                    : "bg-white/5 text-slate-500"
                }`}
              >
                <step.icon className="h-4 w-4" />
              </span>
              <span className={step.done ? "text-white" : "text-slate-400"}>
                {step.label}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}
