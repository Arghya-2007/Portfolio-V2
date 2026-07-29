// components/sections/skills/SkillsMarquee.tsx
// Act 1 — Infinite dual-row logo strip.
//
// Two rows of logos scrolling in opposite directions for visual depth:
//   Row 1: left → right  (class: marquee-track-ltr)
//   Row 2: right → left  (class: marquee-track-rtl)
//
// Animation: pure CSS @keyframes (defined in globals.css).
//   - NO GSAP for the loop — CSS is lighter and smoother.
//   - GSAP used only for the scroll-reveal entrance of the container itself.
//
// Hover on strip: animation pauses (.marquee-paused class).
// Also pauses on focus-within (keyboard a11y).
// Individual item hover: GSAP micro-interaction (scale + glow, 0.2s).
//
// Reduced/none motion: renders as static flex-wrap grid of logo chips.

'use client';

import { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useScrollAnimation } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';
import TechIcon from './TechIcon';
import { skills } from '@/data/skills';
import type { Skill } from '@/data/types';

// Flatten all skills from all categories into one array for the marquee
// Deduplicate by name (Postman appears twice)
const ALL_SKILLS: Skill[] = (() => {
  const seen = new Set<string>();
  const flat: Skill[] = [];
  for (const cat of skills) {
    for (const skill of cat.skills) {
      if (!seen.has(skill.name)) {
        seen.add(skill.name);
        flat.push(skill);
      }
    }
  }
  return flat;
})();

// Split into two rows for visual variety — first half + second half
const ROW_1 = ALL_SKILLS.slice(0, Math.ceil(ALL_SKILLS.length / 2));
const ROW_2 = ALL_SKILLS.slice(Math.ceil(ALL_SKILLS.length / 2));

// Triplicate each row to ensure seamless infinite loop at any viewport width
function triplicateRow(row: Skill[]): Skill[] {
  return [...row, ...row, ...row];
}

const ROW_1_ITEMS = triplicateRow(ROW_1);
const ROW_2_ITEMS = triplicateRow(ROW_2);

// ————————————————————————————————————————————————
// MarqueeItem — individual logo chip with GSAP hover
// ————————————————————————————————————————————————
function MarqueeItem({ skill, motionPreference }: { skill: Skill; motionPreference: string }) {
  const itemRef = useRef<HTMLDivElement>(null);

  const brandColor = skill.brandHex ? `#${skill.brandHex}` : 'var(--primary-500)';

  const onMouseEnter = useCallback(() => {
    if (motionPreference !== 'full') return;
    const el = itemRef.current;
    if (!el) return;
    gsap.to(el, {
      scale: 1.08,
      y: -2,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      filter: `drop-shadow(0 0 8px ${brandColor}55)`,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    const nameEl = el.querySelector('.marquee-item-name');
    if (nameEl) {
      gsap.to(nameEl, { color: '#ffffff', duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
    }
  }, [motionPreference, brandColor]);

  const onMouseLeave = useCallback(() => {
    if (motionPreference !== 'full') return;
    const el = itemRef.current;
    if (!el) return;
    gsap.to(el, {
      scale: 1,
      y: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      filter: 'none',
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    const nameEl = el.querySelector('.marquee-item-name');
    if (nameEl) {
      gsap.to(nameEl, { color: 'var(--text-primary)', duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    }
  }, [motionPreference]);

  return (
    <div
      ref={itemRef}
      className="m-5 flex items-center gap-3 px-5 py-3 rounded-full cursor-default select-none flex-shrink-0 border border-white/10"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="listitem"
    >
      <TechIcon
        iconKey={skill.iconKey}
        iconType={skill.iconType}
        name={skill.name}
        size={38}
        color={brandColor}
      />
      <span
        className="marquee-item-name font-mono text-base font-medium text-text-primary whitespace-nowrap"
      >
        {skill.name}
      </span>
    </div>
  );
}

// ————————————————————————————————————————————————
// MarqueeStrip — one animated row
// ————————————————————————————————————————————————
function MarqueeStrip({
  items,
  direction,
  motionPreference,
}: {
  items: Skill[];
  direction: 'ltr' | 'rtl';
  motionPreference: string;
}) {
  const trackClass = direction === 'ltr' ? 'marquee-track-ltr' : 'marquee-track-rtl';

  return (
    <div
      className="overflow-hidden w-full"
      role="list"
      aria-label={`Technology logos row ${direction === 'ltr' ? '1' : '2'}`}
    >
      <div className={`flex ${trackClass}`}>
        {items.map((skill, i) => (
          <MarqueeItem
            key={`${skill.name}-${i}`}
            skill={skill}
            motionPreference={motionPreference}
          />
        ))}
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————
// SkillsMarquee — the exported component
// ————————————————————————————————————————————————
export default function SkillsMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const motionPreference = useMotionPreference();
  const [isPaused, setIsPaused] = useState(false);
  const isReduced = motionPreference !== 'full';

  // GSAP scroll-reveal entrance for the marquee container
  useScrollAnimation(containerRef as React.RefObject<HTMLElement>, (_ctx, el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
      }
    );
  });

  // ————————
  // Reduced-motion fallback: static flex-wrap grid of chips
  // ————————
  if (isReduced) {
    return (
      <div
        className="w-full py-6"
        aria-label="Technologies"
      >
        <div className="flex flex-wrap gap-3 justify-center">
          {ALL_SKILLS.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/4"
            >
              <TechIcon
                iconKey={skill.iconKey}
                iconType={skill.iconType}
                name={skill.name}
                size={24}
                color={skill.brandHex ? `#${skill.brandHex}` : 'var(--primary-500)'}
              />
              <span className="font-mono text-sm text-text-muted">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ————————
  // Full animated marquee
  // ————————
  return (
    <div
      ref={containerRef}
      className={[
        'w-full py-6 select-none',
        'marquee-fade-edges',
        // Pause state applies to children via CSS .marquee-paused selector
        isPaused ? 'marquee-paused' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Technology logo strip — hover or focus to pause"
      role="region"
    >
      <div className="flex flex-col gap-4">
        <MarqueeStrip items={ROW_1_ITEMS} direction="ltr" motionPreference={motionPreference} />
        <MarqueeStrip items={ROW_2_ITEMS} direction="rtl" motionPreference={motionPreference} />
      </div>
    </div>
  );
}
