import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { WhyApex } from "@/components/sections/WhyApex";
import { WhatYouGet } from "@/components/sections/WhatYouGet";
import { DashboardMockup } from "@/components/sections/DashboardMockup";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { VideoGrid } from "@/components/sections/VideoGrid";
import { DocumentCenter } from "@/components/sections/DocumentCenter";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyApex />
        <WhatYouGet />
        <DashboardMockup />
        <ProcessTimeline />
        <VideoGrid />
        <DocumentCenter />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
