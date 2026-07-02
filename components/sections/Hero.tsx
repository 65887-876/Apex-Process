"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { brand, cta, trustBadges, timeline } from "@/lib/config";
import { ApplicationWizard } from "@/components/form/ApplicationWizard";

const badgeIcons: Record<string, typeof ShieldCheck> = {
  shield: ShieldCheck,
  lock: Lock,
  fileCheck: FileCheck2,
  scale: Scale,
};

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-mesh pt-16 sm:pt-20">
      {/* Faint grid backdrop, masked to a soft ellipse */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="container-px relative grid items-center gap-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
        {/* ── Left: copy + CTAs ─────────────────────────────────────────── */}
        <div className="flex flex-col items-start">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-cyan" />
            Business onboarding, done right
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            A <span className="text-gradient">structured path</span> from
            application to agreement.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400"
          >
            <span className="font-medium text-slate-200">{brand.name}</span> gives
            qualified applicants a clear, professionally reviewed onboarding
            process — transparent documentation, a published{" "}
            {timeline.reviewWindowHours}-hour review target, and no upfront
            application fee.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a href="#apply">
              <Button variant="cta" size="md">
                {cta.primary}
              </Button>
            </a>
            <a href="#process">
              <Button variant="secondary" size="md">
                {cta.secondary}
              </Button>
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2"
          >
            {trustBadges.map((badge) => {
              const Icon = badgeIcons[badge.icon] ?? ShieldCheck;
              return (
                <li
                  key={badge.label}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-300"
                >
                  <Icon className="h-4 w-4 shrink-0 text-cyan" />
                  {badge.label}
                </li>
              );
            })}
          </motion.ul>
        </div>

        {/* ── Right: application form ───────────────────────────────────── */}
        <motion.div
          id="apply"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative scroll-mt-24"
        >
          <div className="mb-4">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-cyan" />
              {cta.formStart}
            </span>
          </div>
          <ApplicationWizard />
        </motion.div>
      </div>
    </section>
  );
}
