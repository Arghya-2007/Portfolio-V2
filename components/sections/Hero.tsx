// components/sections/Hero.tsx
'use client';

// Phase 3 — Visual Design.
// Phase 4 — Client Component. GSAP entrance animations + Lenis parallax added.
// Background: bg-1.jpg (warm abstract render) with gradient overlay.
// next/image with priority (above-the-fold critical image).
// H1: fluid clamp size, display-type letter-spacing, text-gradient on name.
// CTAs: GlassButton (primary + secondary variants).

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { profile } from '@/data/profile';
import GlassButton from '@/components/ui/GlassButton';
import MagneticWrapper from '@/components/ui/MagneticWrapper';
import { useScrollAnimation, useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import { splitWords, revertSplit } from '@/lib/gsap/splitWords';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const motionPreference = useMotionPreference();

  // Handle GSAP entrance animation and parallax
  useScrollAnimation(containerRef, (ctx, el) => {
    const h1 = h1Ref.current;
    const tagline = taglineRef.current;

    if (!h1 || !tagline) return;

    // Split text into words
    const h1Words = splitWords(h1);
    const taglineWords = splitWords(tagline);

    const tl = gsap.timeline();

    // 1. Status badge fades in
    tl.fromTo(
      '.hero-status',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
    );

    // 2. H1 words stagger
    if (h1Words.length > 0) {
      tl.fromTo(
        h1Words,
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.06
        },
        '-=0.3'
      );
    }

    // 3. Tagline words stagger
    if (taglineWords.length > 0) {
      tl.fromTo(
        taglineWords,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.03
        },
        '-=0.5'
      );
    }

    // 4. One-liner, blockquote, CTAs, and scroll indicator fade up together
    tl.fromTo(
      '.hero-reveal-up',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1
      },
      '-=0.4'
    );

    // Parallax background (desktop only)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.to('[data-parallax-bg]', {
        y: '-25%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });

    // Cleanup split text on unmount
    return () => {
      revertSplit(h1);
      revertSplit(tagline);
    };
  });

  // Fallback for reduced motion
  useReducedScrollReveal(containerRef);

  // Helper class for fallback reveal logic
  const fallbackRevealClass = motionPreference !== 'full' ? 'reveal-hidden' : '';

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="Hero — introduction"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background image — priority loaded (above fold) */}
      <Image
        src="/images/bg/bg-2.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        quality={85}
        className="object-cover object-center"
        sizes="100vw"
        data-parallax-bg
      />

      {/* Gradient overlay — ensures WCAG AA contrast on all text */}
      <div className="section-bg-overlay" aria-hidden="true" />

      {/* Hero content — z-index above overlay */}
      <div className="section-content-layer w-full px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-4xl mx-auto">

          {/* Status badge — mono micro-copy */}
          <div className={`hero-status inline-flex items-center gap-2 mb-8 ${fallbackRevealClass}`}>
            <span
              className="block w-2 h-2 rounded-full bg-accent-400 animate-pulse"
              aria-hidden="true"
            />
            <p className="font-mono text-xs text-accent-400 uppercase tracking-widest">
              {profile.status}
            </p>
          </div>

          {/* H1 — single heading for entire site */}
          <h1
            ref={h1Ref}
            className={`font-display font-bold text-fluid-h1 display-type text-text-primary mb-4 ${fallbackRevealClass}`}
          >
            {/* Gradient accent on first name — the "energetic focal point" (Design.md §5) */}
            <span className="text-gradient">{profile.name.split(' ')[0]}</span>
            {' '}
            <span>{profile.name.split(' ').slice(1).join(' ')}</span>
          </h1>

          {/* Role tagline */}
          <p ref={taglineRef} className={`font-body text-xl sm:text-2xl text-text-secondary mb-5 max-w-2xl leading-display ${fallbackRevealClass}`}>
            {profile.whoAmI.role}
          </p>

          {/* Full tagline / one-liner */}
          <p className={`hero-reveal-up font-body text-fluid-body text-text-muted mb-10 max-w-xl leading-body ${fallbackRevealClass}`}>
            {profile.tagline}
          </p>

          {/* Belief pull-quote */}
          <blockquote className={`hero-reveal-up border-l-2 border-primary-500/40 pl-5 mb-12 max-w-lg ${fallbackRevealClass}`}>
            <p className="font-mono text-sm text-text-secondary italic leading-relaxed">
              &ldquo;{profile.belief}&rdquo;
            </p>
          </blockquote>

          {/* CTA row — GlassButton primary + secondary */}
          <div className={`hero-reveal-up flex flex-wrap gap-4 items-center ${fallbackRevealClass}`}>
            {/* Primary CTA */}
            <MagneticWrapper strength={20}>
              <GlassButton
                href="#projects"
                variant="primary"
                size="lg"
                aria-label="View Projects"
              >
                View Projects
                <span aria-hidden="true" className="ml-1">→</span>
              </GlassButton>
            </MagneticWrapper>

            {/*
              Secondary CTA — Resume or Contact fallback.
              resumeUrl is undefined per profile.ts; Contact shown as fallback.
            */}
            {profile.resumeUrl ? (
              <MagneticWrapper strength={20}>
                <GlassButton
                  href={profile.resumeUrl}
                  variant="secondary"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download resume (opens in new tab)"
                >
                  Resume ↗
                </GlassButton>
              </MagneticWrapper>
            ) : (
              <MagneticWrapper strength={20}>
                <GlassButton
                  href="#contact"
                  variant="secondary"
                  size="lg"
                  aria-label="Get in touch"
                >
                  Get in Touch
                </GlassButton>
              </MagneticWrapper>
            )}
          </div>

          {/* Scroll indicator — purely visual, aria-hidden */}
          <div className={`hero-reveal-up mt-16 flex items-center gap-3 ${fallbackRevealClass}`} aria-hidden="true">
            <div className="h-px w-8 bg-text-muted/40" />
            <p className="font-mono text-xs text-text-muted">scroll to explore</p>
          </div>
        </div>
      </div>
    </section>
  );
}
