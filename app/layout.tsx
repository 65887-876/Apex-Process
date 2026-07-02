import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { brand } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const description =
  "Apex Process gives qualified applicants a structured, professionally reviewed business onboarding workflow — transparent documentation, a clear review timeline, and no upfront application fee.";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — Structured Business Onboarding`,
    template: `%s · ${brand.name}`,
  },
  description,
  applicationName: brand.name,
  keywords: [
    "business onboarding",
    "application review",
    "structured onboarding",
    "Apex Process",
  ],
  authors: [{ name: brand.name }],
  openGraph: {
    type: "website",
    title: `${brand.name} — Structured Business Onboarding`,
    description,
    siteName: brand.name,
    url: brand.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Structured Business Onboarding`,
    description,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-ink-950 font-sans"
        suppressHydrationWarning
      >
        <MetaPixel />
        <a
          href="#apply"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-cyan focus:px-4 focus:py-2 focus:font-medium focus:text-ink-950"
        >
          Skip to application
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
