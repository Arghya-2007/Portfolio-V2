// components/ui/GlassButton.tsx
// Phase 3 — Server Component (pure CSS hover states, no JS interactivity).
// Liquid glass treatment per Design.md §4 — applied ONLY to buttons.
//
// CSS spec (from Design.md §4):
//   background: rgba(255,255,255,0.08)
//   backdrop-filter: blur(20px) saturate(180%)
//   border: 1px solid rgba(255,255,255,0.18)
//   border-radius: 999px (pill)
//   box-shadow: inset 0 1px 1px rgba(255,255,255,0.25), 0 8px 32px rgba(0,0,0,0.35)
//
// @supports fallback (Rules.md §6.2): solid bg-bg-secondary when backdrop-filter unavailable.
//
// Hover: CSS transition on shadow + border opacity. GSAP sheen added in Phase 5.
// Focus-visible: ring-2 ring-primary-500 (Rules.md §3.2 keyboard a11y).
//
// Renders as <a> when href is provided, <button> otherwise.
// variant='primary': primary-500 border tint + primary glow on hover
// variant='secondary': white/18 border, cooler tone

'use client';

import { useRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

/* Base shared props */
interface SharedProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/* Button-mode props */
interface ButtonModeProps
  extends SharedProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps> {
  href?: undefined;
}

/* Anchor-mode props */
interface AnchorModeProps
  extends SharedProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps> {
  href: string;
}

type GlassButtonProps = ButtonModeProps | AnchorModeProps;

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:   'border-primary-500/60 text-text-primary hover:border-primary-500 hover:shadow-glass-liquid-hover hover:shadow-glow-primary',
  secondary: 'border-white/18 text-text-secondary hover:border-white/35 hover:text-text-primary hover:shadow-glass-liquid-hover',
};

const BASE_CLASSES = [
  /* Structure */
  'relative overflow-hidden',
  'inline-flex items-center justify-center gap-2',
  'font-body font-medium',
  'rounded-pill',
  /* Liquid glass */
  'glass-liquid',
  /* Transitions */
  'transition-all duration-250 ease-out',
  /* Focus ring (keyboard a11y — Rules.md §3.2) */
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
  /* Prevent text-select on click */
  'select-none',
  /* Cursor */
  'cursor-pointer',
].join(' ');

export default function GlassButton(props: GlassButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    href,
    ...rest
  } = props;

  const sheenRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLElement>(null);
  const motionPreference = useMotionPreference();

  const handleMouseEnter = () => {
    // Only apply hover effects on fine pointer devices
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionPreference !== 'full' || !isFinePointer) return;
    
    if (sheenRef.current) {
      gsap.fromTo(
        sheenRef.current,
        { xPercent: -100 },
        { xPercent: 100, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' }
      );
    }
    
    if (buttonRef.current) {
      // Bounce micro-interaction
      gsap.fromTo(
        buttonRef.current,
        { scale: 1, y: 0 },
        { scale: 0.95, y: -4, duration: 0.4, ease: 'elastic.out(1, 0.4)', overwrite: 'auto', onComplete: () => {
          gsap.to(buttonRef.current, { scale: 1, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
        }}
      );
    }
  };

  const classes = [
    BASE_CLASSES,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className,
  ].join(' ');

  const innerContent = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <span
        ref={sheenRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none -translate-x-full"
        style={{
          background: 'linear-gradient(110deg, transparent, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.05) 80%, transparent)',
        }}
      />
    </>
  );

  if (href !== undefined) {
    /* Anchor mode */
    const anchorProps = rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
    return (
      <a 
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href} 
        className={classes} 
        onMouseEnter={handleMouseEnter}
        {...anchorProps}
      >
        {innerContent}
      </a>
    );
  }

  /* Button mode */
  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button 
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type="button" 
      className={classes} 
      onMouseEnter={handleMouseEnter}
      {...buttonProps}
    >
      {innerContent}
    </button>
  );
}
