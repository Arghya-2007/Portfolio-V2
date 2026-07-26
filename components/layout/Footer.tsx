// components/layout/Footer.tsx
// Phase 3 — Server Component. Glass-adjacent styling (no blur — footer is opaque).
// bg-bg-secondary with a subtle gradient top edge for section transition.
// Nav link hover: primary-500 accent color.
// Social link hover: accent-400.
// All content sourced from data/profile.ts.

import { profile } from '@/data/profile';

const FOOTER_NAV = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey',  href: '#timeline' },
  { label: 'Contact',  href: '#contact'  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="relative bg-bg-secondary"
      style={{
        /*
          Top gradient edge — blends from section backgrounds into the footer.
          Cannot express multi-bg stacking cleanly in Tailwind alone.
        */
        background: 'linear-gradient(to bottom, rgba(5,5,10,0) 0%, var(--bg-secondary) 60px)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      {/* Top separator — subtle glow line */}
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.4), rgba(56,189,248,0.3), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top row — name/logo + quick nav + socials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Name / identity */}
          <div>
            <a
              href="#hero"
              className="inline-block py-2 font-mono text-sm font-semibold hover:text-primary-500 transition-colors duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="arghya.dev — Back to top"
            >
              <span className="text-primary-500">arghya</span>
              <span className="text-text-muted">.dev</span>
            </a>
            <p className="font-body text-sm text-text-muted mt-2 max-w-xs leading-relaxed">
              {profile.whoAmI.role}
            </p>
          </div>

          {/* Quick nav */}
          <nav aria-label="Footer navigation">
            <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
              Navigate
            </p>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {FOOTER_NAV.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-block py-2 font-body text-sm text-text-secondary hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors duration-250"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social links */}
          <div>
            <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
              Connect
            </p>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {profile.socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-2 font-body text-sm text-text-secondary hover:text-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors duration-250"
                  >
                    {social.platform} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-white/8 mb-8" />

        {/* Footer quote + copyright + back-to-top */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-text-muted italic mb-1 leading-relaxed">
              {profile.footerQuote}
            </p>
            <p className="font-body text-xs text-text-muted">
              &copy; {year}{' '}
              <span className="text-text-secondary">{profile.name}</span>.
              All rights reserved.
            </p>
          </div>

          {/* Back to top */}
          <a
            href="#hero"
            aria-label="Back to top of page"
            className={[
              'font-mono text-xs text-text-muted',
              'px-4 py-2 rounded-pill border border-white/10',
              'hover:text-text-primary hover:border-white/25',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              'self-start sm:self-auto',
              'transition-all duration-250',
            ].join(' ')}
          >
            ↑ Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
