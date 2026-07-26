// components/ui/GlassCard.tsx
// Phase 3 — Server Component (no interactivity).
// Frosted panel treatment per Design.md §4.
//
// IMPORTANT: This is NOT liquid glass — liquid glass is ONLY for Navbar + Buttons.
// This component uses the lighter blur(12px) "frosted panel" spec:
//   background: rgba(255,255,255,0.05)
//   backdrop-filter: blur(12px)
//   border: 1px solid rgba(255,255,255,0.10)
//   border-radius: 20px
//
// @supports fallback (Rules.md §6.2): browsers without backdrop-filter
// receive a solid rgba(5,5,10,0.7) background instead.

import { type ElementType, type ReactNode, type HTMLAttributes } from 'react';

type AllowedTag = 'div' | 'article' | 'li' | 'section' | 'aside';

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Semantic element to render — defaults to 'div' */
  as?: AllowedTag;
  className?: string;
}

export default function GlassCard({
  children,
  as,
  className = '',
  ...rest
}: GlassCardProps) {
  const Tag = (as ?? 'div') as ElementType;

  return (
    <Tag
      className={`glass-frosted p-5 shadow-glass-frosted transition-shadow duration-250 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
