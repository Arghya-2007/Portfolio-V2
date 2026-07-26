'use client';

import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { splitText, revertSplit } from './splitText';
import { useMotionPreference } from '../hooks/useReducedMotion';

export function useFlyInReveal(
  containerRef: RefObject<HTMLElement>
) {
  const motionPreference = useMotionPreference();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number;
    let split: { words: HTMLElement[]; chars: HTMLElement[] } | null = null;

    // We do NOT want GSAP to automatically revert our manually managed event listeners 
    // in a way that breaks on re-renders, but `gsap.context` is good for animations.
    const ctx = gsap.context(() => {
      if (motionPreference === 'full') {
        // 1. Setup split text for character-level fly-in
        split = splitText(el, { type: 'character' });
        
        // Initial state
        if (split.chars.length > 0) {
          gsap.set(split.chars, {
            opacity: 0,
            x: () => {
              const angle = gsap.utils.random(0, Math.PI * 2);
              const distance = gsap.utils.random(150, 400);
              return Math.cos(angle) * distance;
            },
            y: () => {
              const angle = gsap.utils.random(0, Math.PI * 2);
              const distance = gsap.utils.random(150, 400);
              return Math.sin(angle) * distance;
            },
            rotation: () => gsap.utils.random(-180, 180),
            scale: () => gsap.utils.random(0.4, 1.2),
          });

          // Fly-in Convergence
          split.chars.forEach((char) => {
            gsap.to(char, {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: gsap.utils.random(0.8, 1.4),
              delay: gsap.utils.random(0, 0.3),
              ease: 'expo.out',
            });
          });
        }
      } else {
        // Reduced motion: standard fade
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
        );
      }
    }, el);

    // Hover logic managed separately from GSAP context revert to ensure it cleans up properly
    const gradientTarget = el.querySelector('.text-gradient') || el;
    const gradientChild = gradientTarget.querySelector('.word-split') || gradientTarget;

    const onMouseMove = (e: MouseEvent) => {
      if (motionPreference !== 'full') return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);

        if (split && split.chars.length > 0) {
          // Find the closest character to the mouse
          const charRects = split.chars.map(char => {
            const charRect = char.getBoundingClientRect();
            return {
              char,
              centerX: charRect.left + charRect.width / 2 - rect.left,
              centerY: charRect.top + charRect.height / 2 - rect.top,
            };
          });

          let closestIdx = -1;
          let minDist = Infinity;
          charRects.forEach((c, idx) => {
            const dist = Math.hypot(c.centerX - x, c.centerY - y);
            if (dist < minDist) {
              minDist = dist;
              closestIdx = idx;
            }
          });

          // If the mouse is relatively close to the bounding box of the text, apply ripple
          // We can use a reasonable distance threshold (e.g. 150px) to stop rippling if far away
          if (minDist < 150) {
            split.chars.forEach((char, idx) => {
              const distance = Math.abs(idx - closestIdx);
              // immediate neighbors get ~50% intensity, next ones ~20%, then 0
              let intensity = 0;
              if (distance === 0) intensity = 1;
              else if (distance === 1) intensity = 0.5;
              else if (distance === 2) intensity = 0.2;
              
              if (intensity > 0) {
                // Determine a pseudo-random direction based on char index to keep it consistent per character
                // but we want it to feel springy, we can use a small time-based or index-based random
                // We'll use a deterministic value based on idx so it doesn't jitter crazily
                const seed = (idx * 13.7) % 1;
                const signX = (idx % 2 === 0) ? 1 : -1;
                
                gsap.to(char, {
                  skewX: (seed * 8 + 2) * signX * intensity, // random(-8, 8) approximation
                  scaleY: 1 + (0.15 * signX * intensity), // random(0.85, 1.15) approximation
                  rotation: (seed * 6 + 1) * signX * intensity, // random(-6, 6) approximation
                  duration: 0.4,
                  ease: "elastic.out(1, 0.4)",
                  overwrite: "auto"
                });
              } else {
                // Reset characters outside the ripple radius
                gsap.to(char, {
                  skewX: 0,
                  scaleY: 1,
                  rotation: 0,
                  duration: 0.4,
                  ease: "elastic.out(1, 0.4)",
                  overwrite: "auto"
                });
              }
            });
          } else {
            // Reset all if mouse is far from the characters
            gsap.to(split.chars, {
              skewX: 0,
              scaleY: 1,
              rotation: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.4)",
              overwrite: "auto"
            });
          }
        }
      });
    };

    const onMouseEnter = () => {
      if (motionPreference === 'full') {
        // Glow opacity
        gsap.to(el, { '--glow-opacity': 1, duration: 0.4, ease: 'sine.inOut' } as gsap.TweenVars);
      } else {
        // Fallback gradient shimmer
        gsap.to(gradientChild, { backgroundPosition: '200% center', duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
      }
    };

    const onMouseLeave = () => {
      if (motionPreference === 'full') {
        gsap.to(el, { '--glow-opacity': 0, duration: 0.4, ease: 'sine.inOut' } as gsap.TweenVars);
        if (split && split.chars.length > 0) {
          gsap.to(split.chars, {
            skewX: 0,
            scaleY: 1,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
            overwrite: "auto"
          });
        }
      } else {
        // Fallback gradient shimmer
        gsap.to(gradientChild, { backgroundPosition: '0% center', duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
      }
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      if (split) {
        revertSplit(el);
      }
    };
  }, [containerRef, motionPreference]);
}
