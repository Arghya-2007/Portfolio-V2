// app/work/[slug]/page.tsx
// Phase 2 — Static case-study route.
// generateStaticParams() sources slugs from data/projects.ts (SSG).
// Phase 6 will build the full case-study content; for now renders:
//   - project name, description, stack, status, live link (if present)
//   - placeholder block for projects without caseStudy content (all of them at Phase 2)
// Not-found projects redirect to a clear 404-style message (project not in data).

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import CaseStudyContent from './CaseStudyContent';
import type { Metadata } from 'next';

// ---------------------------------------------------------------------------
// generateStaticParams — tell Next.js which slugs to pre-render at build time.
// Sourced entirely from data/projects.ts — no hardcoded slugs.
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// ---------------------------------------------------------------------------
// Metadata — basic page title per project for SEO (full pass in Phase 9).
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.name} — Case Study | Arghya Pal`,
    description: project.description,
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const projectIndex = projects.findIndex((p) => p.slug === params.slug);
  const project = projects[projectIndex];

  // If slug doesn't match any project in data, return 404.
  if (!project || projectIndex === -1) {
    notFound();
  }

  const nextProject = projects[(projectIndex + 1) % projects.length];

  const isLive = project.status === 'live';

  return (
    <div className="min-h-screen pt-14">
      {/* Back navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <Link
          href="/#projects"
          className="font-mono text-xs text-text-muted hover:text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-colors"
          aria-label="Back to all projects"
        >
          ← Back to Projects
        </Link>
      </div>

      {/* Hero banner */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-white/10">
        <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">
          Case Study
        </p>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
          {project.name}
        </h1>

        <p className="font-body text-base text-text-secondary mb-6 max-w-2xl">
          {project.description}
        </p>

        {/* Stack tags */}
        <ul
          className="flex flex-wrap gap-2 list-none m-0 p-0 mb-6"
          aria-label="Tech stack"
        >
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="font-mono text-xs text-text-muted border border-white/10 px-2.5 py-1 rounded"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Status + live link */}
        <div className="flex flex-wrap items-center gap-4">
          <span
            aria-label={`Status: ${isLive ? 'Live' : 'In Progress'}`}
            className={`font-mono text-xs px-2.5 py-1 rounded border ${
              isLive
                ? 'border-emerald-500/40 text-emerald-400'
                : 'border-amber-500/40 text-amber-400'
            }`}
          >
            {isLive ? '● Live' : '● Building'}
          </span>

          {isLive && project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-text-secondary hover:text-text-primary border border-white/20 px-4 py-1.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-colors"
              aria-label={`Visit ${project.name} live (opens in new tab)`}
            >
              Visit Live Site ↗
            </a>
          )}
        </div>
      </header>

      {/* Case study body */}
      <CaseStudyContent project={project} />

      {/* Next Project Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10 text-right">
        <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
          Next Project
        </p>
        <Link
          href={`/work/${nextProject.slug}`}
          className="group inline-flex items-center gap-2 font-display text-xl sm:text-2xl font-bold text-text-primary hover:text-primary-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 rounded"
        >
          {nextProject.name}
          <span className="text-primary-500 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </footer>
    </div>
  );
}
