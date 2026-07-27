'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useScrollAnimation } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

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

    // Use TextPlugin for a perfect kerning typewriter effect
    const fullText = `“${quote}”`;

    // Initial state: empty
    textRef.current.innerHTML = '';

    // Use timeline for better ScrollTrigger control
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      }
    });

    // Animate characters auto-typing
    tl.to(textRef.current, {
      text: {
        value: fullText,
        speed: 1.5, // slightly faster than default
      },
      duration: quote.length * 0.03, // Match previous stagger timing
      ease: 'none',
    });

    // Cleanup DOM modifications on revert
    return () => {
      if (textRef.current) textRef.current.innerHTML = fullText;
    };
  });

  const handleMouseEnter = () => {
    if (motionPreference !== 'full') return;
    gsap.to(textRef.current, { scale: 1.02, textShadow: '0 0 20px rgba(124, 58, 237, 0.4)', duration: 0.3, ease: 'power2.out', transformOrigin: 'left center' });
  };

  const handleMouseLeave = () => {
    if (motionPreference !== 'full') return;
    gsap.to(textRef.current, { scale: 1, textShadow: '0 0 0px rgba(124, 58, 237, 0)', duration: 0.3, ease: 'power2.out' });
  };

  return (
    <blockquote
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="border-l-2 border-primary-500/40 pl-5 mt-6 md:mt-8 cursor-default transition-colors duration-300 hover:border-primary-500/80"
    >
      <p
        ref={textRef}
        className="text-fluid-h2 display-type text-gradient leading-tight transform-gpu"
      >
        &ldquo;{quote}&rdquo;
      </p>
    </blockquote>
  );
}
