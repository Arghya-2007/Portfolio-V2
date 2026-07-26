'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  strength?: number; // max offset in px
}

export default function MagneticWrapper({ children, className = '', strength = 15 }: MagneticWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const motionPreference = useMotionPreference();
  
  const xTo = useRef<gsap.QuickToFunc>();
  const yTo = useRef<gsap.QuickToFunc>();

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionPreference !== 'full' || !isFinePointer || !elementRef.current) return;
    const el = elementRef.current;
    xTo.current = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    
    return () => {
      gsap.killTweensOf(el);
    };
  }, [motionPreference]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionPreference !== 'full' || !isFinePointer || !containerRef.current || !xTo.current || !yTo.current) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = containerRef.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const x = ((clientX - centerX) / (width / 2)) * strength;
    const y = ((clientY - centerY) / (height / 2)) * strength;
    
    xTo.current(x);
    yTo.current(y);
  };

  const handleMouseLeave = () => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionPreference !== 'full' || !isFinePointer || !xTo.current || !yTo.current) return;
    
    xTo.current(0);
    yTo.current(0);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={elementRef} className="magnetic-target w-full h-full flex">
        {children}
      </div>
    </div>
  );
}
