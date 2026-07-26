'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useScrollAnimation, useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import type { Project } from '@/data/types';
import SectionHeading from '@/components/ui/SectionHeading';
import ScreenshotGallery from '@/components/ui/ScreenshotGallery';

interface CaseStudyContentProps {
  project: Project;
}

export default function CaseStudyContent({ project }: CaseStudyContentProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Apply reduced motion fallback
  useReducedScrollReveal(containerRef);

  // Apply GSAP scroll animations for full motion
  useScrollAnimation(containerRef, () => {
    // Reveal each section as it scrolls into view
    const sections = gsap.utils.toArray('.case-study-section', containerRef.current);
    sections.forEach((section: unknown) => {
      const el = section as HTMLElement;
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        }
      );
    });
  });

  if (!project.caseStudy) {
    return (
      <main
        ref={containerRef}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        aria-label={`${project.name} case study content`}
      >
        <div
          role="note"
          aria-label="Case study content placeholder"
          className="border border-dashed border-white/20 rounded p-8 text-center reveal-hidden case-study-section"
        >
          <p className="font-mono text-sm text-text-muted mb-2">
            Full case study coming soon.
          </p>
          <p className="font-body text-xs text-text-muted">
            Content for <strong className="text-text-secondary">{project.name}</strong> is
            being written — check back after Phase 6.
          </p>
        </div>
      </main>
    );
  }

  const { problem, approach, solution, screenshots, results } = project.caseStudy;

  return (
    <main
      ref={containerRef}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-24"
      aria-label={`${project.name} case study content`}
    >
      {problem && (
        <section className="reveal-hidden case-study-section">
          <SectionHeading number="01" label="Problem" heading="The Challenge" />
          <div className="font-body text-base text-text-secondary leading-relaxed max-w-3xl">
            <p>{problem}</p>
          </div>
        </section>
      )}

      {approach && (
        <section className="reveal-hidden case-study-section">
          <SectionHeading number="02" label="Approach" heading="Technical Decisions" />
          <div className="font-body text-base text-text-secondary leading-relaxed max-w-3xl">
            <p>{approach}</p>
          </div>
        </section>
      )}

      {solution && (
        <section className="reveal-hidden case-study-section">
          <SectionHeading number="03" label="Solution" heading="What was Shipped" />
          <div className="font-body text-base text-text-secondary leading-relaxed max-w-3xl">
            <p>{solution}</p>
          </div>
          <ScreenshotGallery images={screenshots} projectName={project.name} />
        </section>
      )}

      {results && results.length > 0 && (
        <section className="reveal-hidden case-study-section">
          <SectionHeading number="04" label="Results" heading="Impact & Outcomes" />
          <ul className="list-disc list-inside font-body text-base text-text-secondary leading-relaxed max-w-3xl space-y-2">
            {results.map((result, i) => (
              <li key={i}>{result}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
