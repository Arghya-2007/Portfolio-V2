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
    gsap.to(textRef.current, {
      scale: 1.03,
      y: -2,
      backgroundPosition: '100% center',
      textShadow: '0 8px 30px rgba(124, 58, 237, 0.5), 0 0 15px rgba(124, 58, 237, 0.3)',
      duration: 0.5,
      ease: 'power2.out',
      transformOrigin: 'left center'
    });

    gsap.to(containerRef.current, {
      x: 6,
      duration: 0.4,
      ease: 'back.out(1.5)'
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLQuoteElement>) => {
    if (motionPreference !== 'full' || !containerRef.current || !textRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    gsap.to(textRef.current, {
      x: deltaX * 10,
      y: (deltaY * 10) - 2,
      rotationY: deltaX * 6,
      rotationX: -deltaY * 6,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (motionPreference !== 'full') return;
    gsap.to(textRef.current, {
      scale: 1,
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      backgroundPosition: '0% center',
      textShadow: '0 0 0px rgba(124, 58, 237, 0)',
      duration: 0.7,
      ease: 'power3.out'
    });

    gsap.to(containerRef.current, {
      x: 0,
      duration: 0.7,
      ease: 'power3.out'
    });
  };

  return (
    <blockquote
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="border-l-2 border-primary-500/40 pl-5 mt-4 cursor-default transition-colors duration-300 hover:border-primary-500/80"
      style={{ perspective: '1000px' }}
    >
      <p
        ref={textRef}
        className="text-fluid-h2 display-type text-gradient bg-[length:200%_auto] bg-left leading-tight transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        &ldquo;{quote}&rdquo;
      </p>
    </blockquote>
  );
}
