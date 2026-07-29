// data/skills.ts
// Skill categories — sourced verbatim from /docs/ProfileContent.md §4.
// Groupings, names, and ordering match the source exactly.
// Do NOT add or remove individual skills without updating ProfileContent.md first.
//
// Each Skill entry:
//   iconType: 'simple-icons' → uses the npm package `simple-icons` (brand SVGs, slug = iconKey)
//   iconType: 'lucide'       → uses lucide-react (abstract concepts with no brand logo)
//   brandHex                 → simple-icons brand color (no #), used for hover glow
//   description              → honest 1-line factual description of the technology

import type { SkillCategory } from './types';

export const skills: SkillCategory[] = [
  {
    title: 'Full Stack Web',
    emoji: '🌐',
    status: 'core',
    skills: [
      {
        name: 'React.js',
        iconKey: 'react',
        iconType: 'simple-icons',
        brandHex: '61DAFB',
        description: 'UI component library for building interactive web interfaces',
      },
      {
        name: 'Next.js',
        iconKey: 'nextdotjs',
        iconType: 'simple-icons',
        brandHex: 'FFFFFF',
        description: 'React framework powering DD Tours & Travels and this portfolio',
      },
      {
        name: 'Node.js',
        iconKey: 'nodedotjs',
        iconType: 'simple-icons',
        brandHex: '339933',
        description: 'JavaScript runtime for server-side logic and REST API servers',
      },
      {
        name: 'Express.js',
        iconKey: 'express',
        iconType: 'simple-icons',
        brandHex: 'FFFFFF',
        description: 'Minimal Node.js framework for building REST API backends',
      },
      {
        name: 'TypeScript',
        iconKey: 'typescript',
        iconType: 'simple-icons',
        brandHex: '3178C6',
        description: 'Typed superset of JavaScript used across all projects',
      },
      {
        name: 'Tailwind CSS',
        iconKey: 'tailwindcss',
        iconType: 'simple-icons',
        brandHex: '06B6D4',
        description: 'Utility-first CSS framework for rapid UI development',
      },
      {
        name: 'REST API',
        iconKey: 'Globe',
        iconType: 'lucide',
        description: 'HTTP-based API pattern used in DD Tours & EquiLens backends',
      },
      {
        name: 'Postman',
        iconKey: 'postman',
        iconType: 'simple-icons',
        brandHex: 'FF6C37',
        description: 'API testing and documentation tool for backend development',
      },
    ],
  },
  {
    title: 'Databases & Backend Infra',
    emoji: '🗄️',
    status: 'core',
    skills: [
      {
        name: 'PostgreSQL',
        iconKey: 'postgresql',
        iconType: 'simple-icons',
        brandHex: '4169E1',
        description: 'Relational database powering the DD Tours & Travels backend',
      },
      {
        name: 'MySQL',
        iconKey: 'mysql',
        iconType: 'simple-icons',
        brandHex: '4479A1',
        description: 'Relational database powering the EquiLens backend',
      },
      {
        name: 'AWS Arora',
        iconKey: 'amazonaws',
        iconType: 'simple-icons',
        brandHex: 'FF9900',
        description: 'Relational database powering the EquiLens backend',
      },
      {
        name: 'BigQuery',
        iconKey: 'googlecloud',
        iconType: 'simple-icons',
        brandHex: '4285F4',
        description: 'Data warehouse for large-scale data analytics',
      },
      {
        name: 'MongoDB',
        iconKey: 'mongodb',
        iconType: 'simple-icons',
        brandHex: '47A248',
        description: 'Document database for flexible, schema-less data storage',
      },
      {
        name: 'Redis',
        iconKey: 'redis',
        iconType: 'simple-icons',
        brandHex: 'FF4438',
        description: 'In-memory data store used for caching and session management',
      },
      {
        name: 'Prisma',
        iconKey: 'prisma',
        iconType: 'simple-icons',
        brandHex: 'FFFFFF',
        description: 'Type-safe ORM for PostgreSQL and other relational databases',
      },
      {
        name: 'Supabase',
        iconKey: 'supabase',
        iconType: 'simple-icons',
        brandHex: '3ECF8E',
        description: 'Postgres-backed BaaS with real-time and auth capabilities',
      },
    ],
  },
  {
    title: 'Mobile & App Dev',
    emoji: '📱',
    status: 'core',
    skills: [
      {
        name: 'Flutter',
        iconKey: 'flutter',
        iconType: 'simple-icons',
        brandHex: '02569B',
        description: 'Cross-platform UI toolkit for the AI Notes App (iOS & Android)',
      },
      {
        name: 'Kotlin',
        iconKey: 'kotlin',
        iconType: 'simple-icons',
        brandHex: '7F52FF',
        description: 'Primary language for native Android development',
      },
      {
        name: 'Dart',
        iconKey: 'dart',
        iconType: 'simple-icons',
        brandHex: '0175C2',
        description: 'Language powering Flutter applications',
      },
      {
        name: 'Firebase',
        iconKey: 'firebase',
        iconType: 'simple-icons',
        brandHex: 'FFCA28',
        description: 'BaaS providing auth, Firestore, and hosting for mobile apps',
      },
      {
        name: 'Android',
        iconKey: 'android',
        iconType: 'simple-icons',
        brandHex: '34A853',
        description: 'Native Android development platform and deployment target',
      },
    ],
  },
  {
    title: 'System Design & Architecture',
    emoji: '🏗️',
    status: 'core',
    skills: [
      {
        name: 'Microservices',
        iconKey: 'Network',
        iconType: 'lucide',
        description: 'Decomposed service architecture pattern for scalable systems',
      },
      {
        name: 'WebSockets',
        iconKey: 'Wifi',
        iconType: 'lucide',
        description: 'Full-duplex communication protocol for real-time features',
      },
      {
        name: 'Message Queues',
        iconKey: 'MessageSquare',
        iconType: 'lucide',
        description: 'Async task processing pattern for decoupled service communication',
      },
      {
        name: 'Load Balancing',
        iconKey: 'Scale',
        iconType: 'lucide',
        description: 'Traffic distribution strategy for horizontal scaling',
      },
      {
        name: 'Scalable Architecture',
        iconKey: 'Layers',
        iconType: 'lucide',
        description: 'Design principles for building systems that grow with demand',
      },
    ],
  },
  {
    // Visual distinction required — dashed border + progress ring + Acquiring badge
    title: 'Cloud · DevOps · AI Infra',
    emoji: '☁️',
    status: 'acquiring',
    skills: [
      {
        name: 'AWS',
        iconKey: 'Cloud',
        iconType: 'lucide',
        description: 'Primary cloud platform — EC2, S3, and deployment infrastructure',
      },
      {
        name: 'GCP',
        iconKey: 'googlecloud',
        iconType: 'simple-icons',
        brandHex: '4285F4',
        description: 'Google Cloud used for EquiLens with Vertex AI integration',
      },
      {
        name: 'Docker',
        iconKey: 'docker',
        iconType: 'simple-icons',
        brandHex: '2496ED',
        description: 'Container runtime for consistent build and deployment environments',
      },
      {
        name: 'Kubernetes',
        iconKey: 'kubernetes',
        iconType: 'simple-icons',
        brandHex: '326CE5',
        description: 'Container orchestration for production-grade deployment at scale',
      },
      {
        name: 'Terraform',
        iconKey: 'terraform',
        iconType: 'simple-icons',
        brandHex: '844FBA',
        description: 'Infrastructure as Code tool for declarative cloud provisioning',
      },
      {
        name: 'GitHub Actions',
        iconKey: 'githubactions',
        iconType: 'simple-icons',
        brandHex: '2088FF',
        description: 'CI/CD pipeline automation for build, test, and deploy workflows',
      },
      {
        name: 'Nginx',
        iconKey: 'nginx',
        iconType: 'simple-icons',
        brandHex: '009639',
        description: 'High-performance reverse proxy and web server',
      },
      {
        name: 'MLOps',
        iconKey: 'BrainCircuit',
        iconType: 'lucide',
        description: 'Engineering discipline for deploying and monitoring ML models in production',
      },
      {
        name: 'Linux',
        iconKey: 'linux',
        iconType: 'simple-icons',
        brandHex: 'FCC624',
        description: 'Primary OS for server environments and cloud infrastructure',
      },
    ],
  },
  {
    title: 'Tools & Workflow',
    emoji: '🔧',
    status: 'core',
    skills: [
      {
        name: 'Git',
        iconKey: 'git',
        iconType: 'simple-icons',
        brandHex: 'F05032',
        description: 'Version control system used across all projects',
      },
      {
        name: 'GitHub',
        iconKey: 'github',
        iconType: 'simple-icons',
        brandHex: 'FFFFFF',
        description: 'Remote repository hosting and collaboration platform',
      },
      {
        name: 'IntelliJ IDE',
        iconKey: 'intellijidea',
        iconType: 'simple-icons',
        brandHex: 'FE315D',
        description: 'JetBrains IDE used for Kotlin and Java development',
      },
      {
        name: 'Postman',
        iconKey: 'postman',
        iconType: 'simple-icons',
        brandHex: 'FF6C37',
        description: 'API testing and documentation tool',
      },
      {
        name: 'Figma',
        iconKey: 'figma',
        iconType: 'simple-icons',
        brandHex: 'F24E1E',
        description: 'Design and prototyping tool for UI/UX work',
      },
      {
        name: 'Notion',
        iconKey: 'notion',
        iconType: 'simple-icons',
        brandHex: 'FFFFFF',
        description: 'Documentation and project management workspace',
      },
    ],
  },
];
