export type RunEntry = {
  agent: string;
  thirdParty?: {
    website: string;
  };
  model: string;
  noise: boolean;
  diagPct: number;
  mitPct: number;
  e2ePct: number;
  ttdSeconds: number;
  ttmSeconds: number;
  tokens: string;
};

export type RankedRunEntry = RunEntry & {
  rank: number;
};

export const THIRD_PARTY_SUBMISSION_NOTE =
  "* Third-party submissions. Results verified by the SREGym team.";

export function parseTokenCount(tokens: string): number {
  const value = parseFloat(tokens.replace(/,/g, ""));
  if (tokens.endsWith("M")) return value * 1_000_000;
  if (tokens.endsWith("K")) return value * 1_000;
  return value;
}

const tokenFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumSignificantDigits: 3,
});

export function formatTokenCount(tokens: string): string {
  return tokenFormatter.format(parseTokenCount(tokens));
}

export type LeaderboardBenchmark = {
  id: string;
  label: string;
  summary: string;
  supportsNoise: boolean;
  cohortHref?: string;
  entries: RunEntry[];
};

export const runLeaderboardData: RunEntry[] = [
  {
    agent: "Stratus",
    model: "Claude Sonnet 4.6",
    noise: false,
    diagPct: 61.5,
    mitPct: 78.5,
    e2ePct: 54.8,
    ttdSeconds: 114.0,
    ttmSeconds: 771.1,
    tokens: "812K",
  },
  {
    agent: "Stratus",
    model: "Claude Sonnet 4.6",
    noise: true,
    diagPct: 51.5,
    mitPct: 61.1,
    e2ePct: 39.6,
    ttdSeconds: 170.5,
    ttmSeconds: 885.0,
    tokens: "464K",
  },
  {
    agent: "Stratus",
    model: "Kimi K2.5",
    noise: false,
    diagPct: 40.4,
    mitPct: 40.4,
    e2ePct: 27.4,
    ttdSeconds: 674.5,
    ttmSeconds: 1348.8,
    tokens: "413K",
  },
  {
    agent: "Stratus",
    model: "Kimi K2.5",
    noise: true,
    diagPct: 38.1,
    mitPct: 41.9,
    e2ePct: 26.7,
    ttdSeconds: 656.4,
    ttmSeconds: 1283.2,
    tokens: "443K",
  },
  {
    agent: "Claude Code",
    model: "Claude Sonnet 4.6",
    noise: false,
    diagPct: 72.6,
    mitPct: 75.6,
    e2ePct: 60.7,
    ttdSeconds: 292.5,
    ttmSeconds: 702.0,
    tokens: "1.47M",
  },
  {
    agent: "Claude Code",
    model: "Claude Sonnet 4.6",
    noise: true,
    diagPct: 62.6,
    mitPct: 76.3,
    e2ePct: 53.7,
    ttdSeconds: 314.0,
    ttmSeconds: 736.5,
    tokens: "1.71M",
  },
  {
    agent: "Codex",
    model: "GPT-5.4",
    noise: false,
    diagPct: 70.0,
    mitPct: 63.7,
    e2ePct: 53.3,
    ttdSeconds: 176.4,
    ttmSeconds: 376.0,
    tokens: "1.98M",
  },
  {
    agent: "Codex",
    model: "GPT-5.4",
    noise: true,
    diagPct: 59.3,
    mitPct: 61.9,
    e2ePct: 45.9,
    ttdSeconds: 218.1,
    ttmSeconds: 397.7,
    tokens: "1.88M",
  },
  // These GitHub Copilot results use the same 90-problem cohort and three
  // attempts per problem as the paper results above. Missing attempts count
  // as failures; token means use runs with recorded token usage.
  {
    agent: "GitHub Copilot",
    model: "GPT-5.5 (max)",
    noise: false,
    diagPct: 81.9,
    mitPct: 76.7,
    e2ePct: 70.0,
    ttdSeconds: 190.1,
    ttmSeconds: 541.0,
    tokens: "1.55M",
  },
  {
    agent: "GitHub Copilot",
    model: "GPT-5.6 Sol (max)",
    noise: false,
    diagPct: 83.3,
    mitPct: 83.7,
    e2ePct: 72.2,
    ttdSeconds: 243.0,
    ttmSeconds: 645.4,
    tokens: "2.45M",
  },
  {
    agent: "GitHub Copilot",
    model: "GPT-5.6 Terra (max)",
    noise: false,
    diagPct: 82.6,
    mitPct: 80.4,
    e2ePct: 70.0,
    ttdSeconds: 214.5,
    ttmSeconds: 610.8,
    tokens: "3.09M",
  },
  {
    agent: "GitHub Copilot",
    model: "Claude Opus 4.8 (medium)",
    noise: false,
    diagPct: 81.1,
    mitPct: 75.6,
    e2ePct: 69.3,
    ttdSeconds: 328.5,
    ttmSeconds: 551.7,
    tokens: "2.82M",
  },
  {
    agent: "GitHub Copilot",
    model: "Claude Sonnet 5 (medium)",
    noise: false,
    diagPct: 85.2,
    mitPct: 77.8,
    e2ePct: 70.7,
    ttdSeconds: 241.6,
    ttmSeconds: 419.5,
    tokens: "4.01M",
  },
];

