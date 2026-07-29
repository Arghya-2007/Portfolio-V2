// components/sections/Skills.tsx
// Phase 3 redesign — Two-Act Tech Stack Section.
//
// Act 1: SkillsMarquee — infinite dual-row logo strip (CSS animation).
// Act 2: SkillsHorizontalScroll — GSAP-pinned horizontal scroll with category cards.
//
// This component is the thin orchestrator:
//   - Owns the section wrapper + background image + overlay
//   - Renders SectionHeading (with existing stagger reveal)
//   - Delegates animation entirely to children
//
// Background: bg-3.webp (warm tone, alternating section rhythm).
// Performance: single backdrop-filter on the section level (children use GlassCard).
// Section number: 02 (confirmed).

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import SectionHeading from '@/components/ui/SectionHeading';
import { useDeviceTier, RENDER_QUALITY } from '@/lib/hooks/useDeviceTier';
import SkillsMarquee from './skills/SkillsMarquee';
import SkillsHorizontalScroll from './skills/SkillsHorizontalScroll';

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const deviceTier = useDeviceTier();
  const quality = RENDER_QUALITY[deviceTier];

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-heading"
      className="relative overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {/* Background image — warm tone (alternates from About's cool bg) */}
      <Image
        src="/images/bg/bg-3.webp"
        alt=""
        aria-hidden="true"
        fill
        quality={quality.imageQualitySection}
        className="object-cover object-center"
        sizes="100vw"
        data-parallax-bg
      />

      <div className="section-bg-overlay" aria-hidden="true" />

      {/* ── Section heading ─────────────────────────────────────── */}
      <div className="section-content-layer pt-16 md:pt-20 px-2 sm:px-4 lg:px-6 pb-0">
        <div className="max-w-7xl mx-auto relative">
          <div className="relative z-10">
            <SectionHeading
              number="02"
              label="Skills"
              heading="Tech Stack"
              subheading="What I build with — and what I'm actively growing into."
              id="skills-heading"
              className="!mb-0"
            />
          </div>
        </div>
      </div>

      {/* Decorative text block between heading and marquee */}
      <div className="w-full flex items-center justify-center my-0 md:my-2 overflow-hidden relative z-10">
        <span
          className="font-display font-bold uppercase select-none whitespace-nowrap premium-hover-text"
          aria-hidden="true"
          style={{
            fontSize: 'clamp(5rem, 12vw, 15rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
          }}
        >
          TECHNOLOGIES
        </span>
      </div>

      {/* ── Act 1: Marquee Strip (Continuous loop) ───────────────── */}
      <div className="relative z-20 mt-0 md:mt-4 mb-16 lg:mb-20">
        <SkillsMarquee />
      </div>

      {/* ── Act 2: Horizontal scroll category cards ──────────── */}
      {/*
        SkillsHorizontalScroll manages its own pin/scrub via GSAP ScrollTrigger.
        The parent section must NOT have overflow:hidden — only overflow-x:hidden
        set above — otherwise ScrollTrigger pin calculations break.
      */}
      <div className="section-content-layer w-full relative pt-6 pb-16">
        <SkillsHorizontalScroll />
      </div>

      {/* Bottom breathing room before next section */}
      <div className="section-content-layer h-16 md:h-24" aria-hidden="true" />
    </section>
  );
}
