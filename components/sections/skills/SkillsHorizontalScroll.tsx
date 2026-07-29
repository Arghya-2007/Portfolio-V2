// components/sections/skills/SkillsHorizontalScroll.tsx
// Act 2 — GSAP ScrollTrigger horizontal scroll section.
//
// Desktop (≥768px, full motion):
//   - Section is PINNED via ScrollTrigger (pin: true, anticipatePin: 1)
//   - Inner cards track translates horizontally via scrub
//   - Card-to-card scale transitions (0.95 ↔ 1.0) via onUpdate
//   - Keyboard: ArrowLeft / ArrowRight when section is focused
//   - Progress dots: glassmorphic indicator above the cards
//
// Mobile (<768px) OR reduced motion:
//   - All 6 cards render in a vertical stack (no pin, no scrub)
//   - Full content visible, no scroll-hijack
//
// Lenis sync: existing lenis.on('scroll', ScrollTrigger.update) in LenisProvider
//   handles the ScrollTrigger refresh. anticipatePin: 1 prevents the jump.

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { registerGSAP } from '@/lib/gsap/registerPlugins';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';
import { useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import SkillCategoryCard from './SkillCategoryCard';
import { skills } from '@/data/skills';

const CARD_COUNT = skills.length; // 6 categories

export default function SkillsHorizontalScroll() {
  const motionPreference = useMotionPreference();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [activeCards, setActiveCards] = useState<boolean[]>(
    Array(CARD_COUNT).fill(false).map((_, i) => i === 0)
  );

  const isReduced = motionPreference !== 'full';

  // ──────────────────────────────────────────────
  // GSAP horizontal scroll setup
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (isReduced) return;
    if (typeof window === 'undefined') return;

    registerGSAP();

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      // Calculate the total horizontal distance to scroll
      // Track width minus one viewport width (so the last card ends at the right edge)
      const getScrollWidth = () => track.scrollWidth - window.innerWidth;

      const ctx = gsap.context(() => {
        // Horizontal tween — ScrollTrigger scrubs this
        const tween = gsap.to(track, {
          x: () => -getScrollWidth(),
          ease: 'none',
            scrollTrigger: {
              trigger: section,
              pin: true,
              anticipatePin: 1,
              start: 'top 80px',
              scrub: 0.3,
              // End point: total horizontal travel expressed as additional scroll
              end: () => `+=${getScrollWidth()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Determine which card is centered from scroll progress
              const progress = self.progress;
              const idx = Math.min(
                Math.round(progress * (CARD_COUNT - 1)),
                CARD_COUNT - 1
              );
              setActiveCardIndex(idx);

              // Scale inactive cards down slightly
              const cards = track.querySelectorAll('.skills-category-card > div');
              cards.forEach((card, i) => {
                const el = card as HTMLElement;
                const isActive = i === idx;
                gsap.to(el, {
                  scale: isActive ? 1 : 0.95,
                  opacity: isActive ? 1 : 0.7,
                  duration: 0.25,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
              });

              // Activate card for internal stagger on first enter
              setActiveCards((prev) => {
                if (prev[idx]) return prev; // already activated
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            },
          },
        });

        // Invalidate on resize
        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener('resize', onResize);

        return () => {
          tween.kill();
          window.removeEventListener('resize', onResize);
        };
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [isReduced]);

  // ──────────────────────────────────────────────
  // Section fade-in (sequential after marquee)
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (isReduced) return;
    const section = sectionRef.current;
    if (!section) return;

    registerGSAP();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isReduced]);

  // ──────────────────────────────────────────────
  // Keyboard navigation: ArrowLeft / ArrowRight
  // ──────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (isReduced) return;

      const section = sectionRef.current;
      if (!section) return;

      // Only handle when the section or a descendant is focused
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = Math.min(activeCardIndex + 1, CARD_COUNT - 1);
        if (nextIdx === activeCardIndex) return;

        // Calculate target scroll position
        const track = trackRef.current;
        if (!track) return;
        const totalScroll = track.scrollWidth - window.innerWidth;
        const targetScrollOffset =
          section.getBoundingClientRect().top +
          window.scrollY +
          (nextIdx / (CARD_COUNT - 1)) * totalScroll;

        window.scrollTo({ top: targetScrollOffset, behavior: 'smooth' });
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = Math.max(activeCardIndex - 1, 0);
        if (prevIdx === activeCardIndex) return;

        const track = trackRef.current;
        if (!track) return;
        const totalScroll = track.scrollWidth - window.innerWidth;
        const targetScrollOffset =
          section.getBoundingClientRect().top +
          window.scrollY +
          (prevIdx / (CARD_COUNT - 1)) * totalScroll;

        window.scrollTo({ top: targetScrollOffset, behavior: 'smooth' });
      }
    },
    [activeCardIndex, isReduced]
  );

  // ──────────────────────────────────────────────
  // Reduced-motion: plain vertical stack reveal
  // ──────────────────────────────────────────────
  useReducedScrollReveal(sectionRef as React.RefObject<HTMLElement>);

  // ——————————————————————————————————————————
  // REDUCED MOTION / MOBILE RENDER
  // ——————————————————————————————————————————
  if (isReduced) {
    return (
      <section
        ref={sectionRef}
        aria-label="Skill categories"
        className="w-full py-8"
      >
        <div className="flex flex-col gap-6 px-4 max-w-2xl mx-auto">
          {skills.map((category, i) => (
            <div key={category.title} className={`reveal-hidden`}>
              <SkillCategoryCard
                category={category}
                isActive={true}
                index={i}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ——————————————————————————————————————————
  // FULL MOTION HORIZONTAL SCROLL RENDER
  // ——————————————————————————————————————————
  return (
    <section
      ref={sectionRef}
      aria-label="Skill categories — horizontal scroll"
      className="skills-hscroll-pin w-full"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
    >
      {/* Progress indicator — positioned above cards, sticky within the pinned section */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2.5 rounded-pill"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
        aria-label={`Viewing category ${activeCardIndex + 1} of ${CARD_COUNT}`}
        aria-live="polite"
      >
        {skills.map((category, i) => (
          <button
            key={category.title}
            className={`skills-progress-dot transition-all duration-300 ${i === activeCardIndex ? 'active' : ''}`}
            aria-label={`Go to ${category.title}`}
            title={category.title}
            onClick={() => {
              // Jump to the card by calculating scroll position
              const section = sectionRef.current;
              const track = trackRef.current;
              if (!section || !track) return;
              const totalScroll = track.scrollWidth - window.innerWidth;
              const targetScroll =
                section.getBoundingClientRect().top +
                window.scrollY +
                (i / (CARD_COUNT - 1)) * totalScroll;
              window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }}
          />
        ))}
      </div>

      {/* Horizontal cards track */}
      <div
        ref={trackRef}
        className="skills-hscroll-track"
        style={{
          // Padding left/right so first/last card feel centered
          paddingLeft: '5vw',
          paddingRight: '5vw',
          paddingTop: '5vh',
          paddingBottom: '5vh',
          gap: '1.5rem',
          minHeight: 'calc(100vh - 80px)',
          alignItems: 'center',
        }}
      >
        {skills.map((category, i) => (
          <SkillCategoryCard
            key={category.title}
            category={category}
            isActive={activeCards[i]}
            index={i}
          />
        ))}
      </div>

      {/* Screen-reader hint */}
      <p className="sr-only">
        Use left and right arrow keys to navigate between skill categories when this section is focused.
      </p>
    </section>
  );
}
