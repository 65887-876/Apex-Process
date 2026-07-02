"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Copy, FileSearch, FileText, Phone, ScrollText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const nextSteps = [
  { icon: CheckCircle2, label: "Application received", done: true },
  { icon: FileSearch, label: "Internal review", done: false },
  { icon: FileText, label: "Document request (if eligible)", done: false },
  { icon: Phone, label: "Discovery call", done: false },
  { icon: ScrollText, label: "Agreement & legal review", done: false },
];

export function SuccessState({
  applicationId,
  firstName,
}: {
  applicationId: string;
  firstName?: string;
}) {
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
      className="flex flex-col items-center py-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
      >
        <CheckCircle2 className="h-9 w-9" />
      </motion.div>

      <h3 className="text-2xl font-semibold text-ink-950 sm:text-3xl">
        Application received.
      </h3>
      <p className="mt-3 max-w-md text-slate-600">
        Welcome{firstName ? `, ${firstName}` : ""}. We&apos;ll review your file and reply within{" "}
        <strong className="font-semibold text-ink-950">48 hours</strong>. If approved, you&apos;ll
        get a calendar confirmation and next steps by email.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="font-mono text-lg tracking-wider text-emerald-700">
          {applicationId}
        </span>
        <button
          type="button"
          onClick={copyId}
          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-ink-950"
          aria-label="Copy reference number"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      {copied && (
        <p className="mt-2 text-xs text-emerald-600">Copied to clipboard</p>
      )}

      <ul className="mt-8 w-full max-w-sm space-y-2 text-left">
        {nextSteps.map((step) => (
          <li
            key={step.label}
            className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2.5 text-sm"
          >
            <step.icon
              className={
                step.done ? "h-4 w-4 text-emerald-600" : "h-4 w-4 text-slate-400"
              }
            />
            <span className={step.done ? "text-ink-950" : "text-slate-500"}>
              {step.label}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-md text-xs leading-relaxed text-slate-500">
        Submitting an application does not guarantee approval or any financial outcome.
      </p>
    </motion.div>
  );
}
