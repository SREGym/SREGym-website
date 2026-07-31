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
];
