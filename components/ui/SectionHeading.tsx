// components/ui/SectionHeading.tsx
// Phase 3 — Server Component (no interactivity needed).
// Shared section-number + display heading pattern per Design.md §6.
// Used in every section to replace repeated inline markup.
// Mono label (JetBrains Mono) + Display heading (Bricolage Grotesque).

import { useRef } from 'react';
import { useFlyInReveal } from '@/lib/gsap/useFlyInReveal';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

interface SectionHeadingProps {
  /** Two-digit section number, e.g. "01" */
  number: string;
  /** Short mono label after the slash, e.g. "About" */
  label: string;
  /** The main display heading text */
  heading: string;
  /** Optional supporting subtext below the heading */
  subheading?: string;
  /** id applied to the <h2> — use for aria-labelledby on the parent <section> */
  id?: string;
  /** Optional extra className on the wrapper */
  className?: string;
}

export default function SectionHeading({
  number,
  label,
  heading,
  subheading,
  id,
  className = "",
}: SectionHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const motionPreference = useMotionPreference();
  // Use kinetic text effect for main headings
  useFlyInReveal(headingRef);
  
  const fallbackRevealClass = motionPreference !== 'full' ? 'reveal-hidden' : '';

  return (
    <div className={`mb-10 ${className}`}>
      {/* Mono section-number convention: "01 / About" */}
      <p
        className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3 select-none"
        aria-hidden="true"
      >
        <span className="text-primary-500">{number}</span>
        <span className="mx-1.5 text-text-muted opacity-50">/</span>
        {label}
      </p>

      {/* Kinetic Distortion SVG removed — replaced with CSS GSAP transforms */}

      {/* Display heading — fluid size, display-type letter-spacing */}
      <div className="relative group inline-block">
        <h2
          id={id}
          ref={headingRef}
          className={`font-display text-fluid-h2 font-bold text-text-primary display-type ${fallbackRevealClass}`}
          style={{
            // For the glow effect:
            '--glow-opacity': 0,
            position: 'relative',
          } as React.CSSProperties}
        >
          {/* Glow Overlay */}
          {motionPreference === 'full' && (
            <div 
              className="pointer-events-none absolute z-10 transition-opacity duration-300"
              style={{
                top: '-120px', left: '-120px', right: '-120px', bottom: '-120px',
                opacity: 'var(--glow-opacity)',
                background: 'radial-gradient(circle 80px at calc(var(--mouse-x, 50%) + 120px) calc(var(--mouse-y, 50%) + 120px), rgba(255,255,255,0.15) 0%, transparent 100%)',
                mixBlendMode: 'color-dodge',
              }}
              aria-hidden="true"
            />
          )}
          <span className="relative z-20">{heading}</span>
        </h2>
      </div>

      {/* Optional subheading — body copy beneath the heading */}
      {subheading && (
        <p className="font-body text-text-secondary mt-3 max-w-xl leading-body text-fluid-body">
          {subheading}
        </p>
      )}
    </div>
  );
}
