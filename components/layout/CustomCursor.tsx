'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

type CursorVariant = 'default' | 'hover' | 'text';

// ─── Tunable constants ────────────────────────────────────────────────────────
const SMOKE_COUNT           = 24;   // pooled smoke particles (more = denser wisps)
const SMOKE_SPAWN_INTERVAL  = 0.04; // seconds between smoke spawns
const HOLD_DURATION         = 0.7;  // seconds to fully charge the ring
const HOLD_PARTICLE_INTERVAL= 0.06; // seconds between hold-orbit particles

// Gradient colour stops cycled across smoke particles for a vivid, smooth look
const SMOKE_PALETTES = [
  // violet → indigo → blue
  ['rgba(167,139,250,0.85)', 'rgba(99,102,241,0.45)', 'rgba(59,130,246,0.10)'],
  // rose → violet → indigo
  ['rgba(251,113,133,0.75)', 'rgba(167,139,250,0.40)', 'rgba(99,102,241,0.08)'],
  // cyan → violet → transparent
  ['rgba(34,211,238,0.70)', 'rgba(139,92,246,0.35)', 'rgba(99,102,241,0.06)'],
  // amber → rose → violet
  ['rgba(251,191,36,0.65)', 'rgba(244,114,182,0.38)', 'rgba(139,92,246,0.06)'],
  // emerald → cyan → blue
  ['rgba(52,211,153,0.65)', 'rgba(34,211,238,0.35)', 'rgba(59,130,246,0.06)'],
];

