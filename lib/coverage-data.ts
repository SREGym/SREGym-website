type CoverageEntry = {
  title: string;
  href: string;
  before?: string;
  after?: string;
  related?: { title: string; href: string };
};

// Keep the order and article titles from the team's Media Coverage document.
export const coverageEntries: CoverageEntry[] = [
  {
    before: "Featured in ",
    title: "Cognition's Devin Oncall release",
    href: "https://devin.ai/blog/introducing-devin-oncall",
  },
  {
    before: "Featured in ",
    title: "Datadog's Scout 1.0 release",
    href: "https://www.datadoghq.com/blog/ai/introducing-scout-sre-specialized-model-bits-ai",
    related: {
      title: "technical report",
      href: "https://web-assets.dd-static.net/42588/1792071077-datadog-scout_technical_report.pdf",
    },
  },
  {
    before: "Featured in ",
    title: "One agent diagnosed 1.5x as many faults as a team",
    href: "https://www.nofire.ai/research/evals",
    after: " by NoFire.ai",
  },
  {
    title: "AI SRE Benchmark: observe-only diagnosis on SREGym",
    href: "https://www.nofire.ai/blog/sregym-benchmark-nofire-results",
    after: " by NoFire.ai",
  },
  {
    title: "Radar Is #1 on SREGym: 95% of Live Kubernetes Faults Fixed",
    href: "https://radarhq.io/blog/sregym-leaderboard",
    after: " by SkyHook Radar",
  },
  {
    before: "Featured in ",
    title: "How well do AI agents diagnose a broken Kubernetes cluster?",
    href: "https://radarhq.io/benchmark",
    after: " by SkyHook Radar",
  },
  {
    before: "Featured in ",
    title:
      "Real-time context lifted RCA accuracy up to 50% and reduced token cost to 1/10th",
    href: "https://chironvision.ai/blogs/real-time-context-lifted-rca-accuracy-and-reduced-token-cost",
    after: " by Chiron",
  },
  {
    title: "Your On-Call Has Not Met Astra Yet: SREGym Results",
    href: "https://cloudthinker.io/blogs/your-on-call-has-not-met-astra-yet",
    after: " by CloudThinker",
  },
  {
    title: "The Harness: Why a Frontier Model Needs Context From Every Surface",
    href: "https://cloudthinker.io/blogs/the-harness-context-engineering",
    after: " by CloudThinker",
  },
  {
    title: "SREGym 2.0 recreates the Microsoft Outlook outage",
    href: "https://agihunt.info/en/p/1a1f09f5ef2e49d31496cc808e9?campaign_id=daily-2026-11-19&content_id=1a1f09f5ef2e49d31496cc808e9",
    after: " at AGI Hunt",
  },
  {
    before: "Featured in ",
    title: "Agent evals: measuring the noise before comparing agents",
    href: "https://www.nofire.ai/blog/basic-statistics-maybe-more-relevant-than-ever",
    after: " by NoFire.ai",
  },
  {
    before: "Featured in ",
    title: "Benchmarking AI SRE agents before they touch production",
    href: "https://hasgeek.com/rootconf/2026/sub/benchmarking-ai-sre-agents-before-they-touch-produ-WHA4RdsQ4kGfxTvwhcUgmw",
    after: " by One2N",
  },
  {
    before: "Featured in ",
    title: "Before you evaluate an AI SRE, give your existing agent context",
    href: "https://www.cncf.io/blog/2026/10/21/before-you-evaluate-an-ai-sre-give-your-existing-agent-context",
    after: " on the Cloud Native Computing Foundation (CNCF) Blog",
  },
  {
    before: "Featured in ",
    title: "The 10 Best AI SRE Tools in 2026, Compared",
    href: "https://cloudthinker.io/blogs/best-ai-sre-tools-2026",
    after: " by CloudThinker",
  },
  {
    before: "Featured in ",
    title: "Model-Agnostic by Design: How We Choose a Model With Benchmarks",
    href: "https://cloudthinker.io/blogs/model-selection-by-benchmark",
    after: " by CloudThinker",
  },
  {
    title: "InfoQ's news report on Datadog's new model featuring SREGym",
    href: "https://www.infoq.com/news/2026/10/datadog-scout-sre-model/",
  },
  {
    before: "Featured in ",
    title: "What a Kubernetes AI benchmark measured, and what it did not",
    href: "https://cloudacio.com/blog/ai-sre-benchmark-context-speed-accuracy",
    after: " by Cloudacio",
  },
  {
    before: "Featured in ",
    title:
      "ERP build vs buy: when to build with AI agents and when to buy a platform",
    href: "https://www.bonx.com/white-papers/erp-build-vs-buy-2027-2030",
    after: " by Bonx",
  },
  {
    before: "Hacker News on ",
    title: "Jev-Driven SRE Diagnosis: What Worked and What Failed",
    href: "https://news.ycombinator.com/item?id=49986765",
  },
  {
    before: "Hacker News on ",
    title: "Turning Failure Postmortems into SRE-Benchmark Problems",
    href: "https://news.ycombinator.com/item?id=49873719",
  },
  {
    before: "SREGym's Jev-Driven SRE Diagnosis is featured in ",
    title: "Tech & Business",
    href: "https://techandbusiness.org",
  },
  {
    before: "Featured in ",
    title:
      "We benchmarked an AI agent on 52 broken clusters: kubectl vs a Kubernetes MCP server",
    href: "https://dev.to/dovzhikova/we-benchmarked-an-ai-agent-on-52-broken-clusters-kubectl-vs-a-kubernetes-mcp-server-2843",
    after: " on DEV Community",
  },
  {
    title: "SREGym put Jev on a Codex agent",
    href: "https://jevainews.com/news/jev-sregym-lite/",
    after: " on Jev News",
  },
  {
    before: "Featured in ",
    title: "Slingshots // TWO",
    href: "https://www.laude.org/updates/slingshots-two",
    after: " by Laude Institute",
  },
  {
    title: "SREGym is invited by Frontier Data Summit",
    href: "/blog/frontier-data-summit",
  },
  {
    before: "SREGym on ",
    title: "Can Agent Work?",
    href: "https://canagentswork.com/benchmarks/sregym/",
  },
  {
    before: "Accepted as a ",
    title: "demo",
    href: "https://tianyin.github.io/pub/sregym-demo.pdf",
    after:
      " at the inaugural ACM Conference on AI and Agentic Systems (ACM CAIS 2026)",
  },
  {
    title: "Laude Institute selects SREGym for Slingshot program",
    href: "https://siebelschool.illinois.edu/news/sregym",
    after:
      " by Siebel School of Computing and Data Science at the University of Illinois Urbana-Champaign",
  },
];
