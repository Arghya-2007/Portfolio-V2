'use client';

import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '../hooks/useReducedMotion';
import { registerGSAP } from './registerPlugins';

/**
 * A shared hook for creating a scoped GSAP context that respects motion preference.
 * Use this in every component that runs GSAP animations.
 * 
 * @param containerRef The ref of the root element of the component (for scoping selectors)
 * @param animationFactory The function that sets up GSAP tweens/timelines
 * @param deps Dependencies that should trigger a re-run of the animation setup
 */
export function useScrollAnimation(
  containerRef: RefObject<HTMLElement>,
  animationFactory: (ctx: gsap.Context, el: HTMLElement) => void,
  deps: unknown[] = []
) {
  const motionPreference = useMotionPreference();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || motionPreference !== 'full') return;

    // Ensure GSAP plugins (like ScrollTrigger) are registered before running animations
    registerGSAP();

    // Create a GSAP context scoped to the container element
    const ctx = gsap.context((context) => {
      animationFactory(context, el);
    }, el);

    // Cleanup on unmount or when dependencies change
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionPreference, containerRef, ...deps]);
}

/**
 * A lightweight alternative for reduced-motion mode that just uses 
 * IntersectionObserver to add a visible class.
 */
export function useReducedScrollReveal(containerRef: RefObject<HTMLElement>) {
  const motionPreference = useMotionPreference();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || motionPreference === 'full') return;

    // In reduced/none mode, we just add a class when the element comes into view
    // The actual CSS is defined in globals.css (.reveal-hidden -> .reveal-visible)
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

    // Observe all elements with reveal-hidden class inside this container
    const hiddenElements = el.querySelectorAll('.reveal-hidden');
    hiddenElements.forEach((child) => observer.observe(child));

    // Also observe the container itself if it has the class
    if (el.classList.contains('reveal-hidden')) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [motionPreference, containerRef]);
}
