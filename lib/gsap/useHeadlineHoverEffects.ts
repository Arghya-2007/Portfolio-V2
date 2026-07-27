'use client';

import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '../hooks/useReducedMotion';
// No need for splitText here as it's managed by Hero.tsx

export function useHeadlineHoverEffects(
  h1Ref: RefObject<HTMLElement>,
  isModelReady: boolean = true
) {
  const motionPreference = useMotionPreference();

  useEffect(() => {
    const el = h1Ref.current;
    if (!el || !isModelReady) return;

    // We use a matchMedia instance for the hover check to ensure we only apply this
    // on devices that have a fine pointer and support hover.
    const mm = gsap.matchMedia();

    mm.add('(hover: hover) and (pointer: fine)', () => {
      if (motionPreference !== 'full') {
        // Reduced motion: fallback to simple gradient shimmer only, no character explosion
        const gradientTarget = el.querySelector('.text-gradient') || el;
        const gradientChild = gradientTarget.querySelector('.word-split') || gradientTarget;

        const onMouseEnter = () => {
          gsap.to(gradientChild, { backgroundPosition: '200% center', duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
        };
        const onMouseLeave = () => {
          gsap.to(gradientChild, { backgroundPosition: '0% center', duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
        };

        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);

        return () => {
          el.removeEventListener('mouseenter', onMouseEnter);
          el.removeEventListener('mouseleave', onMouseLeave);
        };
      }

      const onMouseEnter = () => {
        // Glow opacity
        gsap.to(el, { '--glow-opacity': 1, duration: 0.4, ease: 'sine.inOut' } as gsap.TweenVars);
        
        const chars = el.querySelectorAll('.char-split');
        if (chars.length > 0) {
          // Explode characters subtly
          chars.forEach((char) => {
            gsap.to(char, {
              x: gsap.utils.random(-15, 15),
              y: gsap.utils.random(-10, 10),
              rotation: gsap.utils.random(-8, 8),
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
        }
      };

      const onMouseLeave = () => {
        // Reset glow opacity
        gsap.to(el, { '--glow-opacity': 0, duration: 0.4, ease: 'sine.inOut' } as gsap.TweenVars);
        
        const chars = el.querySelectorAll('.char-split');
        if (chars.length > 0) {
          // Snap back characters
          gsap.to(chars, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
            overwrite: 'auto'
          });
        }
      };
      
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);

      return () => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      };
    });

    return () => {
      mm.revert();
    };
  }, [h1Ref, isModelReady, motionPreference]);
}
