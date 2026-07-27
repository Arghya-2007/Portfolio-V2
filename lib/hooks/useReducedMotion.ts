'use client';
import { useState, useEffect } from 'react';

type MotionPreference = 'full' | 'reduced' | 'none';

interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
}

export function useMotionPreference(): MotionPreference {
  const [preference, setPreference] = useState<MotionPreference>('full');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const evaluatePreference = () => {
      if (mediaQuery.matches) {
        setPreference('reduced');
        return;
      }

      // Explicit mobile gate: < 768px wide AND a coarse pointer (touch)
      // This routes mobile phones to the static fallback, saving battery/bandwidth
      // while preserving 3D for capable tablets/desktops.
      const isMobile = window.matchMedia('(max-width: 767px) and (pointer: coarse)').matches;
      if (isMobile) {
        setPreference('reduced');
        return;
      }

      const extNav = navigator as ExtendedNavigator;
      const isLowTier =
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        (extNav.deviceMemory && extNav.deviceMemory < 4);

      let hasWebGL = true;
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) hasWebGL = false;
      } catch {
        hasWebGL = false;
      }

      
      if (isLowTier || !hasWebGL) {
        setPreference('reduced');
        return;
      }

      setPreference('full');
    };

    evaluatePreference();

    const listener = () => {
      evaluatePreference();
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return preference;
}
