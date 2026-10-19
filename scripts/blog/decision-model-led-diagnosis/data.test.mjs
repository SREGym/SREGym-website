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
const measurements = await readJson(
  "../../../content/blog/_data/decision-model-led-measurements.json",
);

test("the post links Yukun He to his personal website", async () => {
  const article = await readFile(
    new URL("../../../content/blog/decision-model-led-sre-diagnosis.mdx", import.meta.url),
    "utf8",
  );
  assert.match(article, /name: "Yukun He"\s+url: "https:\/\/yukunhe16\.github\.io\/"/);
  assert.doesNotMatch(article, /mHLMsZ20LI8/);
});

test("the article and figures use tool calls for the selectable actions", async () => {
  const paths = [
    "../../../content/blog/decision-model-led-sre-diagnosis.mdx",
    "../../../components/blog/decision-model-led-diagnosis/figures.tsx",
    "./render-figures.mjs",
    "../../../public/blog/decision-model-led-diagnosis/workflow.svg",
    "../../../public/blog/decision-model-led-diagnosis/workflow-mobile.svg",
    "../../../public/blog/decision-model-led-diagnosis/cover.svg",
  ];
  const contents = await Promise.all(paths.map((path) =>
    readFile(new URL(path, import.meta.url), "utf8"),
  ));
  const [article] = contents;
  assert.match(article, /selects a tool call at each step: which read-only tool to run and what it will inspect/);
  assert.match(article, /limit of 40 tool calls, plus `submit_now` to request an end/);
  assert.match(article, /the highest-ranked available tool call is used instead/);
  assert.ok(study.tools.some(([, name]) => name === "client_check"));
  for (const [index, content] of contents.entries()) {
    assert.doesNotMatch(
      content,
      /\b(?:possible|available|remaining|read-only) checks\b|\b40 checks\b|\bChoose a check\b|\bIf a check is selected\b|\bCheck selected\b|\bNext check\b/,
      `Outdated investigation terminology in ${paths[index]}`,
    );
  }
  for (const content of contents.slice(3)) {
    assert.match(content, /Tool call|tool call/);
  }
  assert.match(contents.at(-1), /id="read-only-tools"/);
});

