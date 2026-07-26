'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

type CursorVariant = 'default' | 'hover' | 'text';

const TRAIL_COUNT = 6;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  const motionPreference = useMotionPreference();
  const [isActive, setIsActive] = useState(false);

  const dotX = useRef<gsap.QuickToFunc>();
  const dotY = useRef<gsap.QuickToFunc>();
  const glowX = useRef<gsap.QuickToFunc>();
  const glowY = useRef<gsap.QuickToFunc>();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setIsActive(motionPreference === 'full' && isFinePointer);
  }, [motionPreference]);

  useEffect(() => {
    if (!isActive || !dotRef.current || !glowRef.current) return;

    const dot = dotRef.current;
    const glow = glowRef.current;
    const trails = trailRefs.current;

    // Layered lag: dot snaps, glow (fog) lags heaviest for depth
    dotX.current = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    dotY.current = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    glowX.current = gsap.quickTo(glow, 'x', { duration: 0.9, ease: 'power2.out' });
    glowY.current = gsap.quickTo(glow, 'y', { duration: 0.9, ease: 'power2.out' });

    gsap.set([dot, glow, ...trails], { xPercent: -50, yPercent: -50, x: -100, y: -100, opacity: 0 });

    // Trail particles: a manual position-history buffer, cheapest way to do
    // a fog-wisp trail without spawning/destroying DOM nodes per frame.
    const history: { x: number; y: number }[] = Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }));

    let firstMove = true;
    let currentVariant: CursorVariant = 'default';
    let mouseX = 0;
    let mouseY = 0;
    let rafId: number;

    const tick = () => {
      history.unshift({ x: mouseX, y: mouseY });
      history.length = TRAIL_COUNT + 1;

      trails.forEach((el, i) => {
        const point = history[i + 1];
        if (!el || !point) return;
        gsap.set(el, { x: point.x, y: point.y });
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const setVariant = (variant: CursorVariant, text?: string) => {
      if (currentVariant === variant) return;
      currentVariant = variant;

      switch (variant) {
        case 'hover':
          gsap.to(dot, { scale: 0.3, duration: 0.4, ease: 'power2.out' });
          gsap.to(glow, { scale: 1.6, opacity: 0.5, duration: 0.5, ease: 'power2.out' });
          break;
        case 'text':
          gsap.to(dot, { scale: 0, duration: 0.3, ease: 'power2.out' });
          gsap.to(glow, { scale: 2, opacity: 0.35, duration: 0.5, ease: 'power2.out' });
          if (labelRef.current && text) {
            labelRef.current.textContent = text;
            gsap.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
          }
          break;
        default:
          gsap.to(dot, { scale: 1, duration: 0.4, ease: 'power2.out' });
          gsap.to(glow, { scale: 1, opacity: 0.25, duration: 0.5, ease: 'power2.out' });
          if (labelRef.current) gsap.to(labelRef.current, { opacity: 0, y: 8, duration: 0.2 });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (firstMove) {
        gsap.to(dot, { opacity: 1, duration: 0.4 });
        gsap.to(glow, { opacity: 0.25, duration: 0.6 });
        gsap.to(trails, { opacity: 0.5, duration: 0.6, stagger: 0.02 });
        firstMove = false;
      }

      dotX.current?.(mouseX);
      dotY.current?.(mouseY);
      glowX.current?.(mouseX);
      glowY.current?.(mouseY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const textTarget = target.closest<HTMLElement>('[data-cursor-text]');
      const magneticTarget = target.closest<HTMLElement>(
        'a, button, [role="button"], input, select, textarea, .magnetic-target'
      );

      if (textTarget) {
        textTarget.classList.add('cursor-magnet-active');
        setVariant('text', textTarget.dataset.cursorText);
      } else if (magneticTarget) {
        magneticTarget.classList.add('cursor-magnet-active');
        setVariant('hover');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;
      const selector = 'a, button, [role="button"], input, select, textarea, .magnetic-target, [data-cursor-text]';
      const stillInside = related?.closest(selector);
      const left = target.closest<HTMLElement>(selector);

      if (!stillInside && left) {
        left.classList.remove('cursor-magnet-active');
        setVariant('default');
      }
    };

    const handleMouseDown = () => {
      gsap.to(dot, { scale: 0.5, duration: 0.15, ease: 'power2.out' });
      gsap.to(glow, { scale: '*=1.15', opacity: '+=0.15', duration: 0.2, ease: 'power2.out' });

      const ripple = document.createElement('div');
      ripple.className =
        'fixed top-0 left-0 w-10 h-10 rounded-full border border-primary-400/80 pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2 will-change-transform';
      ripple.style.left = `${mouseX}px`;
      ripple.style.top = `${mouseY}px`;
      document.body.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0.3, opacity: 0.7 },
        { scale: 2.6, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ripple.remove() }
      );
    };

    const handleMouseUp = () => {
      const scaleBack = currentVariant === 'default' ? 1 : currentVariant === 'text' ? 0 : 0.3;
      gsap.to(dot, { scale: scaleBack, duration: 0.3, ease: 'back.out(2)' });
      gsap.to(glow, { scale: currentVariant === 'default' ? 1 : 1.6, opacity: currentVariant === 'default' ? 0.25 : 0.5, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      <style>{`
        * { cursor: none !important; }
      `}</style>

      {/* Fog glow — large, heavily blurred, lags furthest behind */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-64 h-64 rounded-full pointer-events-none z-[9996] opacity-0 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.12) 40%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        aria-hidden="true"
      />

      {/* Trail wisps between glow and ring */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRefs.current[i] = el;
          }}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997] bg-primary-500 will-change-transform"
          style={{
            width: `${8 - i * 0.9}px`,
            height: `${8 - i * 0.9}px`,
            opacity: 0,
            filter: 'blur(1px)',
          }}
          aria-hidden="true"
        />
      ))}

      {/* Inner tight dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-primary-500 rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform flex items-center justify-center"
        aria-hidden="true"
      >
        <span
          ref={labelRef}
          className="absolute whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-white opacity-0 translate-y-2"
        />
      </div>
    </>
  );
}