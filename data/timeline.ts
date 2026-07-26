// data/timeline.ts
// Roadmap / Journey timeline — sourced verbatim from /docs/ProfileContent.md §6.
// Status values map directly to ProfileContent.md status icons:
//   ✅  → 'done'
//   🔄  → 'in-progress'
//   🎯  → 'planned'
//   🏁  → 'north-star'
// Item text is taken verbatim from the roadmap block. Do not paraphrase.

import type { TimelineEntry } from './types';

export const timeline: TimelineEntry[] = [
  {
    year: 2025,
    status: 'done',
    items: [
      'Full Stack Web Dev  (React, Next.js, Node.js, Databases)',
      'Mobile App Dev      (Flutter, Kotlin, Firebase)',
      'System Design Fundamentals',
    ],
  },
  {
    year: 2026,
    status: 'in-progress',
    items: [
      'Cloud Engineering   (AWS / GCP)',
      'DevOps              (Docker, K8s, CI/CD, GitHub Actions)',
      'Infrastructure as Code',
    ],
  },
  {
    year: 2027,
    status: 'planned',
    items: [
      'MLOps               (Model Pipelines, Monitoring, Drift Detection)',
      'AI Infrastructure   (GPU Clusters, Serving, Vector DBs)',
      'Automation Systems',
    ],
  },
  {
    year: 2028,
    status: 'north-star',
    items: [
      'Deploy & Scale AI Systems in Production.',
      'Full ownership: from model to infra to monitoring.',
    ],
  },
];
