// components/sections/Skills.tsx
'use client';

// Phase 3 — Visual Design.
// Phase 4 — Client Component. GSAP scroll reveal + Lenis parallax added.
// Background: bg-3.jpg (warm tone, alternates from About cool).
//
// Performance rule (Rules.md §4.1): single blurred container per category group,
// NOT blur-per-chip. Chips inside GlassCard are plain styled elements.
// 6 GlassCards rendered — acceptable since they span full page scroll height
// so never more than ~2-3 are simultaneously visible in a typical viewport.
//
// Acquiring category: dashed border style + secondary-400 accent badge.

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { skills } from '@/data/skills';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { useScrollAnimation, useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null);
  const motionPreference = useMotionPreference();

  useScrollAnimation(containerRef, (ctx, el) => {
    // Reveal section heading
    gsap.fromTo(
      '.skills-heading-reveal',
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

    // Stagger reveal category cards
    const cards = gsap.utils.toArray('.skills-card-reveal') as HTMLElement[];
    cards.forEach((card) => {
      // Create a timeline for each card so its children (chips) can stagger relative to it
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        }
      });

      tl.fromTo(
        card,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }
      );

      // Stagger the chips inside this specific card
      const chips = card.querySelectorAll('.skill-chip-reveal');
      if (chips.length > 0) {
        tl.fromTo(
          chips,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.03 },
          '-=0.5' // Start slightly before the card finishes entering
        );
      }
    });

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
      id="skills"
      aria-labelledby="skills-heading"
      className="relative overflow-hidden"
    >
      {/* Background image — warm tone */}
      <Image
        src="/images/bg/bg-3.webp"
        alt=""
        aria-hidden="true"
        fill
        quality={75}
        className="object-cover object-center"
        sizes="100vw"
        data-parallax-bg
      />

      <div className="section-bg-overlay" aria-hidden="true" />

      <div className="section-content-layer section-py px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className={`skills-heading-reveal ${fallbackRevealClass}`}>
            <SectionHeading
              number="02"
              label="Skills"
              heading="Tech Stack"
              subheading="What I build with — and what I'm actively growing into."
              id="skills-heading"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {skills.map((category) => {
              const isAcquiring = category.status === 'acquiring';

              return (
                /*
                  Single GlassCard per category — one blur unit per group.
                  Chips inside are plain — no individual backdrop-filter.
                */
                <GlassCard
                  key={category.title}
                  as="div"
                  className={[
                    'skills-card-reveal',
                    'flex flex-col gap-4',
                    /* Acquiring category: dashed border to signal "in progress" */
                    isAcquiring
                      ? 'border-dashed border-secondary-500/40'
                      : 'hover:border-white/20',
                    'transition-all duration-250',
                    fallbackRevealClass,
                  ].filter(Boolean).join(' ')}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg leading-none" aria-hidden="true">
                      {category.emoji}
                    </span>
                    <h3 className="font-mono text-sm font-semibold text-text-primary">
                      {category.title}
                    </h3>

                    {/* Acquiring badge — secondary-400 accent (warm energy) */}
                    {isAcquiring && (
                      <span
                        className={[
                          'font-mono text-xs',
                          'px-2 py-0.5 rounded-pill',
                          'border border-secondary-500/50',
                          'text-secondary-400',
                          'bg-secondary-600/10',
                          'ml-auto',
                        ].join(' ')}
                        aria-label="Skills currently being acquired"
                      >
                        Acquiring
                      </span>
                    )}
                  </div>

                  {/* Skill chips — plain elements inside the blurred container */}
                  <ul
                    className="flex flex-wrap gap-2 list-none m-0 p-0"
                    aria-label={`${category.title} skills`}
                  >
                    {category.skills.map((skill) => (
                      <li
                        key={skill}
                        className={[
                          'skill-chip-reveal',
                          'font-mono text-xs',
                          'px-2.5 py-1 rounded-lg',
                          'border',
                          isAcquiring
                            ? 'border-secondary-500/25 text-secondary-400/80 bg-secondary-600/8'
                            : 'border-white/12 text-text-secondary bg-white/4',
                          fallbackRevealClass,
                        ].filter(Boolean).join(' ')}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
