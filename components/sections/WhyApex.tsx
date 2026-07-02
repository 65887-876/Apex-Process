"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { whyApex, socialProof } from "@/lib/config";
import { getIcon } from "@/components/ui/icons";

export function WhyApex() {
  return (
    <section id="why" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Why Apex"
          title={<>Why a <span className="text-gradient">structured review</span> matters</>}
          description="Most onboarding falls apart in the gaps between steps. We built Apex Process around documentation, consent, and transparency — so nothing important slips through."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {whyApex.map((pillar, i) => {
            const Icon = getIcon(pillar.icon);
            return (
              <Reveal key={pillar.title} delay={i * 0.08}>
                <TiltCard className="h-full">
                  <div className="flex h-full flex-col">
                    <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 text-cyan ring-1 ring-cyan/20">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {pillar.body}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {/* Stats strip */}
        <Reveal delay={0.1}>
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-4">
            {socialProof.stats.map((stat) => {
              const Icon = getIcon(stat.icon);
              return (
                <div key={stat.label} className="bg-ink-900/60 px-6 py-8 text-center">
                  <Icon className="mx-auto mb-3 h-5 w-5 text-cyan" />
                  <p className="text-3xl font-semibold text-gradient-cyan sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-slate-600">{socialProof.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
