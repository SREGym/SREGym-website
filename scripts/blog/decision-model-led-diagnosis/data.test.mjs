import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readJson = async (path) =>
  JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const timings = await readJson(
  "../../../content/blog/_data/decision-model-led-timings.json",
);
const study = await readJson(
  "../../../content/blog/_data/decision-model-led-diagnosis.json",
);
const previous = await readJson(
  "../../../content/blog/_data/jev-diagnosis.json",
);

test("diagnosis means include all 420 runs on the matching 21 faults", () => {
  assert.equal(timings.source, "blog3-scores.tar.gz");
  assert.match(timings.sourceSha256, /^[a-f0-9]{64}$/);
  assert.equal(timings.durationField, "phase.stage:diagnosis.duration_s");
  assert.equal(timings.excludedObservationSeconds, 120);
  assert.equal(timings.judgeTimeIncluded, false);
  assert.equal(timings.cohort, previous.comparison.cohort);
  assert.deepEqual(timings.faultIds, [...previous.comparison.faultIds].sort());
  assert.deepEqual(
    timings.configurations.map((entry) => entry.id),
    ["luna-review", "luna-none", "jev-review", "jev-none"],
  );
  for (const entry of timings.configurations) {
    assert.equal(entry.stageSecondsByFault.length, 21);
    for (const attempts of entry.stageSecondsByFault) {
      assert.equal(attempts.length, 5);
      assert.ok(
        attempts.every((seconds) => Number.isFinite(seconds) && seconds > 120),
      );
    }
    const durations = entry.stageSecondsByFault
      .flat()
      .map((seconds) => seconds - 120);
    assert.equal(entry.attempts, 105);
    assert.equal(durations.length, entry.attempts);
    const mean =
      durations.reduce((sum, seconds) => sum + seconds, 0) / durations.length;
    assert.ok(Math.abs(mean - entry.meanDiagnosisSeconds) < 1e-9);
  }
});

test("published diagnosis times and review deltas use verified means, not medians", async () => {
  const row = study.results.sections[0].rows.find(
    ([label]) => label === "Mean diagnosis time",
  );
  assert.ok(row);
  assert.deepEqual(
    row.slice(1),
    timings.configurations.map(
      (entry) => `${entry.meanDiagnosisSeconds.toFixed(1)} s`,
    ),
  );
  assert.deepEqual(row.slice(1), ["41.5 s", "36.9 s", "38.4 s", "31.9 s"]);
  const entries = Object.fromEntries(
    timings.configurations.map((entry) => [entry.id, entry]),
  );
  assert.equal(
    (
      entries["jev-review"].meanDiagnosisSeconds -
      entries["jev-none"].meanDiagnosisSeconds
    ).toFixed(1),
    "6.6",
  );
  assert.equal(
    (
      entries["luna-review"].meanDiagnosisSeconds -
      entries["luna-none"].meanDiagnosisSeconds
    ).toFixed(1),
    "4.6",
  );
  const example =
    entries["jev-review"].stageSecondsByFault[
      timings.faultIds.indexOf("wrong_dns_policy_astronomy_shop")
    ][1] - 120;
  assert.equal(example.toFixed(1), "44.3");
  const article = await readFile(
    new URL(
      "../../../content/blog/decision-model-led-sre-diagnosis.mdx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.ok(article.includes("**44.3 seconds**"));
  assert.ok(article.includes("**31.9 to 41.5 seconds**"));
  assert.ok(!article.includes("Median diagnosis time"));
});
