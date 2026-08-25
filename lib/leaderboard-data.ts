export type RunEntry = {
  agent: string;
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

// Results use the exact archived 20-fault cohort. Time and token means use
// rows with recorded values. Timeouts count as failures in all success rates.
export const liteLeaderboardData: RunEntry[] = [
  {
    agent: "GitHub Copilot",
    model: "GPT-5.6 Sol (max)",
    noise: false,
    diagPct: 95.0,
    mitPct: 75.0,
    e2ePct: 70.0,
    ttdSeconds: 209.5,
    ttmSeconds: 554.7,
    tokens: "2.24M",
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
    id: "sregym-0508",
    label: "SREGym",
    summary: "SREGym-0508 · 90 faults",
    supportsNoise: true,
    cohortHref: "/problems/cohorts/sregym-0508",
    entries: runLeaderboardData,
  },
  {
    id: "sregym-lite-0720",
    label: "SREGym-Lite",
    summary: "SREGym-Lite-0720 · 20 faults",
    supportsNoise: false,
    cohortHref: "/problems/cohorts/sregym-lite-0720",
    entries: liteLeaderboardData,
  },
];
