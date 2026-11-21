import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../../lib/leaderboard-data.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const {
  leaderboardBenchmarks,
  lite0720LeaderboardData,
  liteLeaderboardData,
  runLeaderboardData,
  noisy1120LeaderboardData,
  rankLeaderboardEntries,
  parseTokenCount,
  formatTokenCount,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const agent = "Radar + Claude Code";
const common = {
  agent,
  thirdParty: {
    website: "https://radarhq.io/",
  },
  model: "Claude Opus 5.5 (medium)",
  noise: false,
};

test("Radar Lite submission preserves the supplied 51-run results", () => {
  assert.deepEqual(
    liteLeaderboardData.filter((run) => run.agent === agent),
    [
      {
        ...common,
        diagPct: 100.0,
        mitPct: 100.0,
        e2ePct: 100.0,
        ttdSeconds: 36.6,
        ttmSeconds: 65.9,
        tokens: "554K",
      },
    ],
  );
});

test("Chiron Lite submissions preserve both sets of 34-run results", () => {
  const entries = liteLeaderboardData.filter(
    (run) => run.agent === "Chiron + Claude Code",
  );
  const chiron = {
    agent: "Chiron + Claude Code",
    thirdParty: { website: "https://chironvision.ai/" },
    noise: false,
  };
  assert.deepEqual(entries, [
    {
      ...chiron,
      model: "Claude Opus 5.5 (medium)",
      diagPct: 100.0,
      mitPct: 100.0,
      e2ePct: 100.0,
      ttdSeconds: 57.5,
      ttmSeconds: 97.1,
      tokens: "277K",
    },
    {
      ...chiron,
      model: "Claude Sonnet 5",
      diagPct: 73.5,
      mitPct: 79.4,
      e2ePct: 61.8,
      ttdSeconds: 111.2,
      ttmSeconds: 177.7,
      tokens: "0.99M",
    },
  ]);
});

test("the original Chiron Lite results stay in the active clean Lite cohort", () => {
  const benchmark = leaderboardBenchmarks.find(
    (entry) => entry.id === "sregym-lite-1004",
  );
  assert.equal(
    benchmark.entries.filter((run) => run.agent === "Chiron + Claude Code")
      .length,
    2,
  );
  for (const entries of [runLeaderboardData, lite0720LeaderboardData]) {
    assert.ok(!entries.some((run) => run.agent === "Chiron + Claude Code"));
  }
  assert.ok(
    !liteLeaderboardData.some(
      (run) => run.agent === "Chiron + Claude Code" && run.noise,
    ),
  );
});

test("Chiron's 170-run noisy submission preserves its results and link", () => {
  assert.deepEqual(noisy1120LeaderboardData, [
    {
      agent: "Chiron + Claude Code",
      thirdParty: { website: "https://chironvision.ai/" },
      model: "Claude Sonnet 4.6 (medium)",
      noise: true,
      diagPct: 87.1,
      mitPct: 80.6,
      e2ePct: 72.9,
      ttdSeconds: 126.2,
      ttmSeconds: 293.0,
      tokens: "732K",
    },
  ]);
});

test("the full leaderboard uses one updated cohort and preserves the clean results", () => {
  const full = leaderboardBenchmarks.find(
    (entry) => entry.id === "sregym-1120",
  );
  assert.equal(full.summary, "SREGym-1120 · 85 faults");
  assert.equal(full.cohortHref, "/problems/cohorts/sregym-1120");
  assert.equal(full.supportsNoise, true);
  assert.equal(full.evaluationNote, undefined);
  assert.deepEqual(
    full.entries.filter((entry) => !entry.noise),
    runLeaderboardData.filter((entry) => !entry.noise),
  );
  const lite = leaderboardBenchmarks.find(
    (entry) => entry.id === "sregym-lite-1004",
  );
  assert.ok(
    !lite.entries.some((entry) => entry.model === "Claude Sonnet 4.6 (medium)"),
  );
});

test("the noisy view includes Chiron and all existing results without changing their scores", () => {
  const full = leaderboardBenchmarks.find(
    (entry) => entry.id === "sregym-1120",
  );
  const ranked = rankLeaderboardEntries(
    full.entries.filter((entry) => entry.noise),
  );
  assert.deepEqual(
    ranked.map(({ rank, ...entry }) => entry),
    [
      ...noisy1120LeaderboardData,
      ...rankLeaderboardEntries(
        runLeaderboardData.filter((entry) => entry.noise),
      ).map(({ rank, ...entry }) => entry),
    ],
  );
  assert.deepEqual(
    ranked.map((entry) => entry.e2ePct),
    [72.9, 53.7, 45.9, 39.6, 26.7],
  );
  assert.deepEqual(
    ranked.map((entry) => entry.rank),
    [1, 2, 3, 4, 5],
  );
});

test("the noisy cohort has 70 original faults and 15 ported replacements", async () => {
  const csv = await readFile(
    new URL("../../public/data/sregym-1120-problems.csv", import.meta.url),
    "utf8",
  );
  const ids = csv.trim().split("\n").slice(1);
  const original = (
    await readFile(
      new URL("../../public/data/sregym-0508-problems.csv", import.meta.url),
      "utf8",
    )
  )
    .trim()
    .split("\n")
    .slice(1)
    .map((row) => row.split(",")[0]);
  assert.equal(ids.length, 85);
  assert.equal(new Set(ids).size, 85);
  assert.equal(ids.filter((id) => original.includes(id)).length, 70);
  assert.equal(original.filter((id) => !ids.includes(id)).length, 20);
  assert.deepEqual(ids.filter((id) => !original.includes(id)).sort(), [
    "assign_to_non_existent_node_saleor",
    "duplicate_pvc_mounts_slack_spine",
    "faulty_image_correlated_slack_spine",
    "incorrect_port_assignment_slack_spine",
    "k8s_target_port-misconfig_slack_spine",
    "liveness_probe_misconfiguration_slack_spine",
    "missing_configmap_slack_spine",
    "missing_service_slack_spine",
    "pod_anti_affinity_deadlock_slack_spine",
    "pvc_claim_mismatch_saleor",
    "rbac_misconfiguration_saleor",
    "readiness_probe_misconfiguration_slack_spine",
    "resource_request_too_large_slack_spine",
    "wrong_dns_policy_saleor",
    "wrong_service_selector_slack_spine",
  ]);
});

test("Radar full-set submission preserves the corrected token mean and cumulative TTM", () => {
  assert.deepEqual(
    runLeaderboardData.filter((run) => run.agent === agent),
    [
      {
        ...common,
        diagPct: 98.9,
        mitPct: 95.9,
        e2ePct: 95.2,
        ttdSeconds: 40.6,
        ttmSeconds: 111.2,
        tokens: "619K",
      },
    ],
  );
});

test("Radar results remain in the active leaderboard views, not the historical Lite cohort", () => {
  for (const id of ["sregym-lite-1004", "sregym-1120"]) {
    const benchmark = leaderboardBenchmarks.find((entry) => entry.id === id);
    assert.ok(benchmark, `Missing benchmark: ${id}`);
    assert.equal(
      benchmark.entries.filter((run) => run.agent === agent).length,
      1,
    );
  }
  assert.ok(!lite0720LeaderboardData.some((run) => run.agent === agent));
});

test("Radar ranks first in both clean cohorts and is absent from noisy results", () => {
  for (const entries of [liteLeaderboardData, runLeaderboardData]) {
    const ranked = rankLeaderboardEntries(entries.filter((run) => !run.noise));
    assert.equal(ranked[0].agent, agent);
    assert.equal(ranked[0].rank, 1);
    assert.ok(!entries.some((run) => run.agent === agent && run.noise));
  }
});

test("the Lite leaderboard and homepage omit the attempts-per-fault banner", async () => {
  const benchmark = leaderboardBenchmarks.find(
    (entry) => entry.id === "sregym-lite-1004",
  );
  assert.equal(benchmark.evaluationNote, undefined);
  assert.doesNotMatch(source, /Devin Oncall: 2 attempts per fault/);
  const preview = await readFile(
    new URL(
      "../../app/(home)/components/leaderboard-preview.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.doesNotMatch(preview, /LITE_EVALUATION_NOTE/);
  assert.match(preview, /THIRD_PARTY_SUBMISSION_NOTE/);
});

test("ranking uses E2E, then cumulative TTM, then TTD without mutating the source", () => {
  const base = liteLeaderboardData.find((run) => run.agent === agent);
  const entries = [
    { ...base, agent: "Slow mitigation", ttmSeconds: 90, ttdSeconds: 10 },
    { ...base, agent: "Slower diagnosis", ttmSeconds: 60, ttdSeconds: 40 },
    { ...base, agent: "Faster diagnosis", ttmSeconds: 60, ttdSeconds: 20 },
    { ...base, agent: "Lower success", e2ePct: 99, ttmSeconds: 10 },
  ];
  const original = structuredClone(entries);
  assert.deepEqual(
    rankLeaderboardEntries(entries).map((run) => run.agent),
    [
      "Faster diagnosis",
      "Slower diagnosis",
      "Slow mitigation",
      "Lower success",
    ],
  );
  assert.deepEqual(entries, original);
});

test("token counts retain the corrected compact values", () => {
  assert.equal(parseTokenCount("554K"), 554000);
  assert.equal(parseTokenCount("619K"), 619000);
  assert.equal(formatTokenCount("554K"), "554K");
  assert.equal(formatTokenCount("619K"), "619K");
  assert.equal(parseTokenCount("0.99M"), 990000);
  assert.equal(formatTokenCount("0.99M"), "990K");
});