// Particle colour palettes for tap / hold effects
const TAP_COLORS  = ['#a78bfa','#818cf8','#38bdf8','#f472b6','#34d399','#fbbf24'];
const HOLD_COLORS = ['#c4b5fd','#818cf8','#7dd3fc','#f9a8d4','#86efac','#fde68a'];

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const smokeRefs = useRef<HTMLDivElement[]>([]);
  const chargeRingRef = useRef<SVGCircleElement>(null);
  const chargeWrapRef = useRef<HTMLDivElement>(null);

  const motionPreference = useMotionPreference();
  const [isActive, setIsActive] = useState(false);

  const dotX = useRef<gsap.QuickToFunc>();
  const dotY = useRef<gsap.QuickToFunc>();
  const glowX = useRef<gsap.QuickToFunc>();
  const glowY = useRef<gsap.QuickToFunc>();
  const chargeX = useRef<gsap.QuickToFunc>();
  const chargeY = useRef<gsap.QuickToFunc>();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setIsActive(motionPreference === 'full' && isFinePointer);
  }, [motionPreference]);

  useEffect(() => {
    if (!isActive || !dotRef.current || !glowRef.current || !chargeWrapRef.current) return;

    const dot = dotRef.current;
    const glow = glowRef.current;
    const smokeEls = smokeRefs.current;
    const chargeWrap = chargeWrapRef.current;
    const chargeRing = chargeRingRef.current;

    dotX.current = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    dotY.current = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    glowX.current = gsap.quickTo(glow, 'x', { duration: 0.9, ease: 'power2.out' });
    glowY.current = gsap.quickTo(glow, 'y', { duration: 0.9, ease: 'power2.out' });
    chargeX.current = gsap.quickTo(chargeWrap, 'x', { duration: 0.15, ease: 'power3.out' });
    chargeY.current = gsap.quickTo(chargeWrap, 'y', { duration: 0.15, ease: 'power3.out' });

    gsap.set([dot, glow, chargeWrap], { xPercent: -50, yPercent: -50, x: -100, y: -100, opacity: 0 });
    gsap.set(smokeEls, { xPercent: -50, yPercent: -50, opacity: 0 });

    const CIRC = 2 * Math.PI * 18; // matches r=18 on the charge ring
    if (chargeRing) {
      chargeRing.style.strokeDasharray = `${CIRC}`;
      chargeRing.style.strokeDashoffset = `${CIRC}`;
    }

    let firstMove       = true;
    let currentVariant: CursorVariant = 'default';
    let mouseX          = 0;
    let mouseY          = 0;
    let smokeClock      = 0;
    let smokeIndex      = 0;
    let holdClock       = 0;
    let holdAngle       = 0;
    let rafId: number;
    let lastTime        = performance.now();

    let isHolding       = false;
    let holdStart       = 0;
    let holdTween: gsap.core.Tween | null = null;
    let magneticTarget: HTMLElement | null = null;

    const randomFrom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // ─── Refined Smoke Emitter ─────────────────────────────────────────────
    // Each particle picks a random gradient palette at spawn time so individual
    // wisps glow with distinct colours. Physics: upward drift + lateral wander,
    // slow ease-in scale so the puff "inflates" naturally, then fades out.
    const spawnSmoke = () => {
      const el = smokeEls[smokeIndex % smokeEls.length];
      smokeIndex++;
      if (!el) return;

      const palette  = randomFrom(SMOKE_PALETTES);
      const angle    = Math.random() * Math.PI * 2;
      const speed    = 22 + Math.random() * 36;
      const driftX   = Math.cos(angle) * speed * 0.6 + (Math.random() - 0.5) * 12;
      const driftY   = Math.sin(angle) * speed * 0.4 - (14 + Math.random() * 10);
      const size     = 14 + Math.random() * 18;
      const rotate   = (Math.random() - 0.5) * 150;
      const duration = 1.3 + Math.random() * 0.7;
      const offX     = (Math.random() - 0.5) * 8;
      const offY     = (Math.random() - 0.5) * 8;

      gsap.killTweensOf(el);
      el.style.background = `radial-gradient(circle at 40% 40%, ${palette[0]} 0%, ${palette[1]} 45%, ${palette[2]} 75%, transparent 100%)`;

      gsap.set(el, {
        x:       mouseX + offX,
        y:       mouseY + offY,
        width:   size,
        height:  size,
        opacity: lerp(0.28, 0.48, Math.random()),
        scale:   0.25,
        rotate:  (Math.random() - 0.5) * 30,
      });
      gsap.to(el, {
        x:       `+=${driftX}`,
        y:       `+=${driftY}`,
        scale:   lerp(1.6, 2.6, Math.random()),
        rotate,
        opacity: 0,
        duration,
        ease:    'power1.inOut',
      });
    };

    // ─── Tap Particle Burst ────────────────────────────────────────────────
    // Fires on every mousedown and proportionally on mouseup.
    // Creates short-lived coloured dots that explode outward with a
    // slight downward arc for a natural gravity feel.
    const spawnTapParticles = (x: number, y: number, count: number, power: number) => {
      for (let i = 0; i < count; i++) {
        const el    = document.createElement('div');
        const color = randomFrom(TAP_COLORS);
        const size  = 2.5 + Math.random() * 3.5;
        const ang   = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
        const dist  = power * (0.5 + Math.random() * 0.8);
        const tx    = Math.cos(ang) * dist;
        const ty    = Math.sin(ang) * dist;
        const dur   = 0.45 + Math.random() * 0.3;

        el.style.cssText = [
          'position:fixed','top:0','left:0','border-radius:50%',
          'pointer-events:none','z-index:9997',
          `width:${size}px`,`height:${size}px`,
          `left:${x}px`,`top:${y}px`,
          `background:${color}`,
          `box-shadow:0 0 6px 1px ${color}cc,0 0 12px 2px ${color}66`,
          'will-change:transform',
        ].join(';');
        document.body.appendChild(el);

        gsap.fromTo(
          el,
          { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 },
          {
            x:        tx,
            y:        ty + dist * 0.3,
            scale:    0,
            opacity:  0,
            duration: dur,
            ease:     'power3.out',
            onComplete: () => el.remove(),
          }
        );
      }
    };

    // ─── Hold Orbit Particles ──────────────────────────────────────────────
    // While the button is held, particles spiral outward from the cursor.
    // The orbit radius and burst distance grow proportionally with charge.
    const spawnHoldParticle = (progress: number) => {
      const el    = document.createElement('div');
      const color = randomFrom(HOLD_COLORS);
      const size  = 2 + Math.random() * 3;
      const orbitR= 16 + progress * 24;
      const ang   = holdAngle + (Math.random() - 0.5) * 0.8;
      const sx    = Math.cos(ang) * orbitR;
      const sy    = Math.sin(ang) * orbitR;
      const tx    = sx * (1.8 + progress * 1.2);
      const ty    = sy * (1.8 + progress * 1.2);

      el.style.cssText = [
        'position:fixed','top:0','left:0','border-radius:50%',
        'pointer-events:none','z-index:9997',
        `width:${size}px`,`height:${size}px`,
        `left:${mouseX}px`,`top:${mouseY}px`,
        `background:${color}`,
        `box-shadow:0 0 8px 2px ${color}cc`,
        'will-change:transform',
      ].join(';');
      document.body.appendChild(el);

      gsap.fromTo(
        el,
        { xPercent: -50, yPercent: -50, x: sx, y: sy, scale: 1, opacity: 0.9 },
        {
          x:        tx,
          y:        ty,
          scale:    0,
          opacity:  0,
          duration: 0.5 + Math.random() * 0.3,
          ease:     'power2.out',
          onComplete: () => el.remove(),
        }
      );
    };

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!firstMove) {
        // smoke trail
        smokeClock += dt;
        while (smokeClock >= SMOKE_SPAWN_INTERVAL) {
          smokeClock -= SMOKE_SPAWN_INTERVAL;
          spawnSmoke();
        }

        // hold orbit particles
        if (isHolding) {
          holdClock += dt;
          holdAngle += dt * 4.5;   // ~0.7 rev/s
          const progress = Math.min((performance.now() - holdStart) / 1000 / HOLD_DURATION, 1);
          while (holdClock >= HOLD_PARTICLE_INTERVAL) {
            holdClock -= HOLD_PARTICLE_INTERVAL;
            spawnHoldParticle(progress);
          }
        } else {
          holdClock = 0;
        }
      }

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
        firstMove = false;
      }

      dotX.current?.(mouseX);
      dotY.current?.(mouseY);
      glowX.current?.(mouseX);
      glowY.current?.(mouseY);

      if (isHolding) {
        chargeX.current?.(mouseX);
        chargeY.current?.(mouseY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const textTarget = target.closest<HTMLElement>('[data-cursor-text]');
      const magnetEl = target.closest<HTMLElement>(
        'a, button, [role="button"], input, select, textarea, .magnetic-target'
      );

      if (textTarget) {
        textTarget.classList.add('cursor-magnet-active');
        setVariant('text', textTarget.dataset.cursorText);
      } else if (magnetEl) {
        magnetEl.classList.add('cursor-magnet-active');
        magneticTarget = magnetEl;
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
        if (magneticTarget === left) magneticTarget = null;
        setVariant('default');
      }
    };

    // ---- Magnetic pull: gently drags hovered element toward the pointer ----
    const handleMagneticMove = (e: MouseEvent) => {
      if (!magneticTarget) return;
      const rect = magneticTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      gsap.to(magneticTarget, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    };
    const resetMagnetic = () => {
      if (!magneticTarget) return;
      gsap.to(magneticTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    };

    // ─── Big Burst: coloured embers on click / hold-complete ──────────────
    const spawnBurst = (x: number, y: number, count: number, power: number) => {
      for (let i = 0; i < count; i++) {
        const el    = document.createElement('div');
        const color = randomFrom(TAP_COLORS);
        const size  = 3 + Math.random() * 4;
        const ang   = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const dist  = power * (0.55 + Math.random() * 0.65);

        el.style.cssText = [
          'position:fixed','top:0','left:0','border-radius:50%',
          'pointer-events:none','z-index:9997',
          `width:${size}px`,`height:${size}px`,
          `left:${x}px`,`top:${y}px`,
          `background:${color}`,
          `box-shadow:0 0 8px 2px ${color}cc,0 0 18px 4px ${color}44`,
          'will-change:transform',
        ].join(';');
        document.body.appendChild(el);

        gsap.fromTo(
          el,
          { xPercent: -50, yPercent: -50, scale: 0.8, opacity: 1 },
          {
            x:        Math.cos(ang) * dist,
            y:        Math.sin(ang) * dist,
            scale:    0,
            opacity:  0,
            duration: 0.6 + Math.random() * 0.35,
            ease:     'power3.out',
            onComplete: () => el.remove(),
          }
        );
      }
    };

    const handleMouseDown = () => {
      isHolding  = true;
      holdStart  = performance.now();
      holdAngle  = 0;
      holdClock  = 0;

      gsap.to(dot,  { scale: 0.5, duration: 0.15, ease: 'power2.out' });
      gsap.to(glow, { scale: '*=1.15', opacity: '+=0.15', duration: 0.2, ease: 'power2.out' });

      // Immediate tap particle burst
      spawnTapParticles(mouseX, mouseY, 10, 38);

      // Tap ripple ring
      const ripple = document.createElement('div');
      ripple.style.cssText = [
        'position:fixed',`top:${mouseY}px`,`left:${mouseX}px`,
        'width:40px','height:40px','border-radius:50%',
        'border:1.5px solid rgba(167,139,250,0.85)',
        'pointer-events:none','z-index:9997',
        'transform:translate(-50%,-50%)','will-change:transform',
        'box-shadow:0 0 8px rgba(167,139,250,0.5),inset 0 0 8px rgba(167,139,250,0.2)',
      ].join(';');
      document.body.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0.3, opacity: 0.85 },
        { scale: 2.8, opacity: 0, duration: 0.65, ease: 'power2.out', onComplete: () => ripple.remove() }
      );

      // Echo ripple for depth
      const ripple2 = document.createElement('div');
      ripple2.style.cssText = [
        'position:fixed',`top:${mouseY}px`,`left:${mouseX}px`,
        'width:40px','height:40px','border-radius:50%',
        'border:1px solid rgba(99,102,241,0.55)',
        'pointer-events:none','z-index:9996',
        'transform:translate(-50%,-50%)','will-change:transform',
      ].join(';');
      document.body.appendChild(ripple2);
      gsap.fromTo(
        ripple2,
        { scale: 0.3, opacity: 0.6 },
        { scale: 3.5, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.08, onComplete: () => ripple2.remove() }
      );

      // Charge ring fills over HOLD_DURATION
      gsap.set(chargeWrap, { x: mouseX, y: mouseY, opacity: 1, scale: 1 });
      if (chargeRing) gsap.set(chargeRing, { strokeDashoffset: CIRC });

      holdTween?.kill();
      holdTween = gsap.to(chargeRing, {
        strokeDashoffset: 0,
        duration: HOLD_DURATION,
        ease: 'none',
        onUpdate: function () {
          const p = this.progress();
          gsap.set(chargeWrap, { scale: 1 + p * 0.4 });
          gsap.set(dot, { scale: 0.5 - p * 0.25 });
        },
        onComplete: () => {
          if (!isHolding) return;
          spawnBurst(mouseX, mouseY, 20, 100);
          spawnTapParticles(mouseX, mouseY, 14, 70);
          gsap.to(chargeWrap, { scale: 2.5, opacity: 0, duration: 0.4, ease: 'power2.out' });
          gsap.fromTo(glow, { scale: '+=0' }, { scale: '*=1.7', opacity: 0.8, duration: 0.2, yoyo: true, repeat: 1 });
        },
      });
    };

    const handleMouseUp = () => {
      const heldFor = (performance.now() - holdStart) / 1000;
      isHolding     = false;
      holdTween?.kill();

      const scaleBack = currentVariant === 'default' ? 1 : currentVariant === 'text' ? 0 : 0.3;
      gsap.to(dot,  { scale: scaleBack, duration: 0.3, ease: 'back.out(2)' });
      gsap.to(glow, {
        scale:   currentVariant === 'default' ? 1   : 1.6,
        opacity: currentVariant === 'default' ? 0.25: 0.5,
        duration: 0.3,
      });

      // Proportional release burst scaled to hold duration
      if (heldFor < HOLD_DURATION) {
        gsap.to(chargeWrap, { opacity: 0, scale: 0.8, duration: 0.25, ease: 'power2.out' });
        const power = 22 + Math.min(heldFor / HOLD_DURATION, 1) * 45;
        const count = Math.round(6 + (heldFor / HOLD_DURATION) * 10);
        spawnBurst(mouseX, mouseY, count, power);
        spawnTapParticles(mouseX, mouseY, Math.round(count * 0.6), power * 0.6);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousemove', handleMagneticMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('mouseout', resetMagnetic, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleMagneticMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseout', resetMagnetic);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      holdTween?.kill();
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
            'radial-gradient(circle, rgba(99,102,241,0.38) 0%, rgba(139,92,246,0.18) 35%, rgba(59,130,246,0.08) 60%, transparent 75%)',
          filter: 'blur(32px)',
        }}
        aria-hidden="true"
      />

      {/* Smoke particle pool — gradient set per-particle at spawn time */}
      {Array.from({ length: SMOKE_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) smokeRefs.current[i] = el; }}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997] will-change-transform"
          style={{
            // placeholder overwritten in spawnSmoke()
            background:
              'radial-gradient(circle at 40% 40%, rgba(167,139,250,0.85) 0%, rgba(99,102,241,0.40) 45%, transparent 80%)',
            filter: 'blur(4px)',
          }}
          aria-hidden="true"
        />
      ))}

      {/* Hold-to-charge ring */}
      <div
        ref={chargeWrapRef}
        className="fixed top-0 left-0 w-11 h-11 pointer-events-none z-[9998] opacity-0 will-change-transform -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <svg width="44" height="44" viewBox="0 0 44 44" className="rotate-[-90deg]">
          <defs>
            <linearGradient id="chargeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#c4b5fd" />
              <stop offset="50%"  stopColor="#818cf8" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="2" />
          <circle
            ref={chargeRingRef}
            cx="22" cy="22" r="18"
            fill="none"
            stroke="url(#chargeGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 5px rgba(129,140,248,0.95))' }}
          />
        </svg>
      </div>

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