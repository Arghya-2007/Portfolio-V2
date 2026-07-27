// components/sections/Projects.tsx
'use client';

// Phase 3 — Visual Design.
// Phase 4 — Client Component. GSAP scroll reveal + Lenis parallax added.
// Background: bg-4.jpg (cool tone, alternates from Skills warm).
// SectionHeading replaces inline pattern.
// ProjectCard now renders inside GlassCard (handled in ProjectCard itself).

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { useScrollAnimation, useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const motionPreference = useMotionPreference();

  useScrollAnimation(containerRef, (ctx, el) => {
    // Reveal section heading
    gsap.fromTo(
      '.projects-heading-reveal',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );

    // Stagger reveal project cards
    gsap.fromTo(
      '.project-card-reveal',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 85%',
        }
      }
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
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden"
    >
      {/* Background image — cool tone */}
      <Image
        src="/images/bg/bg-1.webp"
        alt=""
        aria-hidden="true"
        fill
        quality={75}
        className="object-cover object-center"
        sizes="100vw"
        data-parallax-bg
      />

      <div className="section-bg-overlay" aria-hidden="true" />

      <div className="section-content-layer section-py px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className={`projects-heading-reveal ${fallbackRevealClass}`}>
            <SectionHeading
              number="03"
              label="Projects"
              heading="Selected Work"
              subheading="Things I've built — shipped, in progress, or proving a concept."
              id="projects-heading"
            />
          </div>

          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.slug} className={`project-card-reveal ${fallbackRevealClass}`}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
