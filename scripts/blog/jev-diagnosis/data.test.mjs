import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = JSON.parse(
  await readFile(
    new URL("../../../content/blog/_data/jev-diagnosis.json", import.meta.url),
    "utf8",
  ),
);
const median = (values) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const near = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

test("the published study summaries agree with all 105 Astra judgments", () => {
  assert.equal(data.faults.length, 21);
  assert.equal(new Set(data.faults.map((fault) => fault.id)).size, 21);
  const attempts = data.faults.flatMap((fault) => fault.attempts);
  assert.equal(attempts.length, 105);
  for (const fault of data.faults) {
    assert.deepEqual(
      fault.attempts.map((attempt) => attempt.attempt),
      [1, 2, 3, 4, 5],
    );
    for (const attempt of fault.attempts) {
      assert.equal(attempt.passed, attempt.score >= data.study.passThreshold);
      assert.ok(attempt.diagnosisSeconds > 0);
      assert.ok(
        Number.isInteger(attempt.inputTokens) && attempt.inputTokens > 0,
      );
    }
  }
  assert.equal(attempts.filter((attempt) => attempt.passed).length, 80);
  assert.equal(data.study.passes, 80);
  assert.equal(
    data.faults.filter((fault) =>
      fault.attempts.every((attempt) => attempt.passed),
    ).length,
    16,
  );
  assert.equal(
    data.faults.filter((fault) =>
      fault.attempts.every((attempt) => !attempt.passed),
    ).length,
    5,
  );
  assert.equal(
    data.faults.filter(
      (fault) =>
        new Set(fault.attempts.map((attempt) => attempt.score)).size === 1,
    ).length,
    18,
  );
  near(
    median(attempts.map((attempt) => attempt.diagnosisSeconds)),
    data.study.medianDiagnosisSeconds,
  );
  assert.equal(
    attempts.reduce((total, attempt) => total + attempt.calls, 0),
    252,
  );
  assert.equal(
    attempts.reduce((total, attempt) => total + attempt.inputTokens, 0),
    data.study.inputTokens,
  );
  near(data.study.inferenceCostUsd, (data.study.inputTokens * 0.042) / 1e6);
});

test("the comparison uses the full 21-fault cohort and diagnosis-stage costs", async () => {
  const csv = await readFile(
    new URL(
      "../../../public/data/sregym-lite-0904-problems.csv",
      import.meta.url,
    ),
    "utf8",
  );
  const full = csv.trim().split(/\r?\n/).slice(1).sort();
  assert.equal(data.comparison.faults, 21);
  assert.deepEqual([...data.comparison.faultIds].sort(), full);
  const selected = data.faults.filter((fault) => fault.inComparison);
  assert.deepEqual(selected.map((fault) => fault.id).sort(), full);
  const attempts = selected.flatMap((fault) => fault.attempts);
  const jev = data.comparison.models.find((row) => row.id === "jev");
  assert.equal(attempts.length, 105);
  assert.equal(jev.attempts, 105);
  assert.equal(attempts.filter((attempt) => attempt.passed).length, 80);
  near(jev.passRate, (80 / 105) * 100);
  near(
    jev.meanDiagnosisSeconds,
    attempts.reduce((total, attempt) => total + attempt.diagnosisSeconds, 0) /
      105,
  );
  near(
    jev.diagnosisCostUsd,
    (attempts.reduce((total, attempt) => total + attempt.inputTokens, 0) *
      0.042) /
      1e6 /
      105,
  );
  assert.equal(data.comparison.models.length, 12);
  assert.ok(
    data.comparison.models.every((row) => row.agent !== "CloudThinker"),
  );
  for (const row of data.comparison.models.filter((row) => row.id !== "jev")) {
    assert.equal(row.attempts, 63);
    assert.ok(row.diagnosisCostUsd > 0);
    assert.ok(row.meanDiagnosisSeconds > 0);
  }
});

test("the chart preserves the supplied 21-fault diagnosis cost values", () => {
  const expected = {
    "GPT-6 Astra (max)": 0.88,
    "GPT-6 Astra (medium)": 0.461,
    "GPT-6.1 Sol (max)": 0.179,
    "GPT-6.1 Sol (medium)": 0.097,
    "GPT-5.6 Sol (max)": 0.622,
    "GPT-5.6 Sol (medium)": 0.28,
    "Claude Opus 5": 0.933,
    "GPT-5.6 Terra (max)": 0.356,
    "GPT-5.6 Luna (max)": 0.06,
    "Claude Sonnet 5": 0.674,
    "Claude Opus 4.8": 1.27,
  };
  for (const row of data.comparison.models.filter((row) => row.id !== "jev")) {
    near(row.diagnosisCostUsd, expected[row.model]);
  }
});
