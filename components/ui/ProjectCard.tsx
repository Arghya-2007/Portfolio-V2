'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import type { Project } from '@/data/types';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isLive = project.status === 'live';
  const isInProgress = project.status === 'in-progress';

  const imageRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const motionPreference = useMotionPreference();

  const handleMouseEnter = () => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionPreference !== 'full' || !isFinePointer || isInProgress) return;

    gsap.to(imageRef.current, { scale: 1.1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });

    gsap.to(tagsRef.current?.children || [], {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    gsap.to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = () => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionPreference !== 'full' || !isFinePointer || isInProgress) return;

    gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });

    gsap.to(tagsRef.current?.children || [], {
      opacity: 0,
      y: 10,
      duration: 0.3,
      stagger: -0.05,
      ease: 'power2.in',
      overwrite: 'auto'
    });

    gsap.to(ctaRef.current, {
      opacity: 0,
      y: 15,
      duration: 0.4,
      ease: 'power3.in',
      overwrite: 'auto'
    });
  };

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionPreference === 'full' && isFinePointer && !isInProgress) {
      if (tagsRef.current?.children) {
        gsap.set(tagsRef.current.children, { opacity: 0, y: 10 });
      }
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 15 });
      }
    } else {
      if (tagsRef.current?.children) {
        gsap.set(tagsRef.current.children, { opacity: 1, y: 0 });
      }
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 1, y: 0 });
      }
    }
  }, [motionPreference, isInProgress]);

  return (
    <GlassCard
      as="article"
      aria-label={`Project: ${project.name}`}
      className={[
        'flex flex-col h-full relative overflow-hidden',
        motionPreference === 'full' && !isInProgress ? 'hover:scale-[1.02] hover:border-white/25 transition-all duration-300' : 'transition-all duration-300',
        isLive ? 'hover:shadow-glow-accent' : 'hover:shadow-glass-frosted',
      ].join(' ')}
    >
      <div
        className="absolute inset-0 z-0 h-full w-full pointer-events-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* We will attach events to a wrapper around content if GlassCard doesn't forward ref, but wait, onMouseEnter on an absolute div won't trigger if it's behind content. */}
      </div>

      <div
        className="absolute inset-0 z-0 h-48 opacity-10 pointer-events-none overflow-hidden rounded-t-3xl [mask-image:linear-gradient(to_bottom,white,transparent)]"
      >
        <div
          ref={imageRef}
          className="w-full h-full bg-gradient-to-br from-primary-500 via-accent-500 to-transparent transform origin-center"
        />
      </div>

      <div
        className="relative z-10 flex flex-col gap-4 h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="font-display text-lg font-semibold text-text-primary display-type leading-display">
            {project.name}
          </h3>

          <span
            aria-label={`Status: ${isLive ? 'Live' : 'In Progress'}`}
            className={[
              'font-mono text-xs px-2.5 py-0.5 rounded-pill border shrink-0',
              isLive
                ? 'border-accent-500/40 text-accent-400 bg-accent-500/8'
                : 'border-secondary-500/40 text-secondary-400 bg-secondary-600/8',
            ].join(' ')}
          >
            {isLive ? '● Live' : '○ Building'}
          </span>
        </div>

        <p className="font-body text-sm text-text-secondary leading-relaxed flex-grow">
          {project.description}
        </p>

        <ul
          ref={tagsRef}
          className="flex flex-wrap gap-2 list-none m-0 p-0"
          aria-label={`Tech stack for ${project.name}`}
        >
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="font-mono text-xs text-text-muted border border-white/10 px-2 py-0.5 rounded-lg bg-white/3"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div ref={ctaRef} className="flex flex-wrap gap-3 mt-auto pt-2">
          {isInProgress ? (
            <span
              className="font-mono text-xs text-secondary-400/70 flex items-center gap-1.5"
              aria-label="This project is currently in progress and not yet publicly available"
            >
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-secondary-400/60 animate-pulse inline-block" />
              In progress — coming soon
            </span>
          ) : (
            <>
              <GlassButton
                href={`/work/${project.slug}`}
                variant="secondary"
                size="sm"
                aria-label={`View case study for ${project.name}`}
              >
                Case Study
              </GlassButton>

              {project.liveUrl && (
                <GlassButton
                  href={project.liveUrl}
                  variant="secondary"
                  size="sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.name} live site (opens in new tab)`}
                >
                  Live ↗
                </GlassButton>
              )}
            </>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
