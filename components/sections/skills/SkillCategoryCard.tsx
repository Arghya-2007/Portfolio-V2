// components/sections/skills/SkillCategoryCard.tsx
// One horizontal-scroll panel per skill category.
//
// Layout: frosted GlassCard, 85vh tall, fixed width (560px wide).
// Inside: category title (display font) + emoji + grid of SkillItems.
//
// Acquiring variant visual treatment:
//   - Dashed border in accent-cyan (--accent-500/50)
//   - Slightly lower base opacity (0.8x) on card background
//   - "Acquiring" badge in accent-cyan glass chip
//   - Cyan hover accent instead of primary-violet
//   - ProgressRing on each skill icon (handled inside SkillItem)
//
// Internal stagger reveal: when the card becomes "active" (centered) in the
// horizontal scroll, GSAP triggers a staggered fade+scale-up of skill items.
// This is driven externally via the `isActive` prop.

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';
import GlassCard from '@/components/ui/GlassCard';
import SkillItem from './SkillItem';
import type { SkillCategory } from '@/data/types';

interface SkillCategoryCardProps {
  category: SkillCategory;
  /** Controlled by parent ScrollTrigger — triggers internal item stagger */
  isActive: boolean;
  /** For the horizontal scroll: each card needs a unique index */
  index: number;
}

export default function SkillCategoryCard({
  category,
  isActive,
  index,
}: SkillCategoryCardProps) {
  const motionPreference = useMotionPreference();
  const cardRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const isAcquiring = category.status === 'acquiring';

  // Internal stagger animation — fires once when card becomes active
  useEffect(() => {
    if (!isActive || hasAnimated.current) return;
    if (motionPreference !== 'full') {
      hasAnimated.current = true;
      return;
    }
    const el = skillsRef.current;
    if (!el) return;

    hasAnimated.current = true;
    const items = el.querySelectorAll('.skill-item');
    gsap.fromTo(
      items,
      { opacity: 0, scale: 0.88, y: 12 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.09,
      }
    );
  }, [isActive, motionPreference]);

  // C7: Card hover interaction — desktop only
  const onCardEnter = useCallback(() => {
    if (motionPreference !== 'full') return;
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, {
      y: -4,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 0 60px rgba(124,58,237,0.2)`,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [motionPreference]);

  const onCardLeave = useCallback(() => {
    if (motionPreference !== 'full') return;
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, {
      y: 0,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 0 40px rgba(124,58,237,0.08)`,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [motionPreference]);

  return (
    <div
      className="skills-category-card flex-shrink-0 h-[85vh] flex items-center justify-center px-4"
      style={{ width: 'clamp(380px, 45vw, 580px)' }}
      data-card-index={index}
      onMouseEnter={onCardEnter}
      onMouseLeave={onCardLeave}
    >
      <GlassCard
        ref={cardRef as React.RefObject<HTMLElement>}
        as="div"
        className={[
          'w-full h-full flex flex-col gap-6 p-6 md:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          // C4: Top gradient accent border
          isAcquiring ? 'card-top-accent card-top-accent-cyan' : 'card-top-accent',
          // Acquiring: dashed border in accent-cyan at full opacity
          isAcquiring
            ? 'border-dashed border-accent-500/70'
            : 'border-white/12',
          // Active card: slight border brightening
          isActive && !isAcquiring ? 'border-white/20' : '',
          isActive && isAcquiring ? 'border-accent-400/80' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={isAcquiring ? {
          opacity: 0.92,
          // D1: Subtle cyan gradient wash on acquiring card
          background: 'linear-gradient(180deg, rgba(56,189,248,0.04) 0%, transparent 40%), rgba(255,255,255,0.08)',
        } : undefined}
      >
        {/* Card header */}
        <div className="flex items-start gap-3 flex-wrap">
          {/* Large category emoji */}
          <span
            className="text-4xl leading-none flex-shrink-0 select-none"
            aria-hidden="true"
          >
            {category.emoji}
          </span>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h3
              className={[
                'font-display font-bold leading-tight tracking-tight',
                // C3/C4: Primary-500 accent color for category title
                isAcquiring ? 'text-accent-400' : 'text-primary-500',
                'text-2xl md:text-3xl',
              ].join(' ')}
            >
              {category.title}
            </h3>

            {/* Skill count label */}
            <p className="font-mono text-xs text-text-muted">
              {category.skills.length} technologies
            </p>
          </div>

          {/* Acquiring badge — D1: with pulse animation */}
          {isAcquiring && (
            <span
              className={[
                'font-mono text-xs',
                'px-3 py-1 rounded-pill',
                'border border-accent-500/60',
                'text-accent-400',
                'bg-accent-500/10',
                'flex-shrink-0 self-start',
                'acquiring-badge-pulse',
              ].join(' ')}
              aria-label="Skills currently being acquired"
            >
              Acquiring
            </span>
          )}
        </div>

        {/* Divider */}
        <div
          className={`h-px w-full ${isAcquiring ? 'bg-accent-500/25' : 'bg-white/10'}`}
          aria-hidden="true"
        />

        {/* Skills grid — 1 column on narrow cards, 2 on wider */}
        <div
          ref={skillsRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-1 flex-1 content-start"
        >
          {category.skills.map((skill) => (
            <SkillItem
              key={skill.name}
              skill={skill}
              isAcquiring={isAcquiring}
              iconSize={40}
              showDescription={true}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