// Results use the 17 active SREGym-Lite-1004 faults and three attempts per fault.
// The four deprecated faults from the 21-fault cohort are excluded. Missing
// attempts and timeouts count as failures; time means use runs with recorded
// values.
export const liteLeaderboardData: RunEntry[] = [
  {
    agent: "Codex",
    model: "GPT-6 Astra (max)",
    noise: false,
    diagPct: 96.1,
    mitPct: 100.0,
    e2ePct: 96.1,
    ttdSeconds: 173.1,
    ttmSeconds: 287.6,
    tokens: "719K",
  },
  {
    agent: "Codex",
    model: "GPT-6 Astra (medium)",
    noise: false,
    diagPct: 100.0,
    mitPct: 90.2,
    e2ePct: 90.2,
    ttdSeconds: 92.0,
    ttmSeconds: 138.4,
    tokens: "377K",
  },
  {
    agent: "Codex",
    model: "GPT-6.1 Sol (max)",
    noise: false,
    diagPct: 98.0,
    mitPct: 90.2,
    e2ePct: 90.2,
    ttdSeconds: 217.4,
    ttmSeconds: 371.6,
    tokens: "807K",
  },
  {
    agent: "Codex",
    model: "GPT-6.1 Sol (medium)",
    noise: false,
    diagPct: 98.0,
    mitPct: 90.2,
    e2ePct: 90.2,
    ttdSeconds: 103.8,
    ttmSeconds: 156.6,
    tokens: "462K",
  },
  {
    agent: "Codex",
    model: "GPT-5.6 Sol (max)",
    noise: false,
    diagPct: 94.1,
    mitPct: 82.4,
    e2ePct: 76.5,
    ttdSeconds: 225.1,
    ttmSeconds: 409.7,
    tokens: "1.54M",
  },
  {
    agent: "CloudThinker",
    thirdParty: {
      website: "https://cloudthinker.io/",
    },
    model: "Claude Opus 5",
    noise: false,
    diagPct: 94.1,
    mitPct: 80.4,
    e2ePct: 76.5,
    ttdSeconds: 517.8,
    ttmSeconds: 759.1,
    tokens: "1.56M",
  },
  {
    agent: "Claude Code",
    model: "Claude Opus 5",
    noise: false,
    diagPct: 90.2,
    mitPct: 78.4,
    e2ePct: 70.6,
    ttdSeconds: 241.8,
    ttmSeconds: 466.2,
    tokens: "1.86M",
  },
  {
    agent: "Codex",
    model: "GPT-5.6 Terra (max)",
    noise: false,
    diagPct: 82.4,
    mitPct: 74.5,
    e2ePct: 62.7,
    ttdSeconds: 233.1,
    ttmSeconds: 444.9,
    tokens: "1.88M",
  },
  {
    agent: "Codex",
    model: "GPT-5.6 Luna (max)",
    noise: false,
    diagPct: 84.3,
    mitPct: 74.5,
    e2ePct: 60.8,
    ttdSeconds: 306.0,
    ttmSeconds: 517.7,
    tokens: "2.97M",
  },
  {
    agent: "Codex",
    model: "GPT-5.6 Sol (medium)",
    noise: false,
    diagPct: 72.5,
    mitPct: 64.7,
    e2ePct: 49.0,
    ttdSeconds: 117.6,
    ttmSeconds: 295.0,
    tokens: "868K",
  },
  {
    agent: "Claude Code",
    model: "Claude Sonnet 5",
    noise: false,
    diagPct: 54.9,
    mitPct: 62.7,
    e2ePct: 45.1,
    ttdSeconds: 308.6,
    ttmSeconds: 505.2,
    tokens: "3.37M",
  },
  {
    agent: "Claude Code",
    model: "Claude Opus 4.8",
    noise: false,
    diagPct: 58.8,
    mitPct: 54.9,
    e2ePct: 41.2,
    ttdSeconds: 360.2,
    ttmSeconds: 553.7,
    tokens: "1.85M",
  },
];

