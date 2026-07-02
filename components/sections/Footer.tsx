import { brand, legal, nav } from "@/lib/config";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = 2026;

  return (
    <footer className="relative border-t border-white/10 bg-ink-950">
      <div className="container-px py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-semibold tracking-tight text-white">
                {brand.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {brand.tagline}
            </p>
            <a
              href={`mailto:${brand.contactEmail}`}
              className="mt-4 inline-block text-sm text-cyan hover:underline"
            >
              {brand.contactEmail}
            </a>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-400 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
            <ul className="mt-4 space-y-2.5">
              {nav.footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-400 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-300">Disclaimer. </span>
            {legal.footerDisclaimer}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {year} {legal.copyrightHolder}. All rights reserved.
          </p>
          <p className="text-slate-600">Sample content for demonstration — review with counsel before launch.</p>
        </div>
      </div>
    </footer>
  );
}