test("the LLM comparison includes all three models with and without review", async () => {
  const expected = [
    "GPT-6 Sol, high effort",
    "GPT-5.6 Sol, high effort",
    "GPT-5.6 Luna, xhigh effort",
  ];
  for (const section of study.reviewers.sections) {
    assert.deepEqual(section.rows.map(([label]) => label), expected);
  }
  for (const [sectionIndex, suffix] of [[0, "review"], [1, "none"]]) {
    const row = study.reviewers.sections[sectionIndex].rows[0];
    for (const [column, model] of [[1, "luna"], [2, "jev"]]) {
      const entry = measurements.configurations.find(({ id }) => id === `${model}-${suffix}`);
      assert.equal(
        row[column],
        `${entry.passes}/105 (${((entry.passes / 105) * 100).toFixed(1)}%)\nmean score ${entry.meanScore.toFixed(1)}`,
      );
    }
  }
  const article = await readFile(
    new URL("../../../content/blog/decision-model-led-sre-diagnosis.mdx", import.meta.url),
    "utf8",
  );
  assert.match(article, /GPT-6 Sol's results from the separate runs in our main experiment/);
  assert.match(article, /For both GPT-5\.6 models, we kept the recorded investigations/);
});

test("full measurements match the numeric audit of all 420 recorded runs", () => {
  assert.equal(measurements.configurations.length, 4);
  assert.deepEqual(measurements.faultIds, timings.faultIds);
  assert.deepEqual(measurements.otherTrajectoryMembers, []);
  assert.equal(
    measurements.sources["blog3-scores.tar.gz"],
    timings.sourceSha256,
  );
  assert.match(
    measurements.sources["blog3-trajectories.tar.gz"],
    /^[a-f0-9]{64}$/,
  );
  const [diagnosis, decision, llm] = study.results.sections;
  const row = (section, label) => section.rows.find(([name]) => name === label);
  const close = (actual, expected) =>
    assert.ok(Math.abs(actual - expected) < 1e-9);
  for (const [index, entry] of measurements.configurations.entries()) {
    const column = index + 1;
    assert.equal(entry.id, timings.configurations[index].id);
    assert.equal(entry.attempts, 105);
    const passes = entry.passesByFault;
    assert.equal(passes.length, 21);
    assert.ok(
      passes.every(
        (count) => Number.isInteger(count) && count >= 0 && count <= 5,
      ),
    );
    assert.equal(
      entry.passes,
      passes.reduce((sum, value) => sum + value, 0),
    );
    assert.equal(
      entry.faultsAllPass,
      passes.filter((count) => count === 5).length,
    );
    assert.equal(
      entry.faultsAllFail,
      passes.filter((count) => count === 0).length,
    );
    close(entry.meanScore, entry.scoreSum / 105);
    close(
      entry.decision.meanSecondsPerAttempt,
      entry.decision.latencyMs / 1000 / 105,
    );
    close(
      entry.decision.meanSecondsPerCall,
      entry.decision.latencyMs / 1000 / entry.decision.calls,
    );
    close(
      entry.llm.meanReviewAndReportSecondsPerAttempt,
      entry.llm.reviewAndReportMs / 1000 / 105,
    );
    assert.equal(
      row(diagnosis, "Judged diagnosis passes")[column],
      `${entry.passes}/105 (${((entry.passes / 105) * 100).toFixed(1)}%)`,
    );
    assert.equal(
      row(diagnosis, "Mean score (0–100)")[column],
      entry.meanScore.toFixed(1),
    );
    assert.equal(
      row(diagnosis, "Faults passed in all five attempts")[column],
      `${entry.faultsAllPass}/21`,
    );
    assert.equal(
      row(diagnosis, "Faults failed in all five attempts")[column],
      `${entry.faultsAllFail}/21`,
    );
    assert.equal(
      row(diagnosis, "Mean diagnosis time")[column],
      `${entry.meanDiagnosisSeconds.toFixed(1)} s`,
    );
    assert.equal(
      row(decision, "Calls")[column],
      `${entry.decision.calls} (${(entry.decision.calls / 105).toFixed(1)} per attempt)`,
    );
    assert.equal(
      row(decision, "Mean total API time per attempt")[column],
      `${entry.decision.meanSecondsPerAttempt.toFixed(2)} s`,
    );
    assert.equal(
      row(decision, "Mean latency per call")[column],
      `${entry.decision.meanSecondsPerCall.toFixed(2)} s`,
    );
    assert.equal(
      row(decision, "Input tokens")[column],
      `${(entry.decision.inputTokens / 1e6).toFixed(2)} M (${Math.round(entry.decision.inputTokens / 105 / 1000)}K per attempt)`,
    );
    assert.equal(
      row(decision, "Output tokens")[column],
      entry.decision.outputTokens === 0
        ? "0"
        : `${(entry.decision.outputTokens / 1e6).toFixed(2)} M (${(entry.decision.outputTokens / 105 / 1000).toFixed(1)}K per attempt)`,
    );
    assert.equal(
      row(llm, "Calls")[column],
      `${entry.llm.calls} (${entry.llm.calls / 105} per attempt)`,
    );
    assert.equal(
      row(llm, "Mean review/report time per attempt")[column],
      `${entry.llm.meanReviewAndReportSecondsPerAttempt.toFixed(1)} s`,
    );
    // The source trajectories omit LLM token/cache usage. Those supplied rows
    // and cost estimates remain unchanged, not relabeled as independently audited.
    assert.equal(entry.llm.usageRecords, 0);
    for (const [fault, ...counts] of study.faultResults.rows) {
      const matching = measurements.faultIds.filter(
        (id) => id === fault || id.startsWith(`${fault}_`),
      );
      assert.equal(matching.length, 1, `Ambiguous fault: ${fault}`);
      assert.equal(
        counts[index],
        passes[measurements.faultIds.indexOf(matching[0])],
      );
    }
  }
});

test("this post uses means throughout and plain wording for corrected cases", async () => {
  const article = await readFile(
    new URL(
      "../../../content/blog/decision-model-led-sre-diagnosis.mdx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.doesNotMatch(article, /\bmedian\b/i);
  assert.doesNotMatch(article, /\bcatches\b|\bFor each catch\b/);
  assert.match(article, /For each corrected case/);
  assert.match(article, /We evaluated Jev and GPT-6 Luna Decisions on the same 21 SREGym-Lite faults/);
  assert.match(article, /We scored each report twice and counted a correction only when the original failed both times and the reviewed report passed both times\./);
  assert.doesNotMatch(JSON.stringify(study.results), /median/i);
  const byId = Object.fromEntries(
    measurements.configurations.map((entry) => [entry.id, entry]),
  );
  for (const [model, name] of [
    ["jev", "Jev"],
    ["luna", "Luna"],
  ]) {
    const reviewed = byId[`${model}-review`];
    const difference =
      reviewed.meanDiagnosisSeconds -
      byId[`${model}-none`].meanDiagnosisSeconds;
    assert.ok(
      article.replaceAll("**", "").includes(`${difference.toFixed(1)} seconds for ${name}`),
    );
    assert.ok(
      article.replaceAll("**", "").includes(
        `${reviewed.decision.meanSecondsPerAttempt.toFixed(2)} seconds`,
      ),
    );
  }
});

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
  assert.ok(article.replaceAll("**", "").includes("44.3 seconds"));
  assert.ok(article.replaceAll("**", "").includes("31.9 to 41.5 seconds"));
  assert.ok(!article.includes("Median diagnosis time"));
});
