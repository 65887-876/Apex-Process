"use client";

import { Film, Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { videos } from "@/lib/config";

function VideoCard({ video }: { video: (typeof videos)[number] }) {
  return (
    <Reveal>
      <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
        {/* Placeholder backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" aria-hidden />

        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-950/70 px-2.5 py-1 text-[11px] text-slate-300">
          <Film className="h-3 w-3 text-cyan" />
          Placeholder reel
        </div>
        <span className="absolute right-3 top-3 z-10 rounded-full bg-ink-950/70 px-2 py-0.5 text-[11px] font-medium text-slate-300">
          {video.duration}
        </span>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-slate-400 ring-1 ring-white/10">
            <Play className="ml-0.5 h-6 w-6" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink-950/90 to-transparent p-4 text-left">
          <p className="text-sm font-semibold text-white">{video.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">{video.role}</p>
        </div>
      </div>
    </Reveal>
  );
}

export function VideoGrid() {
  return (
    <section id="stories" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Client Stories"
          title={<>Real stories, <span className="text-gradient">coming soon</span></>}
          description="These are clearly labeled placeholders. Replace them with licensed or owned client-story videos before launch — see the README."
        />

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Placeholder testimonials shown for layout only. Do not present these as
          real endorsements.
        </p>
      </div>
    </section>
  );
}
