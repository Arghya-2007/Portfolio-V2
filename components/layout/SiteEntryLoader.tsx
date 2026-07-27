'use client';

import { useEffect, useState } from 'react';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

export default function SiteEntryLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isRendered, setIsRendered] = useState(true);
  const motionPreference = useMotionPreference();

  useEffect(() => {
    // Check if we've already shown the loader in this session
    let hasLoaded = false;
    try {
      hasLoaded = sessionStorage.getItem('site_entry_loaded') === 'true';
    } catch {
      // Ignore security/quota errors on restricted mobile browsers
    }

    if (hasLoaded) {
      setIsVisible(false);
      setIsRendered(false);
      return;
    }

    // Set flag for future navigations in the same session
    try {
      sessionStorage.setItem('site_entry_loaded', 'true');
    } catch {
      // Ignore
    }

    // Simulate entry loading sequence
    const transitionTime = motionPreference === 'reduced' ? 100 : 2500;
    
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out animation before unmounting
      setTimeout(() => setIsRendered(false), motionPreference === 'reduced' ? 200 : 800);
    }, transitionTime);

    return () => clearTimeout(hideTimer);
  }, [motionPreference]);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary transition-opacity ${
        motionPreference === 'reduced' ? 'duration-200' : 'duration-700 ease-in-out'
      } ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!isVisible}
    >
      <div className="font-display font-bold text-2xl text-text-primary tracking-wider mb-2">
        <span className="text-gradient">Arghya</span> Pal
      </div>
      
      {/* Small loading bar or text */}
      <div className="font-mono text-accent-400 text-xs tracking-widest mt-4 animate-pulse">
        INITIALIZING //
      </div>
    </div>
  );
}
