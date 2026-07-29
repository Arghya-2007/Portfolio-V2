'use client';

// Phase 3 — Visual Design.
// Phase 4 — Client Component. GSAP scroll reveal + Lenis parallax added.
// Phase 6 — Premium Upgrade: TerminalCard, StatCard, BeliefQuote, Master Timeline, Ambient Particles.
// Background: bg-1.jpg (cool tone, alternates with Hero warm).

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { profile } from '@/data/profile';
import { githubStats } from '@/data/githubStats';
import { MapPin, GraduationCap, FolderGit2, Star } from 'lucide-react';

import SectionHeading from '@/components/ui/SectionHeading';
import TerminalCard from './about/TerminalCard';
import StatCard from './about/StatCard';
import BeliefQuote from './about/BeliefQuote';

import { useScrollAnimation, useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';
import { useDeviceTier, RENDER_QUALITY } from '@/lib/hooks/useDeviceTier';

function buildStats(p: typeof profile, gh: typeof githubStats) {
  const reposStat = gh.find(s => s.label.toLowerCase().includes('repos'))?.value || 0;
  const starsStat = gh.find(s => s.label.toLowerCase().includes('stars'))?.value || 0;

  return [
    { label: 'Repositories', value: reposStat, icon: FolderGit2 },
    { label: 'Total Stars', value: starsStat, icon: Star },
    { label: 'Location', value: p.location, icon: MapPin },
    { label: 'Institute', value: 'Techno Main', icon: GraduationCap },
  ] as const;
}

function AmbientParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const motionPreference = useMotionPreference();
  const [particles, setParticles] = useState<{ top: string; left: string }[]>([]);

  useEffect(() => {
    // Generate positions only on the client to avoid hydration mismatches
    setParticles(
      Array.from({ length: 6 }).map(() => ({
        top: `${10 + Math.random() * 80}%`,
        left: `${10 + Math.random() * 80}%`,
      }))
    );
  }, []);

  useScrollAnimation(containerRef, (ctx, el) => {
    if (motionPreference !== 'full') return;

    const particleElements = el.querySelectorAll('.ambient-particle');
    particleElements.forEach((p, i) => {
      // Random starting positions and durations
      gsap.to(p, {
        x: `random(-80, 80)`,
        y: `random(-80, 80)`,
        opacity: `random(0.1, 0.4)`,
        scale: `random(0.8, 1.5)`,
        duration: `random(5, 10)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.5
      });
    });
  }, [particles.length]); // Add dependency so GSAP runs after particles are rendered

  if (motionPreference !== 'full' || particles.length === 0) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {particles.map((pos, i) => (
        <div
          key={i}
          className="ambient-particle absolute w-1 h-1 rounded-full bg-accent-400 shadow-[0_0_12px_2px_rgba(45,212,191,0.6)]"
          style={{
            top: pos.top,
            left: pos.left,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function About() {
  const stats = buildStats(profile, githubStats);
  const containerRef = useRef<HTMLElement>(null);
  const motionPreference = useMotionPreference();
  // Device tier — drives section background image quality.
  const deviceTier = useDeviceTier();
  const quality = RENDER_QUALITY[deviceTier];

  useScrollAnimation(containerRef, (ctx, el) => {
    if (motionPreference !== 'full') return;

    // Use an independent ScrollTrigger for About section text
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      }
    });

    // Reveal section heading
    tl.fromTo(
      '.about-heading-reveal',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      0 // absolute start 0
    );

    // Reveal bio paragraphs
    tl.fromTo(
      '.about-bio-reveal',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15 },
      0.2
    );

    // Parallax background (desktop only)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.to('[data-parallax-bg]', {
        y: '-20%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });
  });

  useReducedScrollReveal(containerRef);
  const fallbackRevealClass = motionPreference !== 'full' ? 'reveal-hidden' : '';

  return (
    <section
      ref={containerRef}
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden"
    >
      {/* Background image — cool tone */}
      {/* Standard tier: quality 75 (unchanged). High tier: 85. */}
      <Image
        src="/images/bg/bg-4.webp"
        alt=""
        aria-hidden="true"
        fill
        quality={quality.imageQualitySection}
        className="object-cover object-center"
        sizes="100vw"
        data-parallax-bg
      />

      {/* Section overlay */}
      <div className="section-bg-overlay" aria-hidden="true" />

      {/* Ambient background energy */}
      <AmbientParticles />

      {/* Content */}
      <div className="section-content-layer section-py px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className={`about-heading-reveal ${fallbackRevealClass}`}>
            <SectionHeading
              number="01"
              label="About"
              heading="Who Am I"
              id="about-heading"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch mt-8 lg:mt-12">

            {/* Left Column: Bio + Quote */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-12 relative z-10">
              <div className="space-y-6">
                <p className={`about-bio-reveal font-body text-fluid-body text-text-secondary leading-body ${fallbackRevealClass}`}>
                  <span className="font-semibold text-text-primary">
                    {profile.whoAmI.role[0]}
                  </span>
                  {' '}based in{' '}
                  <span className="text-accent-400">{profile.location}</span>.
                </p>
                <p className={`about-bio-reveal font-body text-fluid-body text-text-secondary leading-body ${fallbackRevealClass}`}>
                  I specialize in full-stack development and am currently focused on cloud engineering and system architecture.
                  My ultimate goal is to bridge the gap between AI models and reliable production infrastructure.
                </p>
              </div>

              <div className="mt-auto pb-12 lg:pb-20">
                <BeliefQuote quote={profile.belief} />
              </div>
            </div>

            {/* Right Column: Terminal Card */}
            <div className="lg:col-span-7 relative z-10">
              <TerminalCard />
            </div>

          </div>

          {/* Bottom Section: Stat Cards */}
          <div className="mt-16 lg:mt-24 relative z-10">
            <p className={`about-heading-reveal font-mono text-xs text-text-muted uppercase tracking-widest mb-6 ${fallbackRevealClass}`}>
              At a Glance
            </p>
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  delay={i * 0.1}
                />
              ))}
            </dl>
          </div>

        </div>
      </div>
    </section>
  );
}
