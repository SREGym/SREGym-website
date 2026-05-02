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
    ttdSeconds: 114.9,
    ttmSeconds: 1145.0,
    tokens: "812K",
  },
  {
    agent: "Stratus",
    model: "Claude Sonnet 4.6",
    noise: true,
    diagPct: 51.5,
    mitPct: 65.5,
    e2ePct: 40.2,
    ttdSeconds: 128.4,
    ttmSeconds: 582.9,
    tokens: "464K",
  },
  {
    agent: "Stratus",
    model: "Kimi K2.5",
    noise: false,
    diagPct: 41.3,
    mitPct: 60.6,
    e2ePct: 32.9,
    ttdSeconds: 417.6,
    ttmSeconds: 892.6,
    tokens: "413K",
  },
  {
    agent: "Stratus",
    model: "Kimi K2.5",
    noise: true,
    diagPct: 38.9,
    mitPct: 57.3,
    e2ePct: 30.4,
    ttdSeconds: 469.4,
    ttmSeconds: 848.3,
    tokens: "443K",
  },
  {
    agent: "Claude Code",
    model: "Claude Sonnet 4.6",
    noise: false,
    diagPct: 72.6,
    mitPct: 75.6,
    e2ePct: 60.7,
    ttdSeconds: 295.6,
    ttmSeconds: 709.6,
    tokens: "1.47M",
  },
  {
    agent: "Claude Code",
    model: "Claude Sonnet 4.6",
    noise: true,
    diagPct: 62.6,
    mitPct: 76.3,
    e2ePct: 53.7,
    ttdSeconds: 316.1,
    ttmSeconds: 739.1,
    tokens: "1.71M",
  },
  {
    agent: "Codex",
    model: "GPT-5.4",
    noise: false,
    diagPct: 70.0,
    mitPct: 65.2,
    e2ePct: 53.3,
    ttdSeconds: 172.1,
    ttmSeconds: 374.2,
    tokens: "1.98M",
  },
  {
    agent: "Codex",
    model: "GPT-5.4",
    noise: true,
    diagPct: 59.3,
    mitPct: 64.0,
    e2ePct: 45.9,
    ttdSeconds: 214.3,
    ttmSeconds: 389.8,
    tokens: "1.88M",
  },
];
