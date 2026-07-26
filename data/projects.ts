// data/projects.ts
// Project data — sourced verbatim from /docs/ProfileContent.md §5.
// Facts (stack, URLs, status) are exact. Creative framing is deferred to Phase 3 copywriting.
// Case study content is Phase 6 scope — left undefined here per Phases.md.

import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'dd-tours-travels',
    name: 'DD Tours & Travels',
    description:
      'Full Stack Travel Booking Platform with real-time listings, user flows & booking system',
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'REST APIs', 'AWS'],
    liveUrl: 'https://ddtours.in',
    status: 'live',
    featured: true,
    caseStudy: {
      problem:
        'Booking friction and lack of a seamless end-to-end travel platform. Users faced fragmented experiences when trying to book complex travel itineraries.',
      approach:
        'Choosing Next.js for SSR SEO benefits and fast initial load, PostgreSQL for transactional integrity in bookings, and AWS for scalable deployment.',
      solution:
        'A full-stack travel booking platform with real-time listings, seamless user flows, and an integrated booking system built on a robust REST API backend.',
      screenshots: [
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop', // Travel/Booking placeholder
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1600&auto=format&fit=crop', // Travel placeholder
      ],
    },
  },
  {
    slug: 'equilens',
    name: 'EquiLens — AI Bias Detector',
    description:
      'AI-powered system to detect, visualize and explain bias in text & datasets',
    stack: ['React', 'Python', 'Google Cloud', 'Vertex AI'],
    liveUrl: 'https://equilens-e21e9.web.app',
    status: 'live',
    featured: true,
    caseStudy: {
      problem:
        'Lack of visibility into dataset bias and biased model outputs, leading to unfair or skewed AI models in production.',
      approach:
        'Using Vertex AI pipelines to parse datasets securely and an intuitive React frontend to visually map and highlight bias hotspots.',
      solution:
        'An AI-powered system that detects, visualizes, and explains bias within text and datasets, enabling developers to build fairer models.',
      screenshots: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop', // Data/Graph placeholder
      ],
    },
  },
  {
    slug: 'ai-notes-app',
    name: 'AI Notes App',
    description:
      'Smart student notes manager — AI-assisted tagging, summarization & search',
    stack: ['Flutter', 'Firebase', 'LLM'],
    liveUrl: undefined,
    status: 'in-progress',
    featured: true,
    caseStudy: {
      problem:
        'Note-taking is passive, and finding specific information across many notes is inefficient and time-consuming for students.',
      approach:
        'Integrating an LLM with a cross-platform Flutter app to automatically tag, summarize, and conceptually search notes.',
      solution: '',
      screenshots: [],
    },
  },
];
