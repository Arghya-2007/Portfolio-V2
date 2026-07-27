// components/sections/Hero.tsx
'use client';

// Phase 3 — Visual Design.
// Phase 4 — Client Component. GSAP entrance animations + Lenis parallax added.
// Background: bg-1.jpg (warm abstract render) with gradient overlay.
// next/image with priority (above-the-fold critical image).
// H1: fluid clamp size, display-type letter-spacing, text-gradient on name.
// CTAs: GlassButton (primary + secondary variants).

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { profile } from '@/data/profile';
import GlassButton from '@/components/ui/GlassButton';
import MagneticWrapper from '@/components/ui/MagneticWrapper';
import RotatingText from '@/components/ui/RotatingText';
import { useScrollAnimation, useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import { splitText, revertSplit } from '@/lib/gsap/splitText';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';
import { useHeadlineHoverEffects } from '@/lib/gsap/useHeadlineHoverEffects';
import HeroScene from '@/components/three/HeroScene';
import HeroLoadingScreen from '@/components/three/HeroLoadingScreen';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const motionPreference = useMotionPreference();
  const [isModelReady, setIsModelReady] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check WebGL and Mobile on mount
  useEffect(() => {
    // Simple canvas check
    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
    
    // Explicit mobile gate for Hero 3D (saves bandwidth/battery on phones)
    const mobileQuery = window.matchMedia('(max-width: 767px) and (pointer: coarse)');
    setIsMobile(mobileQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileQuery.addEventListener('change', listener);
    return () => mobileQuery.removeEventListener('change', listener);
  }, []);

  const isHero3DMode = motionPreference === 'full' && hasWebGL && !isMobile;

  // Headline Hover Effects (Gradient Shift + Explode)
  useHeadlineHoverEffects(h1Ref, isModelReady);

  // 1. Handle GSAP Parallax and Scroll Exits (runs once, completely decoupled from loading state)
  useScrollAnimation(containerRef, (ctx, el) => {
    // Parallax background (desktop only)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.to('[data-parallax-bg]', {
        y: '-25%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // 3D canvas overlay fades and scales down as hero scrolls out
      gsap.to('[data-hero-canvas]', {
        scale: 0.9,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });
  }); // Empty deps, runs once

  // 2. Entrance Timelines (runs once, pauses until model ready)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isHero3DMode) return;

    const ctx = gsap.context(() => {
      const tagline = taglineRef.current;
      const h1El = h1Ref.current;
      const statusLine = el.querySelector('.hero-status p');
      
      if (!tagline || !h1El || !statusLine) return;

      const h1Split = splitText(h1El, { type: 'character' });
      const statusSplit = splitText(statusLine as HTMLElement, { type: 'character' });
      
      // We will append a cursor element for typewriter
      const cursor = document.createElement('span');
      cursor.textContent = '|';
      cursor.style.display = 'inline-block';
      cursor.style.opacity = '1';
      cursor.style.marginLeft = '2px';
      cursor.style.animation = 'blink 1s step-end infinite';
      statusLine.appendChild(cursor);

      // Create a style element for the blink animation if it doesn't exist
      if (!document.getElementById('typewriter-blink')) {
        const style = document.createElement('style');
        style.id = 'typewriter-blink';
        style.innerHTML = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
        document.head.appendChild(style);
      }

      // Add particles container
      const particlesContainer = document.createElement('div');
      particlesContainer.style.position = 'absolute';
      particlesContainer.style.inset = '0';
      particlesContainer.style.pointerEvents = 'none';
      particlesContainer.style.zIndex = '10'; // Above text
      h1El.appendChild(particlesContainer);

      const tl = gsap.timeline({ paused: true });
      tlRef.current = tl;

      // Set initial states explicitly to hide elements immediately on mount
      gsap.set('.hero-status', { opacity: 1 }); // We fade this container in, but its characters are hidden initially
      if (statusSplit.chars.length > 0) {
        gsap.set(statusSplit.chars, { opacity: 0 });
      }
      
      if (tagline) {
        gsap.set(tagline, { opacity: 0, y: 15, scale: 1.05, filter: 'blur(8px)' });
      }
      
      if (h1Split.chars.length > 0) {
        gsap.set(h1Split.chars, { 
          opacity: 0, 
          y: () => gsap.utils.random(-40, 40), 
          rotation: () => gsap.utils.random(-15, 15), 
          filter: 'blur(10px)',
          scale: () => gsap.utils.random(0.8, 1.2)
        });
      }
      
      gsap.set('.hero-reveal-up', { opacity: 0, y: 20 });
      gsap.set('[data-hero-canvas-wrapper]', { opacity: 0, scale: 0.85 });

      // Add entrance animations to the paused timeline
      tl.fromTo(
        '[data-hero-canvas-wrapper]',
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
        0
      );

      // 0.2: Typewriter Effect
      if (statusSplit.chars.length > 0) {
        tl.to(statusSplit.chars, {
          opacity: 1,
          duration: 0.01,
          stagger: 0.04,
          ease: 'none',
        }, 0.2);
        
        tl.set(cursor, { display: 'none' }, ">"); // Hide cursor after stagger completes
      }

      // 0.6: Crazy Text Reveal for H1
      if (h1Split.chars.length > 0) {
        tl.to(
          h1Split.chars,
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            filter: 'blur(0px)',
            scale: 1,
            duration: 0.8,
            ease: 'expo.out',
            stagger: { amount: 0.4, from: "random" } // slight randomized stagger
          },
          0.6
        );

        // Particle Burst during H1 reveal
        // Spawn 2 particles per character
        const particles: HTMLElement[] = [];
        const colors = ['#67D8F9', '#FF8A65'];
        h1Split.chars.forEach((char) => {
           for (let i = 0; i < 2; i++) {
             const p = document.createElement('div');
             p.style.position = 'absolute';
             p.style.width = '4px';
             p.style.height = '4px';
             p.style.borderRadius = '50%';
             p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
             
             // Initial position relative to character
             const charRect = char.getBoundingClientRect();
             const h1Rect = h1El.getBoundingClientRect();
             
             const charCenterX = charRect.left - h1Rect.left + charRect.width / 2;
             const charCenterY = charRect.top - h1Rect.top + charRect.height / 2;
             
             p.style.left = `${charCenterX}px`;
             p.style.top = `${charCenterY}px`;
             p.style.opacity = '0';
             
             particlesContainer.appendChild(p);
             particles.push(p);
           }
        });
        
        // Animate particles outward
        tl.fromTo(particles, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0
        }, {
          opacity: 0,
          scale: 0,
          x: () => gsap.utils.random(-60, 60),
          y: () => gsap.utils.random(-60, 60),
          duration: () => gsap.utils.random(0.4, 0.8),
          ease: 'power2.out',
          stagger: { amount: 0.4, from: "random" },
          onComplete: () => {
             if (particlesContainer.parentNode) particlesContainer.remove(); // Cleanup
          }
        }, 0.6);
      }

      // 1.2: Tagline
      if (tagline) {
        tl.to(
          tagline,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out'
          },
          1.2
        );
      }

      // 1.2: CTAs rise in
      tl.to(
        '.hero-reveal-up',
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1
        },
        1.2
      );

      return () => {
        // revertSplit(tagline); // Removed because we don't split it anymore
        revertSplit(h1El);
        revertSplit(statusLine as HTMLElement);
        if (cursor.parentNode) cursor.remove();
        if (particlesContainer.parentNode) particlesContainer.remove();
      };
    }, el);

    return () => ctx.revert();
  }, [isHero3DMode]);

  // Play timeline when model is ready
  useEffect(() => {
    if (isModelReady && tlRef.current) {
      tlRef.current.play();
    }
  }, [isModelReady]);

  // Fallback for reduced motion or mobile view
  useReducedScrollReveal(containerRef);

  // Helper class for fallback reveal logic
  const fallbackRevealClass = !isHero3DMode ? 'reveal-hidden' : '';

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="Hero — introduction"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background image — priority loaded (above fold) */}
      <Image
        src="/images/bg/bg-2.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        quality={85}
        className="object-cover object-center"
        sizes="100vw"
        data-parallax-bg
      />

      {/* Gradient overlay — ensures WCAG AA contrast on all text */}
      <div className="section-bg-overlay" aria-hidden="true" />

      {/* Loading Screen Overlay */}
      {isHero3DMode && (
        <HeroLoadingScreen isVisible={!isModelReady} />
      )}

      {/* Full-section transparent 3D canvas — sits between bg image and text */}
      <HeroScene onModelLoaded={() => setIsModelReady(true)} />

      {/* Hero content — z-index above overlay */}
      <div className="section-content-layer relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center mt-16 lg:mt-24">

          {/* Status badge — mono micro-copy */}
          <div className={`hero-status inline-flex items-center gap-2 mb-8 ${fallbackRevealClass}`}>
            <span
              className="block w-2 h-2 rounded-full bg-accent-400 animate-pulse"
              aria-hidden="true"
            />
            <p className="font-mono text-xs text-accent-400 uppercase tracking-widest">
              {profile.status}
            </p>
          </div>

          {/* H1 — single heading for entire site */}
          <div className="relative group">
            <h1
              ref={h1Ref}
              className={`font-display font-bold text-fluid-h1 display-type text-text-primary mb-4 ${fallbackRevealClass}`}
              style={{
                // For the glow effect:
                '--glow-opacity': 0,
                position: 'relative',
              } as React.CSSProperties}
            >
              {/* Glow Overlay */}
              {motionPreference === 'full' && (
                <div
                  className="pointer-events-none absolute z-10 transition-opacity duration-300"
                  style={{
                    top: '-150px', left: '-150px', right: '-150px', bottom: '-150px',
                    opacity: 'var(--glow-opacity)',
                    background: 'radial-gradient(circle 120px at calc(var(--mouse-x, 50%) + 150px) calc(var(--mouse-y, 50%) + 150px), rgba(255,255,255,0.15) 0%, transparent 100%)',
                    mixBlendMode: 'color-dodge',
                  }}
                  aria-hidden="true"
                />
              )}
              {/* Gradient accent on first name — the "energetic focal point" (Design.md §5) */}
              <span className="text-gradient relative z-20">{profile.name.split(' ')[0]}</span>
              {' '}
              <span className="relative z-20">{profile.name.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>

          {/* Role tagline */}
          <p ref={taglineRef} className={`font-body text-xl sm:text-2xl text-text-secondary mb-5 max-w-2xl leading-display ${fallbackRevealClass}`}>
            <RotatingText roles={profile.whoAmI.role} />
          </p>

          {/* Full tagline / one-liner */}
          <p className={`hero-reveal-up font-body text-fluid-body text-text-muted mb-10 max-w-xl leading-body ${fallbackRevealClass}`}>
            {profile.tagline}
          </p>

          {/* Belief pull-quote */}
          <blockquote className={`hero-reveal-up border-l-2 border-primary-500/40 pl-5 mb-12 max-w-lg ${fallbackRevealClass}`}>
            <p className="font-mono text-sm text-text-secondary italic leading-relaxed">
              &ldquo;{profile.belief}&rdquo;
            </p>
          </blockquote>

          {/* CTA row — GlassButton primary + secondary */}
          <div className={`hero-reveal-up flex flex-wrap gap-4 items-center ${fallbackRevealClass}`}>
            {/* Primary CTA */}
            <MagneticWrapper strength={20}>
              <GlassButton
                href="#projects"
                variant="primary"
                size="lg"
                aria-label="View Projects"
              >
                View Projects
                <span aria-hidden="true" className="ml-1">→</span>
              </GlassButton>
            </MagneticWrapper>

            {/*
              Secondary CTA — Resume or Contact fallback.
              resumeUrl is undefined per profile.ts; Contact shown as fallback.
            */}
            {profile.resumeUrl ? (
              <MagneticWrapper strength={20}>
                <GlassButton
                  href={profile.resumeUrl}
                  variant="secondary"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download resume (opens in new tab)"
                >
                  Resume ↗
                </GlassButton>
              </MagneticWrapper>
            ) : (
              <MagneticWrapper strength={20}>
                <GlassButton
                  href="#contact"
                  variant="secondary"
                  size="lg"
                  aria-label="Get in touch"
                >
                  Get in Touch
                </GlassButton>
              </MagneticWrapper>
            )}
          </div>

          {/* Scroll indicator — purely visual, aria-hidden */}
          <div className={`hero-reveal-up mt-16 flex items-center gap-3 ${fallbackRevealClass}`} aria-hidden="true">
            <div className="h-px w-8 bg-text-muted/40" />
            <p className="font-mono text-xs text-text-muted">scroll to explore</p>
          </div>
          </div>

        </div>
      </div>
    </section>
  );
}
