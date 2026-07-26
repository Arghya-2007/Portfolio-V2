'use client';

import { ReactNode, useEffect, useRef, createContext, useContext } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { registerGSAP } from '../gsap/registerPlugins';
import { useMotionPreference } from '../hooks/useReducedMotion';

// Provide Lenis instance to children (useful for Navbar condense logic)
export const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const motionPreference = useMotionPreference();

  useEffect(() => {
    registerGSAP();

    const isFullMotion = motionPreference === 'full';

    // In reduced/none mode, we still init Lenis but without smoothing.
    // This preserves native scroll feel while keeping the lenis API available
    // for components that depend on it (like navbar).
    const lenis = new Lenis({
      duration: isFullMotion ? 2 : 0, // Increased duration for a smoother, slower feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: isFullMotion,
      wheelMultiplier: 0.9, // Reduced from 1 to make mouse wheel slightly slower
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // Only hook up GSAP ScrollTrigger update event if we are in full motion mode
    if (isFullMotion) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    // Handle smooth scrolling for anchor links globally
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (!anchor) return;

      const href = anchor.getAttribute('href');
      // Only intercept internal # links
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        lenis.scrollTo(href, { offset: -50 }); // Offset for navbar
      }
    };

    if (isFullMotion) {
      document.addEventListener('click', handleAnchorClick);
    }

    // Sync Lenis with GSAP's internal ticker (required for both full and reduced motion to work correctly)
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      if (isFullMotion) {
        lenis.off('scroll', ScrollTrigger.update);
        document.removeEventListener('click', handleAnchorClick);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [motionPreference]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
