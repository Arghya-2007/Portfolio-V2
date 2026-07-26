'use client';

import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '../hooks/useReducedMotion';
import { registerGSAP } from './registerPlugins';
import { splitText, revertSplit } from './splitText';

interface UseHeadingRevealOptions {
  type?: 'word' | 'character';
  delay?: number;
}

/**
 * A shared hook for creating a blur-to-focus staggered text reveal.
 * Respects motion preference and falls back to a simple CSS reveal.
 * 
 * @param containerRef The ref of the heading element
 * @param options Configuration for stagger granularity and delay
 */
export function useHeadingReveal(
  containerRef: RefObject<HTMLElement>,
  options: UseHeadingRevealOptions = {}
) {
  const { type = 'word', delay = 0 } = options;
  const motionPreference = useMotionPreference();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (motionPreference !== 'full') {
      // In reduced/none mode, just use the simple CSS reveal
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-visible');
              entry.target.classList.remove('reveal-hidden');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      
      observer.observe(el);
      return () => observer.disconnect();
    }

    // Ensure GSAP plugins (like ScrollTrigger) are registered before running animations
    registerGSAP();

    // Create a GSAP context scoped to the element
    const ctx = gsap.context(() => {
      // Split text
      const splitResult = splitText(el, { type });
      const targets = type === 'character' ? splitResult.chars : splitResult.words;

      if (targets.length === 0) return;

      // Animate
      gsap.fromTo(
        targets,
        { 
          opacity: 0, 
          y: 20, 
          scale: 1.08,
          filter: 'blur(12px)' 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          stagger: type === 'character' ? 0.02 : 0.04,
          delay: delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          }
        }
      );
    }, el);

    // Cleanup on unmount
    return () => {
      ctx.revert();
      revertSplit(el);
    };
  }, [motionPreference, containerRef, type, delay]);
}
