// data/types.ts
// Central type definitions for all portfolio content shapes.
// All interfaces are consumed by /data/*.ts and imported into components in Phase 2+.

// ---------------------------------------------------------------------------
// Social Links
// ---------------------------------------------------------------------------

export interface SocialLink {
  /** Human-readable platform name, e.g. "GitHub" */
  platform: string;
  url: string;
  /** Icon key — maps to a lucide-react or custom icon in Phase 2 components */
  iconKey: 'github' | 'linkedin' | 'instagram' | 'facebook' | 'mail';
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface WhoAmI {
  role: string;
  building: string[];
  learning: string[];
  goalBy2027: string;
}

export interface Profile {
  name: string;
  tagline: string;
  location: string;
  /** Status line shown in hero / about / contact (e.g. badge text) */
  status: string;
  institute: string;
  /** Core belief / signature pull-quote */
  belief: string;
  /** README-style footer flavor line */
  footerQuote: string;
  /** Roadmap North Star quote (can differ from belief) */
  roadmapQuote: string;
  whoAmI: WhoAmI;
  socials: SocialLink[];
  // TODO: confirm with Arghya — preferred contact email for the contact form
  email: string | undefined;
  // TODO: confirm with Arghya — resume/CV PDF URL for "Download Resume" CTA
  resumeUrl: string | undefined;
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export type SkillStatus = 'core' | 'acquiring';

export interface SkillCategory {
  title: string;
  /** Emoji used as a visual icon for the category header */
  emoji: string;
  skills: string[];
  /** 'acquiring' categories get a distinct visual treatment (dashed border / progress ring) */
  status: SkillStatus;
}

// ---------------------------------------------------------------------------
// Projects & Case Studies
// ---------------------------------------------------------------------------

export interface CaseStudyContent {
  problem: string;
  approach: string;
  solution: string;
  /** Relative paths under /public/images/projects/ or absolute URLs */
  screenshots: string[];
  results?: string[];
}

export type ProjectStatus = 'live' | 'in-progress';

export interface Project {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  liveUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  // TODO: Phase 6 — build full case study content (problem/approach/solution/screenshots/results)
  caseStudy?: CaseStudyContent;
}

// ---------------------------------------------------------------------------
// Timeline / Roadmap
// ---------------------------------------------------------------------------

export type TimelineStatus = 'done' | 'in-progress' | 'planned' | 'north-star';

export interface TimelineEntry {
  year: number;
  status: TimelineStatus;
  items: string[];
}

// ---------------------------------------------------------------------------
// GitHub Stats (optional — stretch feature, Features.md §8)
// ---------------------------------------------------------------------------

export interface GithubStat {
  label: string;
  value: string | number;
}
