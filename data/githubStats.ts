// data/githubStats.ts
// GitHub stats — sourced from /docs/ProfileContent.md §7.
// Stretch feature per Features.md §8. Keep minimal; do not add inferred/fabricated stats.
// Values reflect what is publicly visible on github.com/Arghya-2007 at time of writing.

import type { GithubStat } from './types';

export const githubStats: GithubStat[] = [
  { label: 'Repositories', value: "12  Repositories" },
  { label: 'Stars', value: "3  Stars" },
];

// NOTE: The actual stats embed (streak card, top languages, contribution graph)
// uses GitHub README stat cards styled in a dark/midnight theme + purple/cyan accents
// — this validates the portfolio's chosen color palette (his own brand already leans violet/cyan/dark).
// Live embed vs. static image decision is deferred to Phase 5 (Features.md §8).
