"use client";

import { motion } from "framer-motion";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  Circle,
  FileText,
  LayoutDashboard,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const checklist = [
  { label: "Government ID", done: true },
  { label: "Proof of address", done: true },
  { label: "Bank statements", done: false },
  { label: "Tax documents", done: false },
];

const notifications = [
  { label: "Initial review started", time: "2h ago", icon: ShieldCheck },
  { label: "Document request prepared", time: "1d ago", icon: FileText },
  { label: "Welcome to Apex Process", time: "2d ago", icon: Bell },
];

export function DashboardMockup() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Applicant Dashboard"
          title={<>Always know <span className="text-gradient">where you stand</span></>}
          description="A preview of the applicant view. Every stage, document, and call lives in one place — no email archaeology required."
        />

        <Reveal delay={0.1}>
          <div className="mt-14 [perspective:1600px]">
            <motion.div
              initial={{ rotateX: 10, opacity: 0 }}
              whileInView={{ rotateX: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong border-gradient overflow-hidden rounded-3xl shadow-panel"
            >
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <LayoutDashboard className="h-4 w-4 text-cyan" />
                  Application Console
                </div>
                <span className="font-mono text-xs text-slate-500">APX-2026-06-7Q4K</span>
              </div>

              <div className="grid gap-px bg-white/5 lg:grid-cols-3">
                {/* Left: status + progress */}
                <div className="space-y-4 bg-ink-900/70 p-5 lg:col-span-2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <p className="text-xs text-slate-400">Current stage</p>
                      <p className="mt-1 text-lg font-semibold text-white">Initial review</p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan to-violet" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <p className="text-xs text-slate-400">Upcoming call</p>
                      <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
                        <CalendarClock className="h-4 w-4 text-cyan" />
                        Not scheduled
                      </p>
                      <p className="mt-2 text-xs text-slate-500">Available after document review</p>
                    </div>
                  </div>

                  {/* Document checklist */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="mb-3 text-sm font-medium text-white">Document checklist</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {checklist.map((doc) => (
                        <li key={doc.label} className="flex items-center gap-2.5 text-sm">
                          {doc.done ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-600" />
                          )}
                          <span className={doc.done ? "text-slate-200" : "text-slate-500"}>
                            {doc.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Agreement package */}
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/15 text-violet-glow">
                        <ScrollText className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">Agreement package</p>
                        <p className="text-xs text-slate-500">Unlocks after discovery call</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                      Locked
                    </span>
                  </div>
                </div>

                {/* Right: notifications */}
                <div className="bg-ink-900/70 p-5">
                  <p className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                    <Bell className="h-4 w-4 text-cyan" />
                    Notifications
                  </p>
                  <ul className="space-y-3">
                    {notifications.map((n) => (
                      <li key={n.label} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300">
                          <n.icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-slate-200">{n.label}</p>
                          <p className="text-xs text-slate-500">{n.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/10 bg-ink-950/60 px-5 py-2.5 text-center text-[10px] uppercase tracking-widest text-slate-600">
                Visual mockup · not a live dashboard
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
