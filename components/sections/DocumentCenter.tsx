"use client";

import { Download, Eye, FileText, ShieldAlert } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { documents, legal } from "@/lib/config";

export function DocumentCenter() {
  return (
    <section id="documents" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Document Center"
          title={<>Sample <span className="text-gradient">document templates</span></>}
          description="Preview the kind of paperwork involved before you ever apply. These are illustrative samples — not final agreements."
        />

        {/* Disclaimer banner */}
        <Reveal>
          <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <p className="leading-relaxed">{legal.documentDisclaimer}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {documents.map((doc, i) => (
            <Reveal key={doc.id} delay={i * 0.08}>
              <div className="group glass flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/15 to-violet/15 text-cyan ring-1 ring-white/10">
                    <FileText className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-wider text-slate-400">
                    Sample · {doc.pages}pp
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">{doc.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                  {doc.description}
                </p>

                <div className="mt-6 flex gap-2">
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="secondary" size="sm" className="w-full" magnetic={false}>
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </a>
                  <a href={doc.file} download className="flex-1">
                    <Button variant="outline" size="sm" className="w-full" magnetic={false}>
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/*
          TODO: Place real branded sample PDFs in /public/pdfs with these names:
            - apex-sample-program-overview.pdf
            - apex-sample-agreement-template.pdf
            - apex-sample-compliance-disclosure.pdf
          Lightweight generated placeholders are included so Preview/Download work.
        */}
      </div>
    </section>
  );
}
