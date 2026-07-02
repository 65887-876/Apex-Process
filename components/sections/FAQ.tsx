"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { faq } from "@/lib/config";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Straight answers, <span className="text-gradient">no spin</span></>}
          description="If you're looking for guarantees, you won't find them here — and that's the point."
        />

        <Reveal>
          <ul className="mx-auto mt-12 max-w-3xl space-y-3">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="glass overflow-hidden">
                  <h3>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-base font-medium text-white">{item.q}</span>
                      <Plus
                        className={cn(
                          "h-5 w-5 shrink-0 text-cyan transition-transform duration-300",
                          isOpen && "rotate-45",
                        )}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
