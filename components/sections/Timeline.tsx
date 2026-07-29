// components/sections/Timeline.tsx
'use client';

// Phase 3 — Visual Design.
// Phase 4 — Client Component. GSAP scroll reveal + Lenis parallax added.
// Background: bg-5.jpg (warm tone, alternates from Projects cool).
// Year blocks → GlassCard (4 items — within backdrop-filter cap).
//
// Status badge color coding (Design.md §5 accent palette, meaningfully applied):
//   done        → accent-400 (cyan)      — achieved/shipped
//   in-progress → secondary-400 (coral)  — active energy/warmth
//   planned     → primary-500 (violet)   — structured future
//   north-star  → text-gradient          — aspirational/rare
//
// Scroll-scrubbed progress line is deferred to Phase 5. Phase 4 just draws it in once.

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { timeline } from '@/data/timeline';
import { profile } from '@/data/profile';
import type { TimelineStatus } from '@/data/types';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { useScrollAnimation, useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';
import { useDeviceTier, RENDER_QUALITY } from '@/lib/hooks/useDeviceTier';

/* Status → label text + CSS classes (design-token colors only) */
const STATUS_CONFIG: Record<
  TimelineStatus,
  {
    label: string;
    ariaLabel: string;
    chipClass: string;
    dotClass: string;
    yearClass: string;
    isGradient: boolean;
  }
> = {
  'done': {
    label: 'Done',
    ariaLabel: 'Completed',
    chipClass: 'border-accent-500/50 text-accent-400 bg-accent-500/8',
    dotClass: 'bg-accent-400',
    yearClass: 'text-accent-400',
    isGradient: false,
  },
  'in-progress': {
    label: 'In Progress',
    ariaLabel: 'In progress',
    chipClass: 'border-secondary-500/50 text-secondary-400 bg-secondary-600/8',
    dotClass: 'bg-secondary-400',
    yearClass: 'text-secondary-400',
    isGradient: false,
  },
  'planned': {
    label: 'Planned',
    ariaLabel: 'Planned',
    chipClass: 'border-primary-500/50 text-primary-500 bg-primary-900/20',
    dotClass: 'bg-primary-500',
    yearClass: 'text-primary-500',
    isGradient: false,
  },
  'north-star': {
    label: 'North Star',
    ariaLabel: 'North-star goal',
    chipClass: 'border-white/20 bg-white/5',      /* gradient text handled separately */
    dotClass: 'bg-text-primary',
    yearClass: '',                                 /* text-gradient applied inline */
    isGradient: true,
  },
};

export default function Timeline() {
  const containerRef = useRef<HTMLElement>(null);
  const motionPreference = useMotionPreference();
  // Device tier — drives section background image quality.
  const deviceTier = useDeviceTier();
  const quality = RENDER_QUALITY[deviceTier];

  useScrollAnimation(containerRef, (ctx, el) => {
    // Reveal section heading
    gsap.fromTo(
      '.timeline-heading-reveal',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );

    // Stagger reveal timeline cards
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.timeline-track',
        start: 'top 80%',
      }
    });

    // Scroll-scrubbed progress line
    gsap.fromTo(
      '.timeline-line',
      { scaleY: 0 },
      { 
        scaleY: 1, 
        ease: 'none', 
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: '.timeline-track',
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 1,
        }
      }
    );

    // Reveal the dots and cards
    tl.fromTo(
      '.timeline-item-reveal',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15 }
    );

    // Highlight timeline dots as line reaches them
    const items = gsap.utils.toArray('.timeline-item-reveal') as HTMLElement[];
    items.forEach((item) => {
      const dot = item.querySelector('.timeline-dot');
      if (dot) {
        gsap.to(dot, {
          scale: 1.5,
          duration: 0.3,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            toggleActions: 'play reverse play reverse'
          }
        });
      }
    });

    // Reveal quote at bottom
    gsap.fromTo(
      '.timeline-quote-reveal',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.timeline-quote-reveal',
          start: 'top 90%',
        }
      }
    );

    // Parallax background (desktop only)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.to('[data-parallax-bg]', {
        y: '-20%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });
  });

  useReducedScrollReveal(containerRef);
  const fallbackRevealClass = motionPreference !== 'full' ? 'reveal-hidden' : '';

  return (
    <section
      ref={containerRef}
      id="timeline"
      aria-labelledby="timeline-heading"
      className="relative overflow-hidden"
    >
      {/* Background image — warm tone */}
      {/* Standard tier: quality 75 (unchanged). High tier: 85. */}
      <Image
        src="/images/bg/bg-5.webp"
        alt=""
        aria-hidden="true"
        fill
        quality={quality.imageQualitySection}
        className="object-cover object-center"
        sizes="100vw"
        data-parallax-bg
      />

      <div className="section-bg-overlay" aria-hidden="true" />

      <div className="section-content-layer section-py px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <div className={`timeline-heading-reveal ${fallbackRevealClass}`}>
            <SectionHeading
              number="04"
              label="Journey"
              heading="Roadmap"
              subheading="A public commitment to continuous learning and deliberate skill progression."
              id="timeline-heading"
            />
          </div>

          {/* Vertical timeline track */}
          <div className="relative pl-8">
            {/* The actual line — animated via GSAP scaleY */}
            <div
              className="timeline-line absolute left-0 top-0 bottom-0 w-px bg-white/12 origin-top"
              aria-hidden="true"
            />

            <ol
              aria-label="Journey timeline"
              className="timeline-track list-none m-0 p-0 space-y-6"
            >
              {timeline.map((entry) => {
                const cfg = STATUS_CONFIG[entry.status];

                return (
                  <li key={entry.year} className={`timeline-item-reveal relative ${fallbackRevealClass}`}>
                    {/* Track dot */}
                    <span
                      className={`timeline-dot ${cfg.dotClass}`}
                      aria-hidden="true"
                    />

                    <GlassCard
                      as="div"
                      className="flex flex-col gap-3"
                    >
                      {/* Year + status badge row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Year — color-coded per status */}
                        <span
                          className={[
                            'font-display text-2xl font-bold display-type',
                            cfg.isGradient ? 'text-gradient' : cfg.yearClass,
                          ].join(' ')}
                        >
                          {entry.year}
                        </span>

                        {/* Status badge */}
                        <span
                          className={[
                            'font-mono text-xs px-2.5 py-0.5 rounded-pill border',
                            cfg.chipClass,
                            cfg.isGradient ? 'text-gradient' : '',
                          ].join(' ')}
                          aria-label={cfg.ariaLabel}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      {/* Items */}
                      <ul className="space-y-2 list-none m-0 p-0">
                        {entry.items.map((item) => (
                          <li
                            key={item}
                            className="font-body text-sm text-text-secondary flex items-start gap-2 leading-relaxed"
                          >
                            <span
                              className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${cfg.dotClass} opacity-60`}
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Roadmap north-star quote */}
          <blockquote className={`timeline-quote-reveal mt-12 border-l-2 border-primary-500/40 pl-5 ${fallbackRevealClass}`}>
            <p className="font-mono text-sm text-text-secondary italic leading-relaxed">
              &ldquo;{profile.roadmapQuote}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
