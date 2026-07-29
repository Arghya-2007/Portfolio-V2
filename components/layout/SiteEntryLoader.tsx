'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function SiteEntryLoader() {
  const [shouldRender, setShouldRender] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Check Session & Reduced Motion
    let hasLoaded = false;
    try {
      hasLoaded = sessionStorage.getItem('site_entry_loaded') === 'true';
    } catch { }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDev = process.env.NODE_ENV === 'development';

    if ((hasLoaded && !isDev) || prefersReducedMotion) {
      setShouldRender(false);
      setIsVisible(false);
      try {
        sessionStorage.setItem('site_entry_loaded', 'true');
      } catch { }
      return;
    }

    try {
      sessionStorage.setItem('site_entry_loaded', 'true');
    } catch { }

    // 2. Preload Images
    const bgImages = [1, 2, 3, 4, 5, 6].map(i => `/images/bg/bg-${i}.webp`);
    bgImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Initialize counter text
    if (percentRef.current) {
      percentRef.current.innerText = "0";
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = "0%";
    }

    // 3. GSAP Animation Sequence
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setShouldRender(false);
        }
      });

      const counterProxy = { value: 0 };
      
      // Slight scale in of the text container as it counts
      tl.fromTo(textContainerRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
        "+=0.2"
      );

      tl.to(counterProxy, {
        value: 100,
        duration: 2.5,
        ease: "power3.inOut",
        onUpdate: () => {
          if (percentRef.current) {
            percentRef.current.innerText = Math.round(counterProxy.value).toString();
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${counterProxy.value}%`;
          }
        }
      }, "<");

      // Premium fade out and blur of the text
      tl.to(textContainerRef.current, {
        opacity: 0,
        scale: 1.05,
        filter: "blur(12px)",
        duration: 0.6,
        ease: "power2.inOut"
      }, "+=0.2");

      // Split panels from center to the sides
      tl.to(leftPanelRef.current, {
        xPercent: -100,
        duration: 1.2,
        ease: "expo.inOut"
      }, "-=0.2");

      tl.to(rightPanelRef.current, {
        xPercent: 100,
        duration: 1.2,
        ease: "expo.inOut"
      }, "<");

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex pointer-events-auto ${isVisible ? '' : 'hidden'}`}
      aria-hidden="true"
    >
      {/* Left Split Panel */}
      <div 
        ref={leftPanelRef}
        className="w-1/2 h-full bg-bg-primary will-change-transform"
      />
      {/* Right Split Panel */}
      <div 
        ref={rightPanelRef}
        className="w-1/2 h-full bg-bg-primary will-change-transform"
      />

      {/* Text Overlay */}
      <div
        ref={textContainerRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none will-change-transform"
      >
        {/* Premium Viewfinder Framing (Desktop only) */}
        <div className="absolute inset-8 md:inset-12 border border-text-primary/10 pointer-events-none hidden md:block">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent-400 -mt-[1px] -ml-[1px]" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent-400 -mt-[1px] -mr-[1px]" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent-400 -mb-[1px] -ml-[1px]" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent-400 -mb-[1px] -mr-[1px]" />
          
          <div className="absolute top-6 left-6 font-mono text-xs tracking-[0.2em] opacity-40 uppercase text-text-primary">
            v2.0_boot
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-xs tracking-[0.2em] opacity-40 uppercase text-text-primary">
            PORTFOLIO_SYSTEM
          </div>
        </div>

        {/* Central UI */}
        <div className="flex flex-col items-center text-text-primary relative z-10">
          <div className="font-mono text-xs md:text-sm tracking-[0.4em] opacity-60 mb-6 uppercase">
            System Initialization
          </div>
          
          <div className="flex items-start">
            <div 
              ref={percentRef}
              className="text-7xl md:text-[15rem] font-display font-bold text-accent-400 tracking-tighter"
              style={{ lineHeight: 0.85 }}
            />
            <span className="text-3xl md:text-6xl font-display font-bold text-accent-400 mt-2 md:mt-8 opacity-80">
              %
            </span>
          </div>

          <div className="w-48 md:w-64 h-[2px] bg-text-primary/10 mt-10 overflow-hidden rounded-full">
            <div ref={progressBarRef} className="h-full bg-accent-400 w-0" />
          </div>
        </div>
      </div>
    </div>
  );
}



