// data/profile.ts
// Profile data — sourced verbatim from /docs/ProfileContent.md §1–3.
// Do NOT edit facts here without cross-referencing ProfileContent.md first.

import type { Profile } from './types';

export const profile: Profile = {
  name: 'Arghya Pal',

  tagline:
    "Aspiring MLOps & AI Infra Engineer · BCA '29 @ Techno Main Salt Lake · Building the infra that runs AI, not just using it ☁️",

  location: 'Kolkata, West Bengal, India',

  // Full status string from ProfileContent.md §1 (including the emoji)
  status: '🎯 Focusing — Open to Collaborate · Always Shipping',

  institute: 'Techno Main Salt Lake (BCA, graduating 2029)',

  belief: 'The best AI model is useless without solid infra behind it.',

  footerQuote:
    '— Arghya Pal, probably at 2am debugging a deployment pipeline.',

  // Used in the Timeline / Roadmap north-star badge label
  roadmapQuote:
    'Deploy & Scale AI Systems in Production. Full ownership: from model to infra to monitoring.',

  // ---------------------------------------------------------------------------
  // "Who Am I" block — from ProfileContent.md §2 (his own README, verbatim)
  // ---------------------------------------------------------------------------
  whoAmI: {
    role: [
      'Software Engineer & BCA Student',
      'Building Scalable Systems',
      'Aspiring MLOps & AI Infra Engineer',
    ],
    building: [
      'Full Stack Web Apps',
      'Cross-Platform Mobile Apps',
      'Scalable Systems',
    ],
    learning: [
      'Cloud Engineering',
      'DevOps',
      'MLOps',
      'AI Infra',
      'System Architecture',
    ],
    goalBy2027: 'Deploy and scale AI systems in production.',
  },

  // ---------------------------------------------------------------------------
  // Social / Contact links — from ProfileContent.md §3
  // ---------------------------------------------------------------------------
  socials: [
    {
      platform: 'GitHub',
      url: 'https://github.com/Arghya-2007',
      iconKey: 'github',
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/arghya-pal-2b866038b/',
      iconKey: 'linkedin',
    },
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/its_arghya_pal/',
      iconKey: 'instagram',
    },
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/argha.pal.9699/',
      iconKey: 'facebook',
    },
  ],

  // TODO: confirm with Arghya — preferred contact email for the contact form
  // (No public email on GitHub profile — see ProfileContent.md §8, gap #1)
  email: 'palargha24@gmail.com',

  // TODO: confirm with Arghya — resume/CV PDF URL for "Download Resume" CTA
  // (Not present on GitHub profile — see ProfileContent.md §8, gap #2)
  resumeUrl: undefined,
};
