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

      const extNav = navigator as ExtendedNavigator;
      const isLowTier =
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        (extNav.deviceMemory && extNav.deviceMemory < 4);
      
      if (isLowTier) {
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
