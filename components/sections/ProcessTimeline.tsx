"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/config";
import { cn } from "@/lib/utils";

export function ProcessTimeline() {
  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="The Process"
          title={<>Six clear stages, <span className="text-gradient">start to finish</span></>}
          description="No surprises. Each stage has a defined purpose and a clear handoff to the next."
        />

        <ol className="relative mt-16">
          {/* Center spine */}
          <div
            className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan/60 via-violet/40 to-transparent md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          {processSteps.map((step, i) => {
            const right = i % 2 === 1;
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative mb-8 flex items-start gap-5 pl-12 md:w-1/2 md:pl-0",
                  right
                    ? "md:ml-auto md:flex-row-reverse md:pl-12"
                    : "md:flex-row-reverse md:pr-12",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-cyan/40 bg-ink-900 font-mono text-sm font-semibold text-cyan",
                    "left-2 md:left-auto",
                    right ? "md:-left-[18px]" : "md:-right-[18px]",
                  )}
                >
                  {i + 1}
                </span>

                <div className="group w-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {step.body}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
