// data/skills.ts
// Skill categories — sourced verbatim from /docs/ProfileContent.md §4.
// Groupings, names, and ordering match the source exactly.
// Do NOT add or remove individual skills without updating ProfileContent.md first.

import type { SkillCategory } from './types';

export const skills: SkillCategory[] = [
  {
    title: 'Full Stack Web',
    emoji: '🌐',
    skills: [
      'React.js',
      'Next.js',
      'Node.js',
      'Express.js',
      'TypeScript',
      'Tailwind CSS',
      'REST API',
      'Postman',
    ],
    status: 'core',
  },
  {
    title: 'Databases & Backend Infra',
    emoji: '🗄️',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Supabase'],
    status: 'core',
  },
  {
    title: 'Mobile & App Dev',
    emoji: '📱',
    skills: ['Flutter', 'Kotlin', 'Dart', 'Firebase', 'Android'],
    status: 'core',
  },
  {
    title: 'System Design & Architecture',
    emoji: '🏗️',
    skills: [
      'Microservices',
      'WebSockets',
      'Message Queues',
      'Load Balancing',
      'Scalable Architecture',
    ],
    status: 'core',
  },
  {
    // Visual distinction required per Features.md §4 — dashed border / progress ring
    title: 'Cloud · DevOps · AI Infra',
    emoji: '☁️',
    skills: [
      'AWS',
      'GCP',
      'Docker',
      'Kubernetes',
      'Terraform',
      'GitHub Actions',
      'Nginx',
      'MLOps',
      'Linux',
    ],
    status: 'acquiring',
  },
  {
    title: 'Tools & Workflow',
    emoji: '🔧',
    skills: ['Git', 'GitHub', 'IntelliJ IDE', 'Postman', 'Figma', 'Notion'],
    status: 'core',
  },
];
