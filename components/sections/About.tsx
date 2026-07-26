// components/sections/About.tsx
'use client';

// Phase 3 — Visual Design.
// Phase 4 — Client Component. GSAP scroll reveal + Lenis parallax added.
// Background: bg-1.jpg (cool tone, alternates with Hero warm).
// Stat items → GlassCard (4 cards — within backdrop-filter cap, Rules.md §4.1).
// SectionHeading replaces inline mono-label + h2 pattern.

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { profile } from '@/data/profile';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { useScrollAnimation, useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

function buildStats(p: typeof profile) {
  return [
    { label: 'Location', value: p.location },
    { label: 'Institute', value: p.institute },
    { label: 'Status', value: p.status },
    { label: 'Goal (2027)', value: p.whoAmI.goalBy2027 },
  ] as const;
}

export default function About() {
  const stats = buildStats(profile);
  const containerRef = useRef<HTMLElement>(null);
  const motionPreference = useMotionPreference();

  useScrollAnimation(containerRef, (ctx, el) => {
    // Reveal section heading
    gsap.fromTo(
      '.about-heading-reveal',
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

    // Stagger reveal bio paragraphs
    gsap.fromTo(
      '.about-bio-reveal',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.about-bio-reveal', // trigger on the first bio element
          start: 'top 85%',
        }
      }
    );

    // Stagger reveal stat cards
    gsap.fromTo(
      '.about-stat-reveal',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.about-stat-container',
          start: 'top 85%',
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
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden"
    >
      {/* Background image — cool tone (alternates with Hero warm) */}
      <Image
        src="/images/bg/bg-1.webp"
        alt=""
        aria-hidden="true"
        fill
        quality={75}
        className="object-cover object-center"
        sizes="100vw"
        data-parallax-bg
      />

      {/* Section overlay */}
      <div className="section-bg-overlay" aria-hidden="true" />

      {/* Content */}
      <div className="section-content-layer section-py px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className={`about-heading-reveal ${fallbackRevealClass}`}>
            <SectionHeading
              number="01"
              label="About"
              heading="Who Am I"
              id="about-heading"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Bio block */}
            <div className="space-y-6">
              {/* Role */}
              <p className={`about-bio-reveal font-body text-fluid-body text-text-secondary leading-body ${fallbackRevealClass}`}>
                <span className="font-semibold text-text-primary">
                  {profile.whoAmI.role}
                </span>
                {' '}based in{' '}
                <span className="text-accent-400">{profile.location}</span>.
              </p>

              {/* Currently Building */}
              <div className={`about-bio-reveal ${fallbackRevealClass}`}>
                <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">
                  Currently Building
                </p>
                <ul className="space-y-2 list-none m-0 p-0">
                  {profile.whoAmI.building.map((item) => (
                    <li
                      key={item}
                      className="font-body text-sm text-text-secondary flex items-start gap-2"
                    >
                      <span className="text-primary-500 mt-0.5 shrink-0" aria-hidden="true">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Currently Learning */}
              <div className={`about-bio-reveal ${fallbackRevealClass}`}>
                <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">
                  Currently Learning
                </p>
                <ul className="space-y-2 list-none m-0 p-0">
                  {profile.whoAmI.learning.map((item) => (
                    <li
                      key={item}
                      className="font-body text-sm text-text-secondary flex items-start gap-2"
                    >
                      <span className="text-secondary-400 mt-0.5 shrink-0" aria-hidden="true">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Belief pull-quote */}
              <blockquote className={`about-bio-reveal border-l-2 border-primary-500/40 pl-5 mt-4 ${fallbackRevealClass}`}>
                <p className="font-mono text-sm text-text-secondary italic leading-relaxed">
                  &ldquo;{profile.belief}&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Stat cards — GlassCard frosted panel (Design.md §4) */}
            <div className="about-stat-container">
              <p className={`about-stat-reveal font-mono text-xs text-text-muted uppercase tracking-widest mb-5 ${fallbackRevealClass}`}>
                At a Glance
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map(({ label, value }) => (
                  <GlassCard
                    key={label}
                    as="div"
                    className={`about-stat-reveal hover:border-white/20 hover:shadow-glow-primary/10 transition-all duration-250 ${fallbackRevealClass}`}
                  >
                    <dt className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
                      {label}
                    </dt>
                    <dd className="font-body text-sm text-text-primary font-medium leading-snug">
                      {value}
                    </dd>
                  </GlassCard>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
