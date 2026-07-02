"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { valueProps } from "@/lib/config";
import { getIcon } from "@/components/ui/icons";

export function WhatYouGet() {
  return (
    <section id="program" className="relative py-24 sm:py-32">
      {/* Soft section glow */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" aria-hidden />

      <div className="container-px relative">
        <SectionHeading
          eyebrow="The Program"
          title={<>What you get with <span className="text-gradient">Apex Process</span></>}
          description="A complete onboarding workflow — not a promise of outcomes, but a dependable process you can actually follow."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.08}>
                <div className="group glass relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                  {/* hover sheen */}
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/15 to-violet/15 text-cyan ring-1 ring-white/10">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
