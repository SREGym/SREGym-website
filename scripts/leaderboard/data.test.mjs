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
  assert.deepEqual(liteLeaderboardData.filter((run) => run.agent === agent), [
    {
      ...common,
      diagPct: 100.0,
      mitPct: 100.0,
      e2ePct: 100.0,
      ttdSeconds: 36.6,
      ttmSeconds: 65.9,
      tokens: "554K",
    },
  ]);
});

test("Radar full-set submission preserves the corrected token mean and cumulative TTM", () => {
  assert.deepEqual(runLeaderboardData.filter((run) => run.agent === agent), [
    {
      ...common,
      diagPct: 98.9,
      mitPct: 95.9,
      e2ePct: 95.2,
      ttdSeconds: 40.6,
      ttmSeconds: 111.2,
      tokens: "619K",
    },
  ]);
});

test("Radar results are in the matching active cohorts, not the historical cohort", () => {
  for (const id of ["sregym-lite-1004", "sregym-0508"]) {
    const benchmark = leaderboardBenchmarks.find((entry) => entry.id === id);
    assert.ok(benchmark, `Missing benchmark: ${id}`);
    assert.equal(benchmark.entries.filter((run) => run.agent === agent).length, 1);
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
    new URL("../../app/(home)/components/leaderboard-preview.tsx", import.meta.url),
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
    ["Faster diagnosis", "Slower diagnosis", "Slow mitigation", "Lower success"],
  );
  assert.deepEqual(entries, original);
});

test("token counts retain the corrected compact values", () => {
  assert.equal(parseTokenCount("554K"), 554000);
  assert.equal(parseTokenCount("619K"), 619000);
  assert.equal(formatTokenCount("554K"), "554K");
  assert.equal(formatTokenCount("619K"), "619K");
});
