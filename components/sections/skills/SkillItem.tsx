// components/sections/skills/SkillItem.tsx
// A single technology row within a category card.
//
// Layout: tech icon (48px) + name (mono, semibold) + 1-line description below.
// Acquiring variant: icon is wrapped in an SVG progress ring (~50% arc in accent-cyan).
// GSAP hover micro-interactions: icon scale + glow, name slides, description brightens.
// All GSAP calls are guarded by motionPreference.

'use client';

import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';
import TechIcon from './TechIcon';
import type { Skill } from '@/data/types';

interface SkillItemProps {
  skill: Skill;
  isAcquiring?: boolean;
  /** Size of the icon — defaults to 40 (card view). Pass 32 for marquee. */
  iconSize?: number;
  /** If true, show the 1-line description below the name */
  showDescription?: boolean;
  className?: string;
}

// SVG Progress Ring — visual signal of "ongoing learning", ~50% arc fill
// strokeDasharray and strokeDashoffset calculated for a circle of r=24 (circumference ≈ 150.8)
const RING_RADIUS = 24;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~150.8
const RING_FILL_RATIO = 0.5; // 50% filled — ongoing signal, not a metric
const RING_STROKE_WIDTH = 2.5; // D1: increased from 2 for better visibility

function ProgressRing() {
  return (
    <svg
      width={RING_RADIUS * 2 + 8}
      height={RING_RADIUS * 2 + 8}
      viewBox={`0 0 ${RING_RADIUS * 2 + 8} ${RING_RADIUS * 2 + 8}`}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx={RING_RADIUS + 4}
        cy={RING_RADIUS + 4}
        r={RING_RADIUS}
        strokeWidth={RING_STROKE_WIDTH}
        className="progress-ring-track"
      />
      {/* Fill — rotated so it starts at the top (−90°) */}
      <circle
        cx={RING_RADIUS + 4}
        cy={RING_RADIUS + 4}
        r={RING_RADIUS}
        strokeWidth={RING_STROKE_WIDTH}
        className="progress-ring-fill"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={RING_CIRCUMFERENCE * (1 - RING_FILL_RATIO)}
        transform={`rotate(-90 ${RING_RADIUS + 4} ${RING_RADIUS + 4})`}
      />
    </svg>
  );
}

export default function SkillItem({
  skill,
  isAcquiring = false,
  iconSize = 40,
  showDescription = true,
  className = '',
}: SkillItemProps) {
  const motionPreference = useMotionPreference();
  const itemRef = useRef<HTMLDivElement>(null);
  const iconWrapRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Brand color for glow — only when the icon has a brandHex and it's not a near-white/near-black
  const brandColor = skill.brandHex
    ? `#${skill.brandHex}`
    : 'var(--primary-500)';

  const onMouseEnter = useCallback(() => {
    if (motionPreference !== 'full') return;
    const iconEl = iconWrapRef.current;
    const nameEl = nameRef.current;
    const descEl = descRef.current;
    const itemEl = itemRef.current;

    if (iconEl) {
      gsap.to(iconEl, {
        scale: 1.12,
        filter: `drop-shadow(0 0 8px ${brandColor}60)`,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (nameEl) {
      gsap.to(nameEl, {
        y: -2,
        color: 'var(--text-primary)',
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (descEl) {
      gsap.to(descEl, {
        opacity: 0.85,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (itemEl) {
      gsap.to(itemEl, {
        backgroundColor: isAcquiring ? 'rgba(56,189,248,0.06)' : 'rgba(124,58,237,0.06)',
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  }, [motionPreference, brandColor, isAcquiring]);

  const onMouseLeave = useCallback(() => {
    if (motionPreference !== 'full') return;
    const iconEl = iconWrapRef.current;
    const nameEl = nameRef.current;
    const descEl = descRef.current;
    const itemEl = itemRef.current;

    if (iconEl) {
      gsap.to(iconEl, {
        scale: 1,
        filter: 'none',
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (nameEl) {
      gsap.to(nameEl, {
        y: 0,
        color: 'var(--text-secondary)',
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (descEl) {
      gsap.to(descEl, {
        opacity: 0.55,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (itemEl) {
      gsap.to(itemEl, {
        backgroundColor: 'rgba(255,255,255,0)',
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  }, [motionPreference]);

  return (
    <div
      ref={itemRef}
      className={`skill-item flex items-start gap-3 p-2.5 rounded-xl cursor-default ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Icon wrapper — C2: styled icon circle with bg, border, inner glow */}
      <div
        ref={iconWrapRef}
        className={[
          'relative flex-shrink-0 flex items-center justify-center rounded-xl',
          'bg-white/10 border border-white/20',
        ].join(' ')}
        style={{
          width: iconSize + (isAcquiring ? 8 : 0) + 12,
          height: iconSize + (isAcquiring ? 8 : 0) + 12,
          boxShadow: isAcquiring
            ? 'inset 0 0 12px rgba(56, 189, 248, 0.12)'
            : 'inset 0 0 12px rgba(124, 58, 237, 0.10)',
        }}
      >
        {isAcquiring && <ProgressRing />}
        <TechIcon
          iconKey={skill.iconKey}
          iconType={skill.iconType}
          name={skill.name}
          size={iconSize}
          color={brandColor}
        />
      </div>

      {/* Text column — C3: increased gap for clearer hierarchy */}
      <div className="flex flex-col gap-1 min-w-0">
        <span
          ref={nameRef}
          className="font-mono text-sm font-semibold text-text-secondary leading-tight"
        >
          {skill.name}
        </span>
        {showDescription && (
          <p
            ref={descRef}
            className="font-body text-xs text-text-muted leading-snug"
            style={{ opacity: 0.55 }}
          >
            {skill.description}
          </p>
        )}
      </div>
    </div>
  );
}
