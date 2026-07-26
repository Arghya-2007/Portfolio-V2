'use client';

// components/layout/Navbar.tsx
// Phase 3 — Visual Design.
// Phase 4 — Client Component. GSAP scroll condensation added.
// Floating island pattern.
// Fixed position, high z-index to overlay all content.
// Condenses its padding and background blur on scroll.

import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import GlassButton from '../ui/GlassButton';
import MagneticWrapper from '../ui/MagneticWrapper';
import { useScrollAnimation } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

const NAV_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey',  href: '#timeline' },
  { label: 'Contact',  href: '#contact'  },
] as const;

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const motionPreference = useMotionPreference();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useScrollAnimation(navRef, (ctx, el) => {
    // Only animate padding/blur if full motion is allowed
    if (motionPreference !== 'full') return;

    gsap.to(el, {
      scrollTrigger: {
        trigger: document.body,
        start: 'top -50',
        end: 'top -51', // trigger point
        onEnter: () => setIsScrolled(true),
        onLeaveBack: () => setIsScrolled(false),
      }
    });
  });

  return (
    /* Outer strip — full-width, fixed, provides the z-index layer */
    <header 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-out pointer-events-none ${
        isScrolled ? 'pt-2 sm:pt-4' : 'pt-4 sm:pt-8'
      }`}
    >
      {/*
        Inner pill — the actual liquid-glass bar.
        pointer-events-auto re-enables interaction on the pill itself
        (the outer header is pointer-events-none so it doesn't block scroll
        on content underneath the transparent edges).
      */}
      <nav
        role="navigation"
        aria-label="Primary navigation"
        className={`glass-liquid pointer-events-auto w-full max-w-3xl flex items-center justify-between transition-all duration-300 ease-out rounded-2xl border ${
          isScrolled
            ? 'px-5 py-2 bg-bg-primary/70 border-white/10'
            : 'px-5 py-3 bg-bg-primary/50 border-white/5'
        }`}
      >
        {/* Logo / name */}
        <Link
          href="#hero"
          className="font-mono text-sm font-semibold text-text-primary hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:rounded-sm transition-colors duration-250"
          aria-label="arghya.dev — back to top"
        >
          <span className="text-primary-500">arghya</span>
          <span className="text-text-muted">.dev</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <MagneticWrapper strength={10}>
                <a
                  href={href}
                  className={[
                    'font-body text-sm text-text-secondary',
                    'px-4 py-2 rounded-pill',
                    'hover:text-text-primary hover:bg-white/8',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    'transition-all duration-250',
                  ].join(' ')}
                >
                  {label}
                </a>
              </MagneticWrapper>
            </li>
          ))}
        </ul>

        {/* Contact CTA — desktop */}
        <MagneticWrapper strength={10} className="hidden md:inline-flex">
          <GlassButton
            href="#contact"
            size="sm"
          >
            Hire me
          </GlassButton>
        </MagneticWrapper>

        {/* Mobile hamburger button */}
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          {/* Animated hamburger bars — CSS-only state change in Phase 3 */}
          <span
            className={`block w-5 h-0.5 bg-text-primary transition-all duration-250 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            aria-hidden="true"
          />
          <span
            className={`block w-5 h-0.5 bg-text-primary transition-all duration-250 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}
            aria-hidden="true"
          />
          <span
            className={`block w-5 h-0.5 bg-text-primary transition-all duration-250 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            aria-hidden="true"
          />
        </button>
      </nav>

      {/* Mobile nav menu — frosted panel (large surface → NOT liquid glass) */}
      {menuOpen && (
        <div
          id="mobile-nav-menu"
          role="menu"
          className={[
            'md:hidden',
            'absolute top-[4.5rem] left-4 right-4',
            /* Frosted panel — not liquid glass (large surface, Design.md §4 rule) */
            'glass-frosted',
            'pointer-events-auto',
            'overflow-hidden',
          ].join(' ')}
        >
          <ul className="flex flex-col list-none m-0 p-2">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href} role="none">
                <a
                  href={href}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className={[
                    'block px-4 py-3',
                    'font-body text-sm text-text-secondary',
                    'hover:text-text-primary hover:bg-white/5',
                    'rounded-lg',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                    'transition-all duration-250',
                  ].join(' ')}
                >
                  {label}
                </a>
              </li>
            ))}
            <li role="none" className="pt-2 pb-1 px-1 border-t border-white/10 mt-1">
              <GlassButton
                href="#contact"
                role="menuitem"
                size="md"
                className="w-full flex"
                onClick={() => setMenuOpen(false)}
              >
                Hire me
              </GlassButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