// Retained as an internal historical record and intentionally not exposed on
// the site. These results use the previous 20-fault SREGym-Lite-0720 cohort.
export const lite0720LeaderboardData: RunEntry[] = [
  {
    agent: "Claude Code",
    model: "Claude Opus 5",
    noise: false,
    diagPct: 91.7,
    mitPct: 86.7,
    e2ePct: 80.0,
    ttdSeconds: 213.2,
    ttmSeconds: 418.6,
    tokens: "1.63M",
  },
  {
    agent: "Claude Code",
    model: "Claude Opus 4.8",
    noise: false,
    diagPct: 68.3,
    mitPct: 66.7,
    e2ePct: 55.0,
    ttdSeconds: 328.8,
    ttmSeconds: 503.8,
    tokens: "1.67M",
  },
  {
    agent: "Claude Code",
    model: "Claude Sonnet 5",
    noise: false,
    diagPct: 66.7,
    mitPct: 73.3,
    e2ePct: 58.3,
    ttdSeconds: 276.0,
    ttmSeconds: 449.5,
    tokens: "2.99M",
  },
  {
    agent: "Codex",
    model: "GPT-5.6 Sol (max)",
    noise: false,
    diagPct: 96.7,
    mitPct: 85.0,
    e2ePct: 81.7,
    ttdSeconds: 207.7,
    ttmSeconds: 390.5,
    tokens: "1.34M",
  },
  {
    agent: "Codex",
    model: "GPT-5.6 Luna (max)",
    noise: false,
    diagPct: 88.3,
    mitPct: 80.0,
    e2ePct: 68.3,
    ttdSeconds: 287.4,
    ttmSeconds: 490.6,
    tokens: "2.69M",
  },
  {
    agent: "Codex",
    model: "GPT-5.6 Terra (max)",
    noise: false,
    diagPct: 86.7,
    mitPct: 80.0,
    e2ePct: 70.0,
    ttdSeconds: 219.6,
    ttmSeconds: 416.3,
    tokens: "1.66M",
  },
  {
    agent: "GitHub Copilot",
    model: "GPT-5.6 Sol (medium)",
    noise: false,
    diagPct: 80.0,
    mitPct: 76.7,
    e2ePct: 65.0,
    ttdSeconds: 115.9,
    ttmSeconds: 424.3,
    tokens: "1.28M",
  },
  {
    agent: "GitHub Copilot",
    model: "GPT-5.6 Luna (medium)",
    noise: false,
    diagPct: 56.7,
    mitPct: 45.0,
    e2ePct: 40.0,
    ttdSeconds: 73.7,
    ttmSeconds: 263.0,
    tokens: "1.10M",
  },
  {
    agent: "GitHub Copilot",
    model: "GPT-5.6 Terra (medium)",
    noise: false,
    diagPct: 53.3,
    mitPct: 48.3,
    e2ePct: 36.7,
    ttdSeconds: 71.2,
    ttmSeconds: 355.3,
    tokens: "1.11M",
  },
  {
    agent: "OpenCode",
    model: "GLM-5.2 (max)",
    noise: false,
    diagPct: 75.0,
    mitPct: 70.0,
    e2ePct: 65.0,
    ttdSeconds: 408.2,
    ttmSeconds: 693.3,
    tokens: "33.6K",
  },
];

export const leaderboardBenchmarks: LeaderboardBenchmark[] = [
  {
    id: "sregym-lite-1004",
    label: "SREGym-Lite",
    summary: "SREGym-Lite-1004 · 17 faults",
    supportsNoise: false,
    cohortHref: "/problems/cohorts/sregym-lite",
    entries: liteLeaderboardData,
  },
  {
    id: "sregym-0508",
    label: "SREGym",
    summary: "SREGym-0508 · 90 faults",
    supportsNoise: true,
    cohortHref: "/problems/cohorts/sregym-0508",
    entries: runLeaderboardData,
  },
];
