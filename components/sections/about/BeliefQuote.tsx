'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useScrollAnimation } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';
import { splitText, revertSplit } from '@/lib/gsap/splitText';

interface BeliefQuoteProps {
  quote: string;
}

export default function BeliefQuote({ quote }: BeliefQuoteProps) {
  const containerRef = useRef<HTMLQuoteElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const motionPreference = useMotionPreference();

  useScrollAnimation(containerRef, (ctx, el) => {
    if (motionPreference !== 'full') return;
    if (!textRef.current) return;

    // Split text into characters for typewriter effect
    const { chars } = splitText(textRef.current, { type: 'character' });
    
    // Initial state: hidden
    gsap.set(chars, { opacity: 0 });

    // Use timeline for better ScrollTrigger control
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Animate characters auto-typing
    tl.to(chars, {
      opacity: 1,
      duration: 0.01,
      stagger: 0.03, // speed of typing
      ease: 'none',
    });
    // Cleanup DOM modifications on revert
    ctx.add(() => {
      if (textRef.current) revertSplit(textRef.current);
    });
  });

  return (
    <blockquote 
      ref={containerRef} 
      className="border-l-2 border-primary-500/40 pl-5 mt-8 md:mt-12"
    >
      <p 
        ref={textRef} 
        className="text-fluid-h2 display-type text-gradient leading-tight"
      >
        &ldquo;{quote}&rdquo;
      </p>
    </blockquote>
  );
}
